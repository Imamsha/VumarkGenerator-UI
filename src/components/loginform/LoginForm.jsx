import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginBg from "../../assets/loginBg.jpg"; // Ensure this path is correct

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const validUsername = "admin";
    const validPassword = "admin";

    if (username === validUsername && password === validPassword) {
      navigate("/home");
    } else {
      setError("Invalid username or password");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full bg-gray-100 p-4 bg-cover bg-center"
      style={{
        backgroundImage: `url(${LoginBg})`, // Fix: Wrap LoginBg in url()
      }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
        {/* Welcome Message */}
        <h2 className="text-lg sm:text-xl text-gray-700 text-center mb-4 font-roboto font-bold uppercase">
          Welcome to Visual Smart DC
        </h2>
        <h1 className="text-2xl sm:text-2xl text-blue-900 font-semibold uppercase text-center mb-6 font-roboto">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm sm:text-base font-roboto">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm sm:text-base font-roboto">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm sm:text-base mt-4 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;