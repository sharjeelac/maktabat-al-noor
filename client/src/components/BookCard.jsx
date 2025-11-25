import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">
      {/* --- CHANGE: Replaced <div> with <Link> --- */}
      <Link
        to={`/book/${book._id}`}
        className="h-64 overflow-hidden relative group bg-gray-200 block"
      >
        <img
          src={book.thumbnail}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
          {book.condition}
        </span>
      </Link>
      {/* ------------------------------------------ */}

      {/* Text Area */}
      <div className="p-4 flex flex-col grow">
        <p className="text-xs text-accent font-semibold uppercase tracking-wide mb-1">
          {book.category}
        </p>

        {/* Optional: Make Title clickable too (Good UX) */}
        <Link to={`/book/${book._id}`}>
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1 hover:text-accent transition-colors">
            {book.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 mb-3">by {book.author}</p>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xl font-bold text-primary">${book.price}</span>
          <Link
            to={`/book/${book._id}`}
            className="text-sm font-medium text-accent hover:text-primary transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
