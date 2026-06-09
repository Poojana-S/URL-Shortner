import Url from "../models/Url.model.js";


export const redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      // Redirect to frontend 404 page
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      return res.redirect(`${clientUrl}/not-found`);
    }

    // Increment click count and update lastVisited
    url.clickCount += 1;
    url.lastVisited = new Date();
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    next(error);
  }
};
