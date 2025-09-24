"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  HomeOutlined,
  Search,
  SearchOutlined,
  AddCircleOutline,
  AddCircle,
  MovieOutlined,
  Movie,
  AccountCircle,
  AccountCircleOutlined
} from '@mui/icons-material';

const BottomNavBar = () => {
  const pathname = usePathname();
  const username = "suryagamerz94"; // Placeholder, you might want to get this from context later

  const navLinks = [
    {
      name: 'Home',
      path: '/',
      icon: <HomeOutlined sx={{ fontSize: 30 }} />,
      activeIcon: <Home sx={{ fontSize: 30 }} />,
    },
    {
      name: 'Search',
      path: '/search',
      icon: <SearchOutlined sx={{ fontSize: 30 }} />,
      activeIcon: <Search sx={{ fontSize: 30 }} />,
    },
    {
      name: 'Create',
      path: '/create',
      icon: <AddCircleOutline sx={{ fontSize: 30 }} />,
      activeIcon: <AddCircle sx={{ fontSize: 30 }} />,
    },
    {
      name: 'Reels',
      path: '/reels',
      icon: <MovieOutlined sx={{ fontSize: 30 }} />,
      activeIcon: <Movie sx={{ fontSize: 30 }} />,
    },
    {
      name: 'Profile',
      // This is a simple way to check if the current path is the profile path
      path: `/${username}`,
      icon: <AccountCircleOutlined sx={{ fontSize: 30 }} />,
      activeIcon: <AccountCircle sx={{ fontSize: 30 }} />,
    },
  ];

  return (
    // The main container is fixed to the bottom and is only visible on screens smaller than 'md'
    <div className="fixed bottom-0 left-0 z-30 w-full h-16 bg-black border-t border-gray-700 md:hidden">
      <div className="flex items-center justify-around h-full">
        {navLinks.map((link) => {
          // Check if the current pathname matches the link's path
          const isActive = pathname === link.path;

          return (
            <Link key={link.name} href={link.path} className="flex-1 flex justify-center items-center h-full">
              {/* Conditionally render the active or inactive icon */}
              {isActive ? link.activeIcon : link.icon}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavBar;