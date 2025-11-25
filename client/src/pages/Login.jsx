import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../url";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/api/auth/login`, {
        username,
        password,
      });

      // 1. Save the Token to LocalStorage (The "Digital Badge")
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data)); // Save user info

      // 2. Go to Dashboard
      navigate("/admin");
    } catch (err) {
      setError(true);
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

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:border-accent"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:border-accent"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-primary border hover:bg-amber-200 p-3 rounded-lg font-bold hover:bg-accent transition-colors">
          Enter Dashboard
        </button>

        {error && (
          <span className="text-red-500 text-sm mt-4 block text-center">
            Wrong credentials!
          </span>
        )}
      </form>
    </div>
  );
};

export default Login;
