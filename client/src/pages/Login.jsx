import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react"; // Spinner Icon import karein
import { baseUrl } from "../url";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false); // 1. New State for Loading
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // 2. Start Loading
    setError(false); // Purana error hata dein

    try {
      const res = await axios.post(`${baseUrl}/api/auth/login`, {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data));

      navigate("/admin");
      // Note: Hum yahan setLoading(false) nahi kar rahe kyunke page wese bhi change ho raha hai
    } catch (err) {
      setError(true);
      setLoading(false); // 3. Stop Loading only if Error
    }
  };

  return (
    <div className="flex items-center justify-center h-[80vh] bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-96 border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">
          Admin Login
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-accent transition-colors"
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading} // Loading ke waqt input band
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-accent transition-colors"
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading} // Loading ke waqt input band
          />
        </div>

        {/* 4. Improved Button UX */}
        <button
          disabled={loading} // Click hone ke baad button disable
          className={`w-full p-3 rounded-lg font-bold border transition-all mt-6 flex items-center justify-center gap-2
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed" // Loading style
                    : "bg-primary hover:bg-accent hover:text-primary" // Normal style
                }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Verifying...
            </>
          ) : (
            "Enter Dashboard"
          )}
        </button>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm mt-4 p-2 rounded text-center border border-red-200 animate-pulse">
            Wrong credentials! Try again.
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
