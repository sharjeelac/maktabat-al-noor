import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Pencil,
  X,
  Image as ImageIcon,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { baseUrl } from "../url";

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // State for Uploading Spinner
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    category: "",
    condition: "Good",
    thumbnail: "",
    gallery: [],
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

  // --- 1. NEW: HANDLE FILE UPLOAD ---
  const uploadFileHandler = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("image", file); // 'image' must match backend middleware

    setUploading(true); // Start spinner

    try {
      const res = await axios.post(`${baseUrl}/api/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Backend returns: { url: "https://cloudinary..." }
      const imageUrl = res.data.url;

      if (type === "thumbnail") {
        setFormData({ ...formData, thumbnail: imageUrl });
      } else if (type === "gallery") {
        setFormData({ ...formData, gallery: [...formData.gallery, imageUrl] });
      }

      setUploading(false); // Stop spinner
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert("Image upload failed!");
    }
  };

  // --- REMOVE GALLERY IMAGE ---
  const handleRemoveGalleryImage = (indexToRemove) => {
    const updatedGallery = formData.gallery.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData({ ...formData, gallery: updatedGallery });
  };

  // --- EDIT & DELETE HANDLERS (Same as before) ---
  const handleEditClick = (book) => {
    setIsEditing(true);
    setCurrentId(book._id);
    setFormData({ ...book, gallery: book.gallery || [] });
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
      } else {
        await axios.post(`${baseUrl}/api/books`, formData, { headers });
        alert("Book Added!");
      }
      setIsEditing(false);
      fetchBooks();
      handleCancelEdit();
    } catch (err) {
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

            {/* --- NEW: THUMBNAIL UPLOAD --- */}
            <div className="border-t pt-2 mt-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Main Thumbnail
              </label>

              {/* File Input */}
              <div className="flex items-center gap-2 mt-1">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded flex items-center gap-2 text-sm text-gray-700 w-full justify-center border border-dashed border-gray-400">
                  {uploading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <UploadCloud size={16} />
                  )}
                  {uploading ? "Uploading..." : "Upload Cover Image"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => uploadFileHandler(e, "thumbnail")}
                  />
                </label>
              </div>

              {/* Preview Thumbnail */}
              {formData.thumbnail && (
                <div className="mt-2 w-full h-40 bg-gray-100 rounded overflow-hidden border relative">
                  <img
                    src={formData.thumbnail}
                    alt="thumb"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, thumbnail: "" })}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* --- NEW: GALLERY UPLOAD --- */}
            <div className="border-t pt-2 mt-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <ImageIcon size={14} /> Gallery Images (
                {formData.gallery.length})
              </label>

              <div className="mt-1">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded flex items-center gap-2 text-sm text-gray-700 w-full justify-center border border-dashed border-gray-400">
                  {uploading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Plus size={16} />
                  )}
                  {uploading ? "Uploading..." : "Add to Gallery"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => uploadFileHandler(e, "gallery")}
                  />
                </label>
              </div>

              {/* Preview Gallery */}
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
              disabled={uploading}
              className={`py-2 rounded font-bold text-white transition mt-4 ${
                isEditing ? "bg-accent text-primary" : "bg-primary"
              } disabled:bg-gray-400`}
            >
              {isEditing ? "Update Book" : "Publish Book"}
            </button>
          </form>
        </div>

        {/* --- LIST SECTION (Right Side) --- */}
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
