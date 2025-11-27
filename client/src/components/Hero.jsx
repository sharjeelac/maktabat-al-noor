import { Link } from "react-router-dom";

const Hero = () => {
  // You can replace this URL with any image you like later
  const bgImage =
    "https://images.stockcake.com/public/5/b/1/5b16cd96-8b6f-4e5f-a38a-7d8dbd520b8f_large/ancient-opened-book-stockcake.jpg";

  return (
    <div
      className="relative bg-cover bg-center py-32 px-4 text-center text-white overflow-hidden"
      // We use inline style here because the URL is long.
      // Tailwind equivalent would be: bg-[url('...')]
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* --- 1. THE DARK OVERLAY (Crucial for readability) --- */}
      {/* bg-black/70 means black background with 70% opacity */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Decorative Gold Glow (Kept from your code, made slightly stronger) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent opacity-20 rounded-full blur-3xl"></div>

      {/* --- 2. THE CONTENT --- */}
      {/* z-10 puts text on top of the overlay */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight shadow-sm">
          Maktabat<span className="text-accent"> Al-Noor</span>
        </h1>
        <p className="text-gray-200 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
          Welcome to Maktabat Al-Noor. Dive into our curated collection of rare,
          used, and classic Islamic and history books.
        </p>
        <div className="flex justify-center gap-4">
          {/* I made the button slightly bigger and added a hover effect */}
          <button
            // Simple trick to scroll down smoothly when clicked
            onClick={() => window.scrollTo({ top: 700, behavior: "smooth" })}
            className="bg-accent text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black hover:scale-105 transition-all shadow-lg shadow-accent/20 border"
          >
            Browse Books
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
