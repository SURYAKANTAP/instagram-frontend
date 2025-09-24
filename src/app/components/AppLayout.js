"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import BottomNavBar from './BottomNavBar';
import LoadingSpinner from './LoadingSpinner';
import StoryViewer from './StoryViewer';
import { useFeed } from '../context/FeedContext';
import { AnimatePresence } from 'framer-motion';

export default function AppLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
 const { isStoryViewerOpen } = useFeed();
    // List of pages that do not require authentication
    const publicPaths = ['/login', '/signup'];

    useEffect(() => {
        // Wait until the loading is complete
        if (loading) {
            return;
        }

        // If the user is not logged in AND is trying to access a protected page
        if (!user && !publicPaths.includes(pathname)) {
            router.push('/login');
        }

    }, [user, loading, pathname, router]);


    // While checking for user, show a loading screen
    if (loading) {
        return <LoadingSpinner />;
    }

    // If the user is not logged in and is on a public page (login/signup),
    // we don't want to show the main layout (Sidebar, Navbar, etc.).
    // The (auth)/layout.js will handle the layout for these pages.
    if (!user && publicPaths.includes(pathname)) {
        return <div className="w-full">{children}</div>;
    }

    // If the user is logged in, but we're still waiting for the redirect from a public page,
    // show a loading screen to prevent a layout flash.
    if (user && publicPaths.includes(pathname)) {
        return <LoadingSpinner />;
    }

    // If the user is not logged in and on a protected page, the useEffect is redirecting.
    // Return a loading spinner to avoid showing the page content before the redirect happens.
    if (!user) {
        return <LoadingSpinner />;
    }

    // If we've passed all checks, the user is logged in and on a protected page.
    // Show the full application layout.
    return (
        <div className="flex h-screen bg-black text-white w-full">
            {/* Sidebar for Desktop */}
            <div className="hidden md:flex">
                 <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto ">
                 {/* Centered Content Container */}
                 <div className="max-w-xl mx-auto">
                      {children}
                 </div>
            </main>

       <BottomNavBar />
       <AnimatePresence>
        {isStoryViewerOpen && <StoryViewer />}
      </AnimatePresence>
        </div>
    );
}