import Url from "../models/Url.model.js";
import { generateShortCode, sanitizeAlias, isValidUrl } from "../utils/url.utils.js";

export const createUrl = async (req, res, next) => {
  try {
    let { originalUrl, customAlias, title } = req.body;

    // Double-check URL validity
    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL. Must start with http:// or https://",
      });
    }

    let shortCode;

    if (customAlias) {
      // Sanitize and validate alias
      shortCode = sanitizeAlias(customAlias);
      if (shortCode.length < 3) {
        return res.status(400).json({
          success: false,
          message: "Custom alias must be at least 3 characters after sanitization.",
        });
      }

      // Check alias availability
      const existing = await Url.findOne({ shortCode });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: `The alias "${shortCode}" is already taken. Please choose another.`,
        });
      }
    } else {
      // Auto-generate unique short code
      let isUnique = false;
      while (!isUnique) {
        shortCode = generateShortCode();
        const exists = await Url.findOne({ shortCode });
        if (!exists) isUnique = true;
      }
    }

    const url = await Url.create({
      originalUrl,
      shortCode,
      title: title || "",
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Short URL created successfully!",
      url,
    });
  } catch (error) {
    next(error);
  }
};


export const getUserUrls = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build search filter
    const filter = { owner: req.user._id };
    if (search) {
      filter.$or = [
        { originalUrl: { $regex: search, $options: "i" } },
        { shortCode: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const allowedSortFields = ["createdAt", "clickCount", "lastVisited", "title"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const [urls, total] = await Promise.all([
      Url.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean({ virtuals: true }),
      Url.countDocuments(filter),
    ]);

    // Attach shortUrl manually since lean() skips virtuals sometimes
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const urlsWithShort = urls.map((u) => ({
      ...u,
      shortUrl: `${baseUrl}/${u.shortCode}`,
    }));

    res.status(200).json({
      success: true,
      urls: urlsWithShort,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUrlById = async (req, res, next) => {
  try {
    const url = await Url.findOne({
      _id: req.params.id,
      owner: req.user._id,
    }).lean({ virtuals: true });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found.",
      });
    }

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    url.shortUrl = `${baseUrl}/${url.shortCode}`;

    res.status(200).json({ success: true, url });
  } catch (error) {
    next(error);
  }
};

export const updateUrl = async (req, res, next) => {
  try {
    const { title, originalUrl } = req.body;

    // Verify ownership
    const url = await Url.findOne({ _id: req.params.id, owner: req.user._id });
    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found.",
      });
    }

    if (originalUrl && !isValidUrl(originalUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL. Must start with http:// or https://",
      });
    }

    if (title !== undefined) url.title = title;
    if (originalUrl) url.originalUrl = originalUrl;

    await url.save();

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const urlObj = url.toJSON();
    urlObj.shortUrl = `${baseUrl}/${url.shortCode}`;

    res.status(200).json({
      success: true,
      message: "URL updated successfully!",
      url: urlObj,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUrl = async (req, res, next) => {
  try {
    const url = await Url.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "URL deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};


export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalUrls, totalClicksResult, mostVisited, recentUrls] =
      await Promise.all([
        // Total URLs
        Url.countDocuments({ owner: userId }),

        // Total clicks (sum)
        Url.aggregate([
          { $match: { owner: userId } },
          { $group: { _id: null, total: { $sum: "$clickCount" } } },
        ]),

        // Most visited URL
        Url.findOne({ owner: userId }).sort({ clickCount: -1 }).lean(),

        // 5 most recently created
        Url.find({ owner: userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ]);

    const totalClicks = totalClicksResult[0]?.total || 0;
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    // Attach shortUrl to mostVisited
    if (mostVisited) {
      mostVisited.shortUrl = `${baseUrl}/${mostVisited.shortCode}`;
    }

    const recentWithShort = recentUrls.map((u) => ({
      ...u,
      shortUrl: `${baseUrl}/${u.shortCode}`,
    }));

    res.status(200).json({
      success: true,
      analytics: {
        totalUrls,
        totalClicks,
        mostVisited: mostVisited || null,
        recentUrls: recentWithShort,
      },
    });
  } catch (error) {
    next(error);
  }
};
