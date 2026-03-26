import { useEffect, useState } from "react";
import api from "../../services/api";
import { Bell, Calendar } from "lucide-react";

export default function Notices(){
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(()=>{
    const load = async()=>{
      setLoading(true);
      try {
        const res = await api.get('/notices');
        setNotices(res.data || []);
      } catch (err) {
        console.error("Error loading notices:", err);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  },[]);

  let filteredNotices = notices.filter(n => 
    n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (n.text || n.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortBy === "latest") {
    filteredNotices = filteredNotices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === "oldest") {
    filteredNotices = filteredNotices.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <Bell size={32} className="text-purple-600" />
          Notices & Announcements
        </h1>
        <div className="text-sm text-gray-600">
          Total: <strong>{notices.length}</strong>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 md:p-5 rounded shadow space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <input 
            type="text" 
            placeholder="Search notices..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-3 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Notices Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading notices...</p>
        </div>
      ) : filteredNotices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotices.map(n => (
            <div key={n._id} className="bg-white p-4 md:p-5 rounded shadow hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-base md:text-lg flex-1 pr-2">{n.title}</h3>
                <Bell size={20} className="text-purple-600 shrink-0" />
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{n.text || n.description}</p>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white p-6 rounded shadow">
          <p className="text-gray-500">{searchTerm ? 'No notices found matching your search' : 'No notices available'}</p>
        </div>
      )}
    </div>
  )
}