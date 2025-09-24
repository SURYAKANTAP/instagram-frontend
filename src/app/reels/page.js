"use client";
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ReelCard from '../components/ReelCard'; // <-- Import the new component

export default function ReelsPage() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchReels = async () => {
            if (currentUser) {
                try {
                    const res = await api.get('/reels');
                    setReels(res.data);
                } catch (error) {
                    console.error("Failed to fetch reels:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchReels();
    }, [currentUser]);

    const handleLikeReel = (reelId) => {
        const originalReels = [...reels];
        const updatedReels = reels.map(reel => {
            if (reel._id === reelId) {
                const isLiked = reel.likes.includes(currentUser._id);
                const updatedLikes = isLiked
                    ? reel.likes.filter(id => id !== currentUser._id)
                    : [...reel.likes, currentUser._id];
                return { ...reel, likes: updatedLikes };
            }
            return reel;
        });
        setReels(updatedReels);

        api.patch(`/reels/${reelId}/like`).catch(err => {
            console.error("Failed to like reel:", err);
            setReels(originalReels);
        });
    };
    
    // --- NEW FUNCTION TO DELETE A REEL ---
    const handleDeleteReel = (reelId) => {
        const originalReels = [...reels];
        
        // Optimistically remove the reel from the UI
        const updatedReels = reels.filter(reel => reel._id !== reelId);
        setReels(updatedReels);
        
        // Send delete request to the backend
        api.delete(`/reels/${reelId}`).catch(err => {
            console.error("Failed to delete reel:", err);
            // Revert UI on failure
            setReels(originalReels);
        });
    };
    
    if (loading) return <LoadingSpinner />;

    return (
        <div className="h-full w-full max-w-sm bg-black rounded-lg">
            <div className="h-full snap-y snap-mandatory overflow-y-scroll no-scrollbar rounded-lg">
                 {reels.map(reel => (
                    <ReelCard
                        key={reel._id}
                        reel={reel}
                        handleLikeReel={handleLikeReel}
                        handleDeleteReel={handleDeleteReel}
                    />
                ))}
            </div>
        </div>
    );
}