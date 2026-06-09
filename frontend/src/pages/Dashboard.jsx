import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, X, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { getUserUrls, deleteUrl } from "../api/url.api.js";
import { getErrorMessage } from "../utils/helpers.js";
import UrlCard from "../components/ui/UrlCard.jsx";
import EditUrlModal from "../components/ui/EditUrlModal.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const SORT_OPTIONS = [
  { value: "createdAt", label: "Newest first", order: "desc" },
  { value: "createdAt_asc", label: "Oldest first", order: "asc" },
  { value: "clickCount", label: "Most clicked", order: "desc" },
  { value: "lastVisited", label: "Recently visited", order: "desc" },
];

const Dashboard = () => {
  const { user } = useAuth();

  const [urls, setUrls] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortIndex, setSortIndex] = useState(0);
  const [editingUrl, setEditingUrl] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUrls = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const sort = SORT_OPTIONS[sortIndex];
      const sortBy = sort.value.replace("_asc", "");
      const { data } = await getUserUrls({
        page,
        limit: 10,
        search: debouncedSearch,
        sortBy,
        order: sort.order,
      });
      setUrls(data.urls);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sortIndex]);

  // Re-fetch when search or sort changes (reset to page 1)
  useEffect(() => {
    fetchUrls(1);
  }, [fetchUrls]);

  const handleDelete = async (id) => {
    try {
      await deleteUrl(id);
      toast.success("URL deleted");
      fetchUrls(pagination.page);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleUpdated = (updatedUrl) => {
    setUrls((prev) => prev.map((u) => (u._id === updatedUrl._id ? updatedUrl : u)));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchUrls(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            My Links
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {pagination.total} {pagination.total === 1 ? "link" : "links"} total
          </p>
        </div>
        <Link to="/create" className="btn-primary self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          New URL
        </Link>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            className="input pl-10 pr-9"
            placeholder="Search URLs, titles, short codes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <select
            className="input pl-9 pr-4 appearance-none cursor-pointer w-full sm:w-48"
            value={sortIndex}
            onChange={(e) => setSortIndex(Number(e.target.value))}
          >
            {SORT_OPTIONS.map((opt, i) => (
              <option key={i} value={i}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* URL list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : urls.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-white/20" />
          </div>
          {debouncedSearch ? (
            <>
              <p className="text-white/60 font-medium mb-1">No results found</p>
              <p className="text-white/30 text-sm">
                Try a different search term
              </p>
            </>
          ) : (
            <>
              <p className="text-white/60 font-medium mb-2">No links yet</p>
              <p className="text-white/30 text-sm mb-6">
                Create your first short URL to get started.
              </p>
              <Link to="/create" className="btn-primary mx-auto">
                <Plus className="w-4 h-4" /> Create your first link
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {urls.map((url) => (
            <UrlCard
              key={url._id}
              url={url}
              onDelete={handleDelete}
              onEdit={setEditingUrl}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="btn-secondary px-3 py-2 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter((p) => {
                const cur = pagination.page;
                return p === 1 || p === pagination.pages || Math.abs(p - cur) <= 1;
              })
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) {
                  acc.push("...");
                }
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-white/30">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      p === pagination.page
                        ? "bg-brand-600 text-white"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="btn-secondary px-3 py-2 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Edit modal */}
      <EditUrlModal
        url={editingUrl}
        onClose={() => setEditingUrl(null)}
        onUpdated={handleUpdated}
      />
    </div>
  );
};

export default Dashboard;
