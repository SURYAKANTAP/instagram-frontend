"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../lib/api'; // Our configured Axios instance
import { useAuth } from './AuthContext';

const FeedContext = createContext();

export const useFeed = () => useContext(FeedContext);

export const FeedProvider = ({ children }) => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [stories, setStories] = useState([]);
     const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeStory, setActiveStory] = useState(null);
 const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            if (user) { // Only fetch if the user is logged in
                try {
                    setLoading(true);
                    // Fetch posts and stories in parallel for better performance
                    const [postsRes, storiesRes, reelsRes] = await Promise.all([
                        api.get('/posts'),
                        api.get('/stories'),
                        api.get('/reels')
                    ]);
                    console.log("Fetched posts:", postsRes.data);
                    console.log("Fetched stories:", storiesRes.data);
                    console.log("Fetched reels:", reelsRes.data);
                    setPosts(postsRes.data);
                    setStories(storiesRes.data);
                    setReels(reelsRes.data);
                } catch (error) {
                    console.error("Failed to fetch feed data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [user]); // Re-fetch data if the user changes (e.g., login/logout)

    // Function to handle liking/unliking a post with optimistic update
    const togglePostLike = (postId) => {
        const originalPosts = [...posts];
        // Find the post and optimistically update it
        const updatedPosts = posts.map(post => {
            if (post._id === postId) {
                const isLiked = post.likes.includes(user._id);
                const updatedLikes = isLiked
                    ? post.likes.filter(id => id !== user._id) // Unlike
                    : [...post.likes, user._id]; // Like
                return { ...post, likes: updatedLikes };
            }
            return post;
        });

        setPosts(updatedPosts); // Update UI immediately

        // Send API request in the background
        api.patch(`/posts/${postId}/like`).catch(err => {
            console.error("Failed to like post:", err);
            setPosts(originalPosts); // Revert UI on failure
        });
    };

    const addPost = (newPost) => {
        setPosts(prevPosts => [newPost, ...prevPosts]);
    }

     const addReel = (newReel) => {
        setReels(prev => [newReel, ...prev]);
    };
    const addStory = (newStory) => {
        setStories(prev => [newStory, ...prev]);
    };

     // --- NEW FUNCTION TO DELETE A POST ---
    const deletePost = (postId) => {
        // Save the current state in case we need to revert
        const originalPosts = [...posts];

        // Optimistically remove the post from the UI
        const updatedPosts = posts.filter(post => post._id !== postId);
        setPosts(updatedPosts);

        // Send the delete request to the backend
        api.delete(`/posts/${postId}`).catch(err => {
            console.error("Failed to delete post:", err);
            // If the API call fails, revert the UI to its original state
            setPosts(originalPosts);
            // Optionally, show an error message to the user
        });
    };
     // --- NEW FUNCTION TO DELETE A REEL ---
    const deleteReel = (reelId) => {
        // Save the current state in case we need to revert
        const originalReels = [...reels];

        // Optimistically remove the reel from the UI
        const updatedReels = reels.filter(reel => reel._id !== reelId);
        setReels(updatedReels);

        // Send the delete request to the backend
        api.delete(`/reels/${reelId}`).catch(err => {
            console.error("Failed to delete reel:", err);
            // If the API call fails, revert the UI to its original state
            setReels(originalReels);
            // Optionally, show an error message to the user
        });
    };

     // --- NEW FUNCTIONS TO CONTROL THE VIEWER ---
    const openStoryViewer = (story) => {
        setActiveStory(story);
        setIsStoryViewerOpen(true);
    };

    const closeStoryViewer = () => {
        setIsStoryViewerOpen(false);
        setActiveStory(null);
    };

     const deleteStory = (storyId) => {
        const originalStories = [...stories];

        // Optimistically remove the story from the UI state
        const updatedStories = stories.filter(story => story._id !== storyId);
        setStories(updatedStories);
        
        // Close the viewer immediately if the deleted story was the one being viewed
        closeStoryViewer();

        // Send the API request
        api.delete(`/stories/${storyId}`).catch(err => {
            console.error("Failed to delete story:", err);
            // Revert UI on failure
            setStories(originalStories);
        });
    };
    const value = {
        posts,
        stories,
        reels,
        loading,
        togglePostLike,
        addPost,
        addStory,
        addReel,
        deleteReel,
        deletePost,
        deleteStory,
        activeStory,
        isStoryViewerOpen,
        openStoryViewer,
        closeStoryViewer,
    };

    return (
        <FeedContext.Provider value={value}>
            {children}
        </FeedContext.Provider>
    );
};