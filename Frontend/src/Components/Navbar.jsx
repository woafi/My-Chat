import AnimatedDropdown from "./Dropdown"
import { Link } from "react-router-dom"

function Navbar() {
    return (
        <div className="rounded-2xl md:rounded-r-none md:rounded-l-2xl md:w-20 w-[50%] sm:w-[40%] md:h-full flex md:flex-col justify-center items-center bg-background transition-all duration-1800 shadow px-3 sm:px-6 py-1 md:p-0">
            {/* Upper Section */}
            <div className="md:border-r border-gray-500/20 w-full h-2/3 flex md:flex-col md:pt-6 items-center md:gap-5 justify-between md:justify-start">
                <Link to="/inbox">
                <div className="w-12 h-12 rounded-xl hover:bg-indigo-100 transition-all duration-500 cursor-pointer flex justify-center items-center">
                    <lord-icon
                        src="https://cdn.lordicon.com/jdgfsfzr.json"
                        trigger="hover"
                        stroke="bold"
                        state="hover-conversation-alt"
                        colors="primary:#121331,secondary:#8930e8"
                        className="scale-140 md:scale-160"
                    >
                    </lord-icon>
                </div>
                </Link>
                <Link to="/user">
                <div className="w-12 h-12 rounded-xl hover:bg-indigo-100 transition-all duration-500 cursor-pointer flex justify-center items-center">
                    <lord-icon
                        src="https://cdn.lordicon.com/gecjbhrh.json"
                        trigger="hover"
                        className="scale-120"
                    >
                    </lord-icon>
                </div>
                </Link>
                <div className="md:hidden"><AnimatedDropdown /></div>
            </div>
            {/* Lower Section */}
            <div className="hidden md:border-r border-gray-500/20 w-full h-1/3 md:flex flex-col pb-5 justify-end-safe items-center relative">
                <AnimatedDropdown />
            </div>
        </div>
    )
}

export default Navbar
