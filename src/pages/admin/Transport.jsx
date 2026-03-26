import { useState, useEffect } from "react";
import api from "../../services/api";
import { Trash2, Edit2, Plus, Truck, MapPin, Phone } from "lucide-react";

export default function AdminTransport() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    busNumber: "",
    registrationNumber: "",
    driverName: "",
    driverPhone: "",
    driverEmail: "",
    helperName: "",
    helperPhone: "",
    helperEmail: "",
    capacity: 50,
    route: "",
    feePerMonth: 0,
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/transport");
      setBuses(response.data);
    } catch (error) {
      console.error("Error fetching buses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBus = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/transport/${editingId}`, formData);
      } else {
        await api.post("/transport", formData);
      }
      fetchBuses();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error("Error saving bus:", error);
      alert(error.response?.data?.message || "Error saving bus");
    }
  };

  const resetForm = () => {
    setFormData({
      busNumber: "",
      registrationNumber: "",
      driverName: "",
      driverPhone: "",
      driverEmail: "",
      helperName: "",
      helperPhone: "",
      helperEmail: "",
      capacity: 50,
      route: "",
      feePerMonth: 0,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this bus?")) {
      try {
        await api.delete(`/transport/${id}`);
        fetchBuses();
      } catch (error) {
        console.error("Error deleting bus:", error);
      }
    }
  };

  const handleEdit = (bus) => {
    setFormData(bus);
    setEditingId(bus._id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🚌 Transport Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage school buses and routes</p>
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
          <Plus size={20} /> Add Bus
        </button>
      </div>

      {/* ADD/EDIT FORM */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Bus" : "Add New Bus"}</h2>
          <form onSubmit={handleAddBus} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Bus Number *"
              value={formData.busNumber}
              onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Registration Number *"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <h3 className="col-span-1 sm:col-span-2 text-lg font-semibold text-gray-900 mt-4 mb-2">
              Driver Information
            </h3>
            <input
              type="text"
              placeholder="Driver Name *"
              value={formData.driverName}
              onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="tel"
              placeholder="Driver Phone *"
              value={formData.driverPhone}
              onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Driver Email"
              value={formData.driverEmail}
              onChange={(e) => setFormData({ ...formData, driverEmail: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <h3 className="col-span-1 sm:col-span-2 text-lg font-semibold text-gray-900 mt-4 mb-2">
              Helper Information
            </h3>
            <input
              type="text"
              placeholder="Helper Name"
              value={formData.helperName}
              onChange={(e) => setFormData({ ...formData, helperName: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Helper Phone"
              value={formData.helperPhone}
              onChange={(e) => setFormData({ ...formData, helperPhone: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <h3 className="col-span-1 sm:col-span-2 text-lg font-semibold text-gray-900 mt-4 mb-2">
              Bus Details
            </h3>
            <input
              type="number"
              placeholder="Bus Capacity *"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="1"
            />
            <input
              type="number"
              placeholder="Monthly Fee *"
              value={formData.feePerMonth}
              onChange={(e) => setFormData({ ...formData, feePerMonth: parseInt(e.target.value) })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
            <input
              type="text"
              placeholder="Route Name/Description *"
              value={formData.route}
              onChange={(e) => setFormData({ ...formData, route: e.target.value })}
              className="col-span-1 sm:col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="col-span-1 sm:col-span-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                {editingId ? "Update Bus" : "Add Bus"}
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

      {/* BUSES TABLE/GRID */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading buses...</div>
      ) : buses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md text-gray-500">
          No buses added yet
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Bus Number</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Driver</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Route</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Capacity</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Fee/Month</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((bus) => (
                  <tr key={bus._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{bus.busNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">{bus.driverName}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone size={12} /> {bus.driverPhone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-1">
                      <MapPin size={16} className="text-blue-600" />
                      {bus.route}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">{bus.capacity}</td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      ₹{bus.feePerMonth}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(bus)}
                        className="text-blue-600 hover:text-blue-800 transition p-1"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(bus._id)}
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
            {buses.map((bus) => (
              <div key={bus._id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-600">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Truck size={18} /> {bus.busNumber}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{bus.registrationNumber}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Active
                  </span>
                </div>
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Driver:</span> {bus.driverName}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} />
                    {bus.driverPhone}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={14} /> {bus.route}
                  </p>
                  <p>
                    <span className="font-medium">Capacity:</span> {bus.capacity} | <span className="font-medium">Fee:</span> ₹{bus.feePerMonth}
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(bus)}
                    className="flex-1 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bus._id)}
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
