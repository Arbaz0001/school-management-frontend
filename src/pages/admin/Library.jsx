import { useState, useEffect } from "react";
import api from "../../services/api";
import { Trash2, Edit2, Plus, Search } from "lucide-react";

export default function AdminLibrary() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "Others",
    quantity: 1,
    description: "",
    publishedYear: new Date().getFullYear(),
    language: "English",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/library");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const response = await api.get("/library/search", { params: { query } });
        setBooks(response.data);
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      fetchBooks();
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/library/${editingId}`, formData);
      } else {
        await api.post("/library", formData);
      }
      fetchBooks();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: "",
        author: "",
        isbn: "",
        category: "Others",
        quantity: 1,
        description: "",
        publishedYear: new Date().getFullYear(),
        language: "English",
      });
    } catch (error) {
      console.error("Error saving book:", error);
      alert(error.response?.data?.message || "Error saving book");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this book?")) {
      try {
        await api.delete(`/library/${id}`);
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const handleEdit = (book) => {
    setFormData(book);
    setEditingId(book._id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📚 Library Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage school library books</p>
      </div>

      {/* SEARCH & ADD BUTTON */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search books by title, author, or ISBN..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              title: "",
              author: "",
              isbn: "",
              category: "Others",
              quantity: 1,
              description: "",
              publishedYear: new Date().getFullYear(),
              language: "English",
            });
          }}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition"
        >
          <Plus size={20} /> Add Book
        </button>
      </div>

      {/* ADD/EDIT FORM */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Book" : "Add New Book"}</h2>
          <form onSubmit={handleAddBook} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Book Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Author *"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="ISBN"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Reference">Reference</option>
              <option value="Others">Others</option>
            </select>
            <input
              type="number"
              placeholder="Quantity *"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="1"
            />
            <input
              type="number"
              placeholder="Published Year"
              value={formData.publishedYear}
              onChange={(e) => setFormData({ ...formData, publishedYear: parseInt(e.target.value) })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="col-span-1 sm:col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="3"
            />
            <div className="col-span-1 sm:col-span-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                {editingId ? "Update Book" : "Add Book"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BOOKS TABLE/GRID */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading books...</div>
      ) : books.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md text-gray-500">
          No books found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Author</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Available</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {book.availableQuantity}/{book.quantity}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-blue-600 hover:text-blue-800 transition p-1"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-red-600 hover:text-red-800 transition p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {books.map((book) => (
              <div key={book._id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
                <h3 className="font-semibold text-gray-900">{book.title}</h3>
                <p className="text-sm text-gray-600">by {book.author}</p>
                <div className="mt-2 flex flex-wrap gap-2 items-center">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {book.category}
                  </span>
                  <span className="text-sm text-gray-600">
                    Available: {book.availableQuantity}/{book.quantity}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(book)}
                    className="flex-1 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="flex-1 text-red-600 hover:bg-red-50 px-3 py-2 rounded transition flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
