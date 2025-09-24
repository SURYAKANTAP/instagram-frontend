"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFeed } from '../context/FeedContext';
import { Close, MoreHoriz } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';

const STORY_DURATION_SECONDS = 5;

const StoryViewer = () => {
   const { isStoryViewerOpen, activeStory, closeStoryViewer, deleteStory } = useFeed();
    const { user: currentUser } = useAuth(); 
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Add keyboard support to close the story with the Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeStoryViewer();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeStoryViewer]);
 useEffect(() => {
        setIsMenuOpen(false);
    }, [activeStory]);
    if (!isStoryViewerOpen || !activeStory) {
        return null;
    }
 const isMyStory = currentUser?._id === activeStory.user._id;
    // A simple check to see if the media is a video
    const isVideo = activeStory.media.endsWith('.mp4') || activeStory.media.endsWith('.webm');

const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this story?")) {
            deleteStory(activeStory._id);
            // The context will handle closing the viewer
        }
    };
    return (
        <motion.div
            initial={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
            animate={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            exit={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
            onClick={closeStoryViewer} // Close by clicking the backdrop
            className="fixed inset-0 z-50 flex items-center justify-center"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the modal
                className="relative w-full max-w-md h-[90vh] bg-black rounded-lg overflow-hidden"
            >
                {/* --- PROGRESS BAR --- */}
                <div className="absolute top-2 left-2 right-2 h-1 bg-gray-500/50 rounded-full">
                    <motion.div
                        // The key is crucial. It forces Framer Motion to re-render and restart the animation when the story changes.
                        key={activeStory._id}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: STORY_DURATION_SECONDS, ease: 'linear' }}
                        onAnimationComplete={closeStoryViewer} // Close when progress bar finishes
                        className="h-full bg-white rounded-full"
                    />
                </div>

                {/* --- HEADER --- */}
                <div className="absolute top-6 left-4 flex items-center z-10">
                    <Image src={activeStory.user.profilePhoto || '/OSK.jpg'} alt={activeStory.user.username} className="w-8 h-8 rounded-full object-cover" />
                    <p className="ml-2 text-white font-semibold">{activeStory.user.username}</p>
                </div>
                <div className="absolute top-6 right-4 flex items-center space-x-2 text-white z-10">
                    {/* --- DELETE STORY MENU --- */}
                    {isMyStory && (
                        <div className="relative">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <MoreHoriz />
                            </button>
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg">
                                    <button
                                        onClick={handleDelete}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700"
                                    >
                                        Delete Story
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    <button onClick={closeStoryViewer}><Close sx={{ fontSize: 30 }} /></button>
                </div>

                {/* --- STORY CONTENT --- */}
                {isVideo ? (
                    <video
                        src={activeStory.media}
                        autoPlay
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <Image
                        src={activeStory.media}
                        alt="Story content"
                        className="w-full h-full object-contain"
                    />
                )}
            </motion.div>
        </motion.div>
    );
};

export default StoryViewer;