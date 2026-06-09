import { Link } from "react-router-dom";
import { Home, Link2 } from "lucide-react";

const NotFound = () => (
  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
    <div className="text-center animate-fade-in">
      <div className="text-8xl font-bold text-gradient mb-4 font-mono">404</div>
      <h1 className="text-2xl font-bold text-white mb-3">Link not found</h1>
      <p className="text-white/50 mb-8 max-w-sm mx-auto">
        This short URL doesn't exist or may have been deleted.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="btn-primary">
          <Home className="w-4 h-4" />
          Go home
        </Link>
        <Link to="/create" className="btn-secondary">
          <Link2 className="w-4 h-4" />
          Create a link
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
