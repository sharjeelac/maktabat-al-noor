import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-lg md:rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100 overflow-hidden">
      {/* Image Area */}
      {/* Mobile: h-40, Desktop: h-64 */}
      <Link
        to={`/book/${book._id}`}
        className="h-40 md:h-64 overflow-hidden relative group bg-gray-200 block"
      >
        <img
          src={book.thumbnail}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Condition Badge - Smaller on mobile */}
        <span className="absolute top-1 right-1 md:top-2 md:right-2 bg-black/70 text-white text-[10px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded backdrop-blur-sm">
          {book.condition}
        </span>
      </Link>

      {/* Text Area */}
      <div className="p-2 md:p-4 flex flex-col grow">
        <p className="text-[10px] md:text-xs text-accent font-semibold uppercase tracking-wide mb-1">
          {book.category}
        </p>

        <Link to={`/book/${book._id}`}>
          {/* Title smaller on mobile */}
          <h3 className="text-sm md:text-lg font-bold text-gray-800 line-clamp-2 leading-tight hover:text-accent transition-colors mb-1">
            {book.title}
          </h3>
        </Link>

        <p className="text-xs md:text-sm text-gray-500 mb-2">
          by {book.author}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-base md:text-xl font-bold text-primary">
            ${book.price}
          </span>
          <Link
            to={`/book/${book._id}`}
            className="text-[10px] md:text-sm font-medium text-accent hover:text-primary transition-colors"
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
