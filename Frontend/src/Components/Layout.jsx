import Navbar from "./Navbar"
import { Outlet } from 'react-router-dom';

function Users() {
    return (
        <div className="rounded-2xl container m-0 w-[95vw] lg:w-[1200px] h-[90vh] flex flex-col md:flex-row items-end-safe gap-2 md:gap-0 overflow-hidden md:shadow-[0_0_30px_rgba(0,0,0,0.2)]">
            <Navbar />
            <div className="item-2 rounded-2xl md:rounded-r-2xl w-full h-[82vh] sm:h-full border-gray-500/20 border md:border-none flex">
                <Outlet />
            </div>
        </div>
    )
}

export default Users
