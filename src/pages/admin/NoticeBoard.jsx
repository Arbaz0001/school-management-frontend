import { useEffect, useState } from "react";
import api from "../../services/api";

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [text, setText] = useState("");

  const loadNotices = async () => {
    const res = await api.get("/notices");
    setNotices(res.data);
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const addNotice = async () => {
    await api.post("/notices", { text });
    setText("");
    loadNotices();
  };

  const removeNotice = async (id) => {
    await api.delete(`/notices/${id}`);
    loadNotices();
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Notice Board</h2>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New notice..."
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={addNotice}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {notices.map((n) => (
          <li
            key={n._id}
            className="bg-white shadow rounded p-3 flex justify-between"
          >
            <span>{n.text}</span>
            <button
              onClick={() => removeNotice(n._id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}