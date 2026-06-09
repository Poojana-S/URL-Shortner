import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart2, MousePointer, Link2, TrendingUp, ExternalLink, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { getDashboardAnalytics } from "../api/url.api.js";
import { getErrorMessage, formatNumber, formatDate, formatRelativeTime, truncateUrl } from "../utils/helpers.js";
import StatCard from "../components/ui/StatCard.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await getDashboardAnalytics();
        setAnalytics(data.analytics);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!analytics) return null;

  const avgClicks =
    analytics.totalUrls > 0
      ? (analytics.totalClicks / analytics.totalUrls).toFixed(1)
      : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Analytics</h1>
        <p className="text-white/40 text-sm">Overview of your link performance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total Links"
          value={formatNumber(analytics.totalUrls)}
          icon={Link2}
          color="brand"
        />
        <StatCard
          label="Total Clicks"
          value={formatNumber(analytics.totalClicks)}
          icon={MousePointer}
          color="green"
        />
        <StatCard
          label="Avg. Clicks / Link"
          value={avgClicks}
          icon={BarChart2}
          color="purple"
        />
        <StatCard
          label="Top Link Clicks"
          value={formatNumber(analytics.mostVisited?.clickCount || 0)}
          icon={TrendingUp}
          color="orange"
          sub={analytics.mostVisited?.shortCode || "—"}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Most visited */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            Most Visited Link
          </h2>
          {analytics.mostVisited ? (
            <div className="space-y-3">
              <div className="bg-surface-2 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <a
                    href={analytics.mostVisited.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-400 font-mono text-sm hover:text-brand-300 flex items-center gap-1 transition-colors"
                  >
                    {analytics.mostVisited.shortUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="badge bg-orange-500/10 text-orange-400">
                    <MousePointer className="w-3 h-3" />
                    {formatNumber(analytics.mostVisited.clickCount)}
                  </span>
                </div>
                <p className="text-white/30 text-xs truncate">
                  → {analytics.mostVisited.originalUrl}
                </p>
              </div>
              <div className="flex gap-4 text-sm text-white/40">
                <span>Created: {formatDate(analytics.mostVisited.createdAt)}</span>
                {analytics.mostVisited.lastVisited && (
                  <span>Last visit: {formatRelativeTime(analytics.mostVisited.lastVisited)}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-white/30 text-sm">
              <MousePointer className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No clicks recorded yet
            </div>
          )}
        </div>

        {/* Recent links */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Link2 className="w-4 h-4 text-brand-400" />
              Recent Links
            </h2>
            <Link to="/dashboard" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {analytics.recentUrls.length > 0 ? (
            <div className="space-y-2">
              {analytics.recentUrls.map((url) => (
                <div
                  key={url._id}
                  className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-400 font-mono text-xs hover:text-brand-300 transition-colors block truncate"
                    >
                      {url.shortUrl}
                    </a>
                    <p className="text-white/30 text-xs truncate mt-0.5">
                      {truncateUrl(url.originalUrl, 40)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1 text-xs text-white/40">
                      <MousePointer className="w-3 h-3" />
                      {formatNumber(url.clickCount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/30 text-sm">
              <Link2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No links created yet
            </div>
          )}
        </div>
      </div>

      {/* Empty state CTA */}
      {analytics.totalUrls === 0 && (
        <div className="card p-10 text-center mt-6">
          <BarChart2 className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/50 mb-2 font-medium">No data yet</p>
          <p className="text-white/30 text-sm mb-6">
            Create some short URLs and start tracking clicks.
          </p>
          <Link to="/create" className="btn-primary mx-auto">
            Create a link <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Analytics;
