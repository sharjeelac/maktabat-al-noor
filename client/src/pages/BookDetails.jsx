import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Loader2, ShoppingCart, MessageCircle } from "lucide-react";
import { baseUrl } from "../url";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // New State: To handle which image is currently showing big
  const [activeImage, setActiveImage] = useState("");

  const ADMIN_PHONE_NUMBER = "923005902238"; // <--- Update this

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/books/${id}`);
        setBook(res.data);
        setActiveImage(res.data.thumbnail); // Default to thumbnail
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-accent" />
      </div>
    );
  if (!book) return <div className="text-center p-20">Book not found!</div>;

  const handleWhatsAppClick = () => {
    const message = `As-salamu alaykum! I am interested in buying the book: "${book.title}". Is it available?`;
    const whatsappUrl = `https://wa.me/${ADMIN_PHONE_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Browse
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {/* --- LEFT: IMAGE GALLERY SECTION --- */}
        <div className="flex flex-col gap-4">
          {/* 1. Big Active Image */}
          <div className="bg-gray-50 rounded-xl p-4 flex justify-center items-center h-[500px]">
            <img
              src={activeImage}
              alt={book.title}
              className="max-h-full max-w-full shadow-lg rounded-sm object-contain"
            />
          </div>

          {/* 2. Small Thumbnails (Only show if there are gallery images) */}
          {book.gallery && book.gallery.length > 0 && (
            <div className="flex gap-2 overflow-x-auto py-2">
              {/* Always show the main thumbnail as an option */}
              <img
                src={book.thumbnail}
                onClick={() => setActiveImage(book.thumbnail)}
                className={`w-20 h-28 object-cover rounded cursor-pointer border-2 ${
                  activeImage === book.thumbnail
                    ? "border-accent"
                    : "border-transparent"
                }`}
              />

              {/* Show gallery images */}
              {book.gallery.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-28 object-cover rounded cursor-pointer border-2 ${
                    activeImage === img ? "border-accent" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Details (No Changes Here) */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-accent text-sm font-bold uppercase tracking-wider">
              {book.category}
            </span>
            <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
              {book.condition} Condition
            </span>
          </div>

          <h1 className="text-4xl font-bold text-primary mb-2 leading-tight">
            {book.title}
          </h1>
          <p className="text-xl text-gray-500 mb-6 italic">by {book.author}</p>

          <div className="text-3xl font-bold text-primary mb-8 border-b pb-8 border-gray-100">
            ${book.price}
          </div>

          <div className="prose text-gray-600 mb-8 leading-relaxed">
            <h3 className="text-lg font-bold text-primary mb-2">Description</h3>
            <p>{book.description}</p>
          </div>

          <div className="flex gap-4 mt-auto">
            {/* <button className="flex-1 bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg">
              <ShoppingCart size={22} /> Buy Now
            </button> */}
            <button
              onClick={handleWhatsAppClick}
              className="flex-1 border-2 border-green-500 text-green-600 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={22} /> Chat on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
