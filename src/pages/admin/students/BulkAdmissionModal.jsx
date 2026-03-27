import { useState } from "react";
import api from "../../../services/api";

export default function BulkAdmissionModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");
    try {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);

      await api.post("/students/bulk", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Bulk admission completed");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Bulk upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-lg font-semibold mb-4">Bulk Admission</h2>

        <label className="flex items-center gap-3 px-4 py-3 bg-gray-50 border rounded cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 2a1 1 0 00-1 1v6H5l3 3 3-3H9V3a1 1 0 00-1-1z" />
            <path d="M3 13a2 2 0 012-2h10a2 2 0 012 2v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
          </svg>
          <span className="text-sm">Choose Excel (.xlsx/.xls)</span>
          <input type="file" accept=".xlsx,.xls" onChange={handleSelect} className="hidden" />
        </label>

        {file && (
          <div className="mt-3 text-sm text-gray-700">
            Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(0)} KB)
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleUpload} disabled={uploading} className={`px-4 py-2 rounded ${uploading ? 'bg-gray-400' : 'bg-blue-600 text-white'}`}>
            {uploading ? 'Uploading...' : 'Upload & Process'}
          </button>
        </div>
      </div>
    </div>
  );
}