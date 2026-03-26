import { useState, useEffect } from "react";
import api from "../../services/api";
import { Trash2, Edit2, Plus, Home, Users, Phone } from "lucide-react";

export default function AdminHostel() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    hostelName: "",
    type: "Boys",
    capacity: 100,
    address: "",
    phone: "",
    email: "",
    warden: { name: "", phone: "", email: "" },
    messCharge: 0,
    roomChargePerMonth: 0,
    otherCharges: 0,
    facilities: [],
  });

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const response = await api.get("/hostels");
      setHostels(response.data);
    } catch (error) {
      console.error("Error fetching hostels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHostel = async (e) => {
    e.preventDefault();
    try {
      const facilities = formData.facilities.split(",").map((f) => f.trim()).filter(Boolean);

      const payload = {
        ...formData,
        facilities,
      };

      if (editingId) {
        await api.put(`/hostels/${editingId}`, payload);
      } else {
        await api.post("/hostels", payload);
      }
      fetchHostels();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error("Error saving hostel:", error);
      alert(error.response?.data?.message || "Error saving hostel");
    }
  };

  const resetForm = () => {
    setFormData({
      hostelName: "",
      type: "Boys",
      capacity: 100,
      address: "",
      phone: "",
      email: "",
      warden: { name: "", phone: "", email: "" },
      messCharge: 0,
      roomChargePerMonth: 0,
      otherCharges: 0,
      facilities: [],
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this hostel?")) {
      try {
        await api.delete(`/hostels/${id}`);
        fetchHostels();
      } catch (error) {
        console.error("Error deleting hostel:", error);
      }
    }
  };

  const handleEdit = (hostel) => {
    setFormData({
      ...hostel,
      facilities: Array.isArray(hostel.facilities) ? hostel.facilities.join(", ") : "",
    });
    setEditingId(hostel._id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🏨 Hostel Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage school hostels and accommodations</p>
      </div>

      {/* ADD BUTTON */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition"
        >
          <Plus size={20} /> Add Hostel
        </button>
      </div>

      {/* ADD/EDIT FORM */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Hostel" : "Add New Hostel"}</h2>
          <form onSubmit={handleAddHostel} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Hostel Name *"
              value={formData.hostelName}
              onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
              <option value="Co-ed">Co-ed</option>
            </select>
            <input
              type="number"
              placeholder="Capacity *"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="1"
            />
            <input
              type="tel"
              placeholder="Contact Phone *"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="col-span-1 sm:col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Address *"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="col-span-1 sm:col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <h3 className="col-span-1 sm:col-span-2 text-lg font-semibold text-gray-900 mt-4 mb-2">
              Warden Information
            </h3>
            <input
              type="text"
              placeholder="Warden Name"
              value={formData.warden.name}
              onChange={(e) => setFormData({ ...formData, warden: { ...formData.warden, name: e.target.value } })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Warden Phone"
              value={formData.warden.phone}
              onChange={(e) => setFormData({ ...formData, warden: { ...formData.warden, phone: e.target.value } })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <h3 className="col-span-1 sm:col-span-2 text-lg font-semibold text-gray-900 mt-4 mb-2">
              Charges
            </h3>
            <input
              type="number"
              placeholder="Room Charge/Month"
              value={formData.roomChargePerMonth}
              onChange={(e) => setFormData({ ...formData, roomChargePerMonth: parseInt(e.target.value) })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
            <input
              type="number"
              placeholder="Mess Charge/Month"
              value={formData.messCharge}
              onChange={(e) => setFormData({ ...formData, messCharge: parseInt(e.target.value) })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
            <input
              type="number"
              placeholder="Other Charges"
              value={formData.otherCharges}
              onChange={(e) => setFormData({ ...formData, otherCharges: parseInt(e.target.value) })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
            <input
              type="text"
              placeholder="Facilities (comma separated, e.g., WiFi, Sports, Laundry)"
              value={typeof formData.facilities === "string" ? formData.facilities : formData.facilities.join(", ")}
              onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
              className="col-span-1 sm:col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="col-span-1 sm:col-span-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                {editingId ? "Update Hostel" : "Add Hostel"}
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

      {/* HOSTELS TABLE/GRID */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading hostels...</div>
      ) : hostels.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md text-gray-500">
          No hostels added yet
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hostel Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Warden</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Capacity</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Charges</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hostels.map((hostel) => (
                  <tr key={hostel._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{hostel.hostelName}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        hostel.type === "Boys" ? "bg-blue-100 text-blue-800" :
                        hostel.type === "Girls" ? "bg-pink-100 text-pink-800" :
                        "bg-purple-100 text-purple-800"
                      }`}>
                        {hostel.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <p className="font-medium">{hostel.warden?.name || "N/A"}</p>
                      <p className="text-xs text-gray-500">{hostel.warden?.phone || ""}</p>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">{hostel.capacity}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      <div className="text-xs">
                        <p>Room: ₹{hostel.roomChargePerMonth}</p>
                        <p>Mess: ₹{hostel.messCharge}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(hostel)}
                        className="text-blue-600 hover:text-blue-800 transition p-1"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(hostel._id)}
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
            {hostels.map((hostel) => (
              <div key={hostel._id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-600">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Home size={18} /> {hostel.hostelName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{hostel.address}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    hostel.type === "Boys" ? "bg-blue-100 text-blue-800" :
                    hostel.type === "Girls" ? "bg-pink-100 text-pink-800" :
                    "bg-purple-100 text-purple-800"
                  }`}>
                    {hostel.type}
                  </span>
                </div>
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Users size={14} />
                    Capacity: {hostel.capacity}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} />
                    {hostel.phone}
                  </p>
                  <p>
                    <span className="font-medium">Warden:</span> {hostel.warden?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Charges:</span> Room: ₹{hostel.roomChargePerMonth}, Mess: ₹{hostel.messCharge}
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(hostel)}
                    className="flex-1 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hostel._id)}
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
