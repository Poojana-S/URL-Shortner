import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, Trash2, ExternalLink, MousePointer, Calendar, Edit3 } from "lucide-react";
import toast from "react-hot-toast";
import { copyToClipboard, formatRelativeTime, formatDate, truncateUrl, formatNumber } from "../../utils/helpers.js";

const UrlCard = ({ url, onDelete, onEdit }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(url.shortUrl);
    if (success) {
      setCopied(true);
      toast.success("Short URL copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Delete short URL "${url.shortCode}"? This cannot be undone.`)) {
      onDelete(url._id);
    }
  };

  return (
    <div className="card-hover p-4 sm:p-5 animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        {/* Left: URL info */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          {url.title && (
            <p className="text-sm font-semibold text-white/90 mb-1 truncate">{url.title}</p>
          )}

          {/* Short URL */}
          <div className="flex items-center gap-2 mb-2">
            <a
              href={url.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 font-mono text-sm hover:text-brand-300 transition-colors flex items-center gap-1 group"
            >
              {url.shortUrl}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Original URL */}
          <p className="text-white/40 text-xs truncate" title={url.originalUrl}>
            {truncateUrl(url.originalUrl, 60)}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="flex items-center gap-1 text-xs text-white/40">
              <MousePointer className="w-3 h-3" />
              <span className="font-mono font-medium text-white/60">{formatNumber(url.clickCount)}</span>
              clicks
            </span>
            <span className="flex items-center gap-1 text-xs text-white/40">
              <Calendar className="w-3 h-3" />
              {formatDate(url.createdAt)}
            </span>
            {url.lastVisited && (
              <span className="text-xs text-white/30">
                Last: {formatRelativeTime(url.lastVisited)}
              </span>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleCopy}
            className={`btn-icon transition-all duration-200 ${
              copied ? "text-green-400 bg-green-400/10" : ""
            }`}
            title="Copy short URL"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onEdit(url)}
            className="btn-icon"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDelete}
            className="btn-icon text-red-400/50 hover:text-red-400 hover:bg-red-400/10"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrlCard;
