"use client";
import { useState } from 'react';
import { Favorite, Comment, MoreVert, FavoriteBorder } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const ReelCard = ({ reel, handleLikeReel, handleDeleteReel }) => {
    const { user: currentUser } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Check if the current user is the author of the reel
    const isMyReel = currentUser?._id === reel.user._id;
    const isLiked = reel.likes.includes(currentUser?._id);

    const onDelete = () => {
        if (window.confirm("Are you sure you want to delete this reel?")) {
            handleDeleteReel(reel._id);
        }
        setIsMenuOpen(false);
    };

    return (
        <div className="h-full snap-center flex-shrink-0 relative">
            <video src={reel.video} loop autoPlay muted className="w-full h-full" />
            <div className="absolute bottom-0 left-0 p-4 text-white z-10">
                <p className="font-semibold">@{reel.user.username}</p>
                <p className="text-sm">{reel.caption}</p>
            </div>
            <div className="absolute bottom-10 right-2 p-4 flex flex-col items-center space-y-6 text-white z-10">
                <button onClick={() => handleLikeReel(reel._id)} className="flex flex-col items-center">
                    {isLiked ? <Favorite className="text-red-500" sx={{ fontSize: 35 }}/> : <FavoriteBorder sx={{ fontSize: 35 }}/>}
                    <span className="text-sm font-semibold">{reel.likes.length}</span>
                </button>
                <div className="flex flex-col items-center">
                    <Comment sx={{ fontSize: 35 }}/>
                    <span className="text-sm font-semibold">{reel.comments.length}</span>
                </div>
                
                {/* --- DELETE REEL MENU --- */}
                {/* Conditionally render the menu icon only on your own reels */}
                {isMyReel && (
                    <div className="relative">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <MoreVert sx={{ fontSize: 35 }} />
                        </button>
                        {isMenuOpen && (
                             <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-800 rounded-md shadow-lg z-20">
                                <button
                                    onClick={onDelete}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700"
                                >
                                    Delete Reel
                                </button>
                             </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReelCard;