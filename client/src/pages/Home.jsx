import { useEffect, useState, useRef } from "react"; // useRef import karein
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Hero from "../components/Hero";
import BookCard from "../components/BookCard";
import { Loader2 } from "lucide-react";
import { baseUrl } from "../url";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // 1. Ek Reference banayen jahan scroll karna hai
  const booksSectionRef = useRef(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/books`);
        setBooks(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // 2. Auto-Scroll Logic
  useEffect(() => {
    if (searchQuery && booksSectionRef.current) {
      // Thora wait karke scroll karein taake user type kar sake
      setTimeout(() => {
        booksSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 500);
    }
  }, [searchQuery]); // Jab bhi searchQuery change hogi, ye chalega

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchParams({});
  };

  return (
    <>
      <Hero />

      {/* 3. Ref yahan lagayen taake JS ko pata chale kahan scroll karna hai */}
      <div
        ref={booksSectionRef}
        className="container mx-auto px-4 py-16 scroll-mt-20"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h2 className="text-3xl font-bold text-primary">
            {searchQuery ? `Results for "${searchQuery}"` : "Latest Arrivals"}
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin text-accent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">
                  No books found matching "{searchQuery}"
                </p>
                <button
                  onClick={clearSearch}
                  className="mt-2 text-accent font-bold hover:underline"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
