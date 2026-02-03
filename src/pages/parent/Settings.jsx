import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Settings(){
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Settings</h1>
      <p>Logged in as: <strong>{user?.name || user?.email}</strong></p>
      <p className="text-sm text-gray-500">Role: {user?.role}</p>
    </div>
  )
}
