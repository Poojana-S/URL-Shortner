import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { updateUrl } from "../../api/url.api.js";
import { getErrorMessage } from "../../utils/helpers.js";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner.jsx";

const EditUrlModal = ({ url, onClose, onUpdated }) => {
  const [form, setForm] = useState({ title: "", originalUrl: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (url) {
      setForm({ title: url.title || "", originalUrl: url.originalUrl || "" });
    }
  }, [url]);

  const validate = () => {
    const errs = {};
    if (!form.originalUrl.trim()) {
      errs.originalUrl = "URL is required";
    } else {
      try {
        const parsed = new URL(form.originalUrl);
        if (!["http:", "https:"].includes(parsed.protocol)) {
          errs.originalUrl = "URL must start with http:// or https://";
        }
      } catch {
        errs.originalUrl = "Please enter a valid URL";
      }
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const { data } = await updateUrl(url._id, form);
      toast.success("URL updated!");
      onUpdated(data.url);
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!url) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md card p-6 animate-slide-up shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Edit URL</h2>
          <button onClick={onClose} className="btn-icon">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title (optional)</label>
            <input
              className="input"
              placeholder="My awesome link"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Destination URL</label>
            <input
              className={`input ${errors.originalUrl ? "input-error" : ""}`}
              placeholder="https://example.com/long-url"
              value={form.originalUrl}
              onChange={(e) => setForm({ ...form, originalUrl: e.target.value })}
            />
            {errors.originalUrl && (
              <p className="text-red-400 text-xs mt-1">{errors.originalUrl}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUrlModal;
