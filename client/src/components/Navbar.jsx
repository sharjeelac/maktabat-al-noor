import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, BookOpen, User } from "lucide-react";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const currentSearch = searchParams.get("search");
    if (currentSearch) setQuery(currentSearch);
    else setQuery("");
  }, [searchParams]);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    if (text.trim().length > 0) {
      navigate(`/?search=${text}`);
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* 1. LOGO (Text hidden on mobile to save space) */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <BookOpen className="text-accent w-8 h-8" />
          <span className="hidden md:block font-bold text-xl tracking-wider">
            Maktabat <span className="text-accent">Al-Noor</span>
          </span>
        </Link>

        {/* 2. SEARCH BAR (Visible on ALL screens) */}
        {/* flex-1 means it will take all available empty space */}
        <div className="flex flex-1 items-center bg-white rounded-full px-4 py-2 max-w-md mx-auto border">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-gray-800 outline-none w-full text-sm" // w-full important hai
            value={query}
            onChange={handleInputChange}
          />
          <Search className="text-gray-500 w-4 h-4" />
        </div>

        {/* 3. LINKS (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          <Link to="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <Link
            to="/login"
            className="hover:text-accent transition-colors"
            title="Admin Login"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
