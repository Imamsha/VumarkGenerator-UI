import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add any logout logic here (e.g., clear auth state, localStorage, etc.)
    navigate("/"); // Redirect to login page
  };

  return (
    <header className="w-full bg-blue-900 text-white p-4 shadow-md  fixed top-0">
      <div className="flex items-center justify-between px-8 max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold font-roboto">
          Visual Smart DC
        </h1>
        <button
          onClick={handleLogout}
          className="px-3 py-1 sm:px-4 sm:py-2 bg-red-400 hover:bg-red-500 text-white font-medium rounded-md transition-colors text-sm sm:text-base font-roboto"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;