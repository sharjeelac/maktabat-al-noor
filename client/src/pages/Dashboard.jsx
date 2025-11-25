import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Pencil, X, Image as ImageIcon } from "lucide-react";
import { baseUrl } from "../url"; // Ensure you use your baseUrl

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // 1. New State for typing a gallery URL
  const [tempGalleryUrl, setTempGalleryUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    category: "",
    condition: "Good",
    thumbnail: "",
    gallery: [], // Array for multiple images
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/books`);
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- LOGIC TO ADD IMAGE TO LIST ---
  const handleAddGalleryImage = (e) => {
    e.preventDefault(); // Prevent form submit
    if (tempGalleryUrl.trim()) {
      setFormData({
        ...formData,
        gallery: [...formData.gallery, tempGalleryUrl],
      });
      setTempGalleryUrl(""); // Clear input
    }
  };

  // --- LOGIC TO REMOVE IMAGE FROM LIST ---
  const handleRemoveGalleryImage = (indexToRemove) => {
    const updatedGallery = formData.gallery.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData({ ...formData, gallery: updatedGallery });
  };

  const handleEditClick = (book) => {
    setIsEditing(true);
    setCurrentId(book._id);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      category: book.category,
      condition: book.condition,
      thumbnail: book.thumbnail,
      gallery: book.gallery || [], // Load existing gallery
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      title: "",
      author: "",
      description: "",
      price: "",
      category: "",
      condition: "Good",
      thumbnail: "",
      gallery: [],
    });
    setTempGalleryUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const headers = { token: `Bearer ${token}` };

    try {
      if (isEditing) {
        await axios.put(`${baseUrl}/api/books/${currentId}`, formData, {
          headers,
        });
        alert("Book Updated!");
        setIsEditing(false);
      } else {
        await axios.post(`${baseUrl}/api/books`, formData, { headers });
        alert("Book Added!");
      }
      fetchBooks();
      handleCancelEdit(); // Reset form
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseUrl}/api/books/${id}`, {
        headers: { token: `Bearer ${token}` },
      });
      setBooks(books.filter((book) => book._id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-primary">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- FORM SECTION --- */}
        <div
          className={`p-6 rounded-xl shadow-md h-fit border transition-colors ${
            isEditing
              ? "bg-yellow-50 border-accent"
              : "bg-white border-gray-100"
          }`}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              {isEditing ? (
                <Pencil className="text-accent" />
              ) : (
                <Plus className="text-accent" />
              )}
              {isEditing ? "Edit Book" : "Add New Book"}
            </span>
            {isEditing && (
              <button
                onClick={handleCancelEdit}
                className="text-xs text-red-500 flex items-center gap-1 hover:underline"
              >
                <X size={14} /> Cancel
              </button>
            )}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Title"
              className="border p-2 rounded"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Author"
              className="border p-2 rounded"
              required
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              rows="4"
              className="border p-2 rounded"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Price"
                className="border p-2 rounded w-1/2"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />

              <select
                className="border p-2 rounded w-1/2"
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Category"
              className="border p-2 rounded"
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />

            {/* --- MAIN THUMBNAIL INPUT --- */}
            <div className="border-t pt-2 mt-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Main Thumbnail
              </label>
              <input
                type="text"
                placeholder="Main Image URL"
                className="border p-2 rounded w-full mt-1"
                required
                value={formData.thumbnail}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value })
                }
              />
            </div>

            {/* --- GALLERY SECTION (NEW) --- */}
            <div className="border-t pt-2 mt-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <ImageIcon size={14} /> Gallery Images (
                {formData.gallery.length})
              </label>

              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Add extra image URL"
                  className="border p-2 rounded w-full"
                  value={tempGalleryUrl}
                  onChange={(e) => setTempGalleryUrl(e.target.value)}
                />
                <button
                  type="button" // Important: type="button" so it doesn't submit form
                  onClick={handleAddGalleryImage}
                  className="bg-gray-200 hover:bg-gray-300 p-2 rounded text-primary"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Show added small images */}
              {formData.gallery.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.gallery.map((url, index) => (
                    <div
                      key={index}
                      className="relative w-12 h-16 border rounded overflow-hidden group"
                    >
                      <img
                        src={url}
                        alt="gal"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              className={`py-2 rounded font-bold text-white bg-black hover:bg-white hover:text-black border transition mt-4 ${
                isEditing ? "bg-accent text-primary" : "bg-primary"
              }`}
            >
              {isEditing ? "Update Book" : "Publish Book"}
            </button>
          </form>
        </div>

        {/* --- LIST SECTION --- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Inventory ({books.length})</h2>
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-gray-500 text-sm">
                  <th className="py-2">Image</th>
                  <th className="py-2">Title</th>
                  <th className="py-2">Price</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <img
                        src={book.thumbnail}
                        alt=""
                        className="w-10 h-14 object-cover rounded shadow-sm"
                      />
                    </td>
                    <td className="py-3 font-medium">{book.title}</td>
                    <td className="py-3">${book.price}</td>
                    <td className="py-3 flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(book)}
                        className="text-blue-500 hover:bg-blue-50 p-2 rounded transition"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
