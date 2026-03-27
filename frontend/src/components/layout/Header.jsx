import { useState } from "react";
import { FaSearch, FaBolt, FaBell } from "react-icons/fa";

function Header({ userData = { avatar: "NK" }, hasNotification, onClearNotification}) {
    const [searchTerm, setSearchTerm] = useState("");
    return (
        <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100">
            <div className="flex items-center bg-indigo-50/50 text-gray-500 px-4 py-2 rounded-xl w-96 border border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-all">
                <FaSearch className="text-indigo-400 mr-2" />
                <input 
                    type="text" 
                    placeholder="Search lectures..." 
                    className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-5">
                <button className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold transition shadow-sm">
                    <FaBolt size={12} color="orange" className="text-yellow-200" /> 
                    Nâng cấp
                </button>
                <button className="relative text-orange-400 hover:text-orange-500 transition" onClick={onClearNotification}>
                    <FaBell size={22} />
                    {hasNotification && (
                        <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    )}
                </button>
                <button className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-md hover:opacity-90 transition">
                    {userData.avatar}
                </button>
            </div>
            
        </header>
    );
}

export default Header;