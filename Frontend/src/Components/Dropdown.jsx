import { useState, useRef, useEffect } from 'react';
import useWindowWidth from '../hooks/useWindowWidth'
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import showToast from "../utils/toastify"



const AnimatedDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const onSmallScreen = useWindowWidth(768);

  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      label: 'Profile', action: () => {
        navigate("/profile");
      }
    },
    {
      label: 'Sign Out', action: () => {
        logout();
        // toast
        showToast({
          text: "You are being logged out...",
          duration: 1500,
        });
        navigate("/");
      }
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className="flex bg-secondary overflow-hidden items-center justify-center scale-170 w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl shadow-lg  hover:bg-indigo-100 transition-all cursor-pointer ease-in-out transform"
      >
        <div>
          <img src={currentUser.avatar ? currentUser.avatar : "https://res.cloudinary.com/dxlliybl6/image/upload/v1754137890/nophoto_ezov6r.png"} alt="" />
        </div>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute border border-gray-300 ${onSmallScreen ? 'top-full right-0' : 'bottom-12 left-[-10px]'} mt-2 w-48 bg-background rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out transform origin-bottom ${isOpen
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
          }`}
      >
        <div className="py-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.action();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-black hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 ease-in-out focus:outline-none"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedDropdown;