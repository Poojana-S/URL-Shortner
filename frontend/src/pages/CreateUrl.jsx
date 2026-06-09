import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link2, Sparkles, Copy, Check, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { createUrl } from "../api/url.api.js";
import { getErrorMessage, copyToClipboard } from "../utils/helpers.js";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";

const CreateUrl = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ originalUrl: "", customAlias: "", title: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(false);

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
    if (form.customAlias && !/^[a-zA-Z0-9_-]{3,30}$/.test(form.customAlias)) {
      errs.customAlias = "Alias must be 3-30 characters (letters, numbers, - _)";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { data } = await createUrl(form);
      setCreated(data.url);
      toast.success("Short URL created!");
      setForm({ originalUrl: "", customAlias: "", title: "" });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!created) return;
    await copyToClipboard(created.shortUrl);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Shorten a URL
        </h1>
        <p className="text-white/50">Paste a long link and we'll make it tiny.</p>
      </div>

      <div className="card p-7 mb-6">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Original URL */}
          <div>
            <label className="label">
              Destination URL <span className="text-red-400">*</span>
            </label>
            <input
              name="originalUrl"
              type="url"
              className={`input text-base ${errors.originalUrl ? "input-error" : ""}`}
              placeholder="https://very-long-url-you-want-to-shorten.com/path?query=param"
              value={form.originalUrl}
              onChange={handleChange}
              autoFocus
            />
            {errors.originalUrl && (
              <p className="text-red-400 text-xs mt-1.5">{errors.originalUrl}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="label">
              Title <span className="text-white/30 font-normal">(optional)</span>
            </label>
            <input
              name="title"
              type="text"
              className="input"
              placeholder="e.g. My portfolio, Product launch..."
              value={form.title}
              onChange={handleChange}
              maxLength={100}
            />
          </div>

          {/* Custom alias */}
          <div>
            <label className="label">
              Custom alias <span className="text-white/30 font-normal">(optional)</span>
            </label>
            <div className="flex items-center">
              <span className="px-4 py-3 bg-surface-3 border border-r-0 border-white/10 rounded-l-xl text-white/30 text-sm font-mono whitespace-nowrap">
                {import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/
              </span>
              <input
                name="customAlias"
                type="text"
                className={`input rounded-l-none flex-1 ${errors.customAlias ? "input-error" : ""}`}
                placeholder="my-link"
                value={form.customAlias}
                onChange={handleChange}
                maxLength={30}
              />
            </div>
            {errors.customAlias ? (
              <p className="text-red-400 text-xs mt-1.5">{errors.customAlias}</p>
            ) : (
              <p className="text-white/30 text-xs mt-1.5">
                Leave blank to auto-generate a short code
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3.5 text-base"
            disabled={loading}
          >
            {loading ? (
              <><LoadingSpinner size="sm" /> Creating…</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Shorten URL</>
            )}
          </button>
        </form>
      </div>

      {/* Success result */}
      {created && (
        <div className="card border-brand-500/30 p-6 animate-slide-up glow">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
            <h3 className="font-semibold text-white">Your short URL is ready!</h3>
          </div>

          <div className="bg-surface-2 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <Link2 className="w-4 h-4 text-brand-400 shrink-0" />
              <a
                href={created.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-400 font-mono text-sm hover:text-brand-300 transition-colors flex-1 truncate"
              >
                {created.shortUrl}
              </a>
              <button onClick={handleCopy} className={`btn ${copied ? "text-green-400" : "text-white/50 hover:text-white"} p-2 rounded-lg`}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <p className="text-white/30 text-xs truncate mb-4">→ {created.originalUrl}</p>

          <div className="flex gap-3">
            <button
              onClick={() => setCreated(null)}
              className="btn-secondary flex-1 text-sm"
            >
              Shorten another
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-primary flex-1 text-sm"
            >
              View dashboard <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateUrl;
