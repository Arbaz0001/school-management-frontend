import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email: userId, password });
      login(res.data);
      navigate(`/${res.data.user.role}/dashboard`);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

        <section className="relative overflow-hidden bg-[#2f4ea2] px-8 py-12 text-white sm:px-12 lg:px-16 lg:py-16">
          <div className="mx-auto flex h-full w-full max-w-xl flex-col justify-between">
            <p className="text-xl font-semibold tracking-wide sm:text-2xl">SCHOOLERP</p>

            <div className="my-10 rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
              <div className="mx-auto mb-8 h-44 w-full max-w-xs rounded-2xl border border-white/30 bg-[#365ab7] p-4 shadow-xl">
                <svg viewBox="0 0 280 140" className="h-full w-full" aria-hidden="true">
                  <rect x="28" y="88" width="224" height="12" rx="4" fill="#7088cc" />
                  <rect x="44" y="98" width="14" height="30" fill="#7088cc" />
                  <rect x="222" y="98" width="14" height="30" fill="#7088cc" />
                  <rect x="92" y="22" width="96" height="58" rx="10" fill="#d9e2ff" />
                  <circle cx="140" cy="51" r="15" fill="#4a5a90" />
                  <polygon points="134,43 146,51 134,59" fill="#f8fafc" />
                  <circle cx="196" cy="52" r="14" fill="#efb4c1" />
                  <rect x="186" y="64" width="22" height="24" rx="6" fill="#8a6f88" />
                </svg>
              </div>

              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                A few more clicks to sign in to your account.
              </h1>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-20 top-0 hidden h-full w-40 rounded-l-[120px] bg-slate-100/90 lg:block" />
        </section>

        <section className="flex items-center justify-center bg-slate-100 px-5 py-10 sm:px-10">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.14)] sm:p-10">
            <h2 className="text-center text-3xl font-bold leading-tight text-slate-800 sm:text-4xl">
              Samaritans English Medium Sr. Sec. School
            </h2>
            <p className="mt-3 text-center text-lg font-semibold text-slate-700">
              Parents &amp; Students Sign In
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="user-id" className="mb-2 block text-sm font-medium text-slate-600">
                  User ID
                </label>
                <input
                  id="user-id"
                  type="text"
                  placeholder="User ID"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-600">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="inline-flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="font-medium text-slate-600 transition hover:text-blue-700"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-3.5 text-base font-semibold text-white transition duration-200 ${
                  loading
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-blue-700 shadow-md shadow-blue-700/20 hover:-translate-y-0.5 hover:bg-blue-800"
                }`}
              >
                {loading ? "Signing In..." : "Login"}
              </button>
            </form>

            <p className="mt-8 text-sm leading-relaxed text-slate-600">
              By signing up, you agree to our {" "}
              <button type="button" className="font-medium text-blue-700 transition hover:text-blue-800">
                Terms and Conditions
              </button>
              {" "}&amp;{" "}
              <button type="button" className="font-medium text-blue-700 transition hover:text-blue-800">
                Privacy Policy
              </button>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
