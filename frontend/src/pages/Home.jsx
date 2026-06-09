import { Link } from "react-router-dom";
import { Link2, Zap, BarChart2, Shield, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const features = [
  {
    icon: Zap,
    title: "Instant shortening",
    desc: "Turn any URL into a short, shareable link in seconds.",
  },
  {
    icon: BarChart2,
    title: "Click analytics",
    desc: "Track every click with detailed statistics and timestamps.",
  },
  {
    icon: Shield,
    title: "Custom aliases",
    desc: "Create branded, memorable short codes for your links.",
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-slow" />
          Free URL shortener with analytics
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Short links,{" "}
          <span className="text-gradient">big impact</span>
        </h1>

        <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          Create clean, trackable short URLs in seconds. Monitor clicks, manage
          your links, and grow your reach.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link to="/create" className="btn-primary text-base px-8 py-3">
              Shorten a URL <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-base px-8 py-3">
                Get started free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="btn-secondary text-base px-8 py-3">
                Sign in
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 hover:border-brand-500/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
