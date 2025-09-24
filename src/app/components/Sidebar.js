"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Movie,
  Send,
  AddCircleOutline,
  AccountCircle,
  Menu,
  Logout, // Import the Logout icon
} from "@mui/icons-material";
import { useAuth } from "@/app/context/AuthContext"; // -> Step 2: Import the useAuth hook (adjust path if needed)
import LoadingSpinner from "@/app/components/LoadingSpinner"; // A loading component is good practice

const Sidebar = () => {
     const { user, logoutAction } = useAuth();
  const [isOpen, setIsOpen] = useState(true); // State to control sidebar visibility
  const username = "suryagamerz94"; // Placeholder

  const navLinks = [
    { icon: <Home sx={{ fontSize: 30 }} />, name: "Home", path: "/" },
    { icon: <Search sx={{ fontSize: 30 }} />, name: "Search", path: "/search" },
    { icon: <Movie sx={{ fontSize: 30 }} />, name: "Reels", path: "/reels" },
    
    { icon: <AddCircleOutline sx={{ fontSize: 30 }} />, name: "Create", path: "/create" },
    { icon: <AccountCircle sx={{ fontSize: 30 }} />, name: "Profile", path: `/${username}` },
  ];

  // Framer Motion variants for the sidebar container
  const sidebarVariants = {
    open: {
      width: "16rem", // 256px
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      width: "5rem", // 80px
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  // Framer Motion variants for the text labels
  const textVariants = {
    open: { opacity: 1, x: 0, display: "block" },
    closed: { opacity: 0, x: -10, transitionEnd: { display: "none" } },
  };

   if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isOpen ? "open" : "closed"}
      className="flex flex-col justify-between h-full p-4 border-r border-gray-700 relative"
    >
      <div>
        <div className="flex items-center justify-between mb-10">
           {/* Instagram Logo/Title */}
           <AnimatePresence>
            {isOpen && (
                <motion.h1
                    key="logo"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, transition: {duration: 0.2} }}
                    className="text-2xl font-serif font-bold whitespace-nowrap"
                >
                    Instagram
                </motion.h1>
             )}
            </AnimatePresence>

          {/* Toggle Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="p-1">
            <Menu sx={{ fontSize: 35 }} />
          </button>
        </div>
        <nav>
          <ul>
            {navLinks.map((link) => (
              <li key={link.name} className="mb-4">
                <Link
                  href={link.path}
                  className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {link.icon}
                  <motion.span
                    variants={textVariants}
                    className="text-lg whitespace-nowrap"
                  >
                    {link.name}
                  </motion.span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mb-4">
        {/* Updated Logout Button */}
        <button className="flex w-full items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"  onClick={logoutAction}>
          <Logout sx={{ fontSize: 30 }} />
          <motion.span
            variants={textVariants}
            className="text-lg whitespace-nowrap"
          >
            Logout
          </motion.span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;