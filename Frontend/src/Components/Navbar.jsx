import AnimatedDropdown from "./Dropdown";
import { NavLink } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";

function Navbar() {
  const { unreadCount } = useNotification();
  return (
    <div className="rounded-2xl md:rounded-r-none md:rounded-l-2xl md:w-20 w-[50%] sm:w-[40%] md:h-full flex md:flex-col justify-center items-center bg-background transition-all duration-1800 shadow px-3 sm:px-6 py-1 md:p-0">
      {/* Upper Section */}
      <div className="md:border-r border-gray-500/20 w-full h-2/3 flex md:flex-col md:pt-6 items-center md:gap-5 justify-between md:justify-start">
        <NavLink
          to="/inbox"
          className={({ isActive }) =>
             `sm:w-13 h-12 w-12 sm:h-13 rounded-lg transition-all duration-500 cursor-pointer flex justify-center items-center ${
              isActive ? "bg-indigo-200" : "hover:bg-indigo-100"
            }`
          }
        >
          <lord-icon
            src="https://cdn.lordicon.com/jdgfsfzr.json"
            trigger="hover"
            stroke="bold"
            state="hover-conversation-alt"
            colors="primary:#121331,secondary:#8930e8"
            className="scale-140 md:scale-160"
          ></lord-icon>
        </NavLink>

        <NavLink
          to="/user"
          className={({ isActive }) =>
             `sm:w-13 h-12 w-12 sm:h-13 rounded-lg transition-all duration-500 cursor-pointer flex justify-center items-center ${
              isActive ? "bg-indigo-200" : "hover:bg-indigo-100"
            }`
          }
        >
          <lord-icon
            src="https://cdn.lordicon.com/gecjbhrh.json"
            trigger="hover"
            className="scale-120"
          ></lord-icon>
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
             `sm:w-13 h-12 w-12 sm:h-13 rounded-lg transition-all duration-500 cursor-pointer flex justify-center items-center ${
              isActive ? "bg-indigo-200" : "hover:bg-indigo-100"
            }`
          }
        >
          <div className="relative">
            <lord-icon
              src="https://cdn.lordicon.com/psnhyobz.json"
              trigger="hover"
              colors="primary:#121331,secondary:#8930e8"
              className="scale-120"
            ></lord-icon>
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </div>
        </NavLink>

        <div className="md:hidden">
          <AnimatedDropdown />
        </div>
      </div>

      {/* Lower Section */}
      <div className="hidden md:border-r border-gray-500/20 w-full h-1/3 md:flex flex-col pb-5 justify-end-safe items-center relative">
        <AnimatedDropdown />
      </div>
    </div>
  );
}

export default Navbar;
