"use client";
import { useState, useEffect } from "react";
import { GridOn, Movie, BookmarkBorder } from "@mui/icons-material";
import { useAuth } from "@/app/context/AuthContext";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { PhotoCameraBack } from "@mui/icons-material";
import api from "../lib/api";
const ContentGrid = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-gray-400">
        <PhotoCameraBack sx={{ fontSize: 60 }} />
        <p className="text-xl font-semibold">No Content Yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 mt-4">
      {items.map((item) => (
        <div key={item._id} className="aspect-square bg-gray-800">
           {item.media ? (
            <img
              src={item.media}
              alt={item.caption || "User content"}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={item.video}
              alt={item.caption || "User content"}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
};
// The params prop will be populated by Next.js with the dynamic segment of the URL
export default function ProfilePage() {
  const { user: currentUser, logoutAction } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
 const [activeTab, setActiveTab] = useState('posts');
 
    useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        setLoading(true);
        // Call the new, simplified endpoint
        const response = await api.get('/users/me');
        setProfileData(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Ensure we only fetch when we know who the current user is
    if (currentUser) {
        fetchMyProfile();
    }
  }, [currentUser]); // Re-fetch if the user context changes// Re-fetch if the username in the URL changes
  if (loading || !profileData) {
    return <LoadingSpinner />;
  }

    // Destructure data for cleaner access in JSX
  const { user: profileUser, posts, reels } = profileData;
  return (
    <div className="px-4 py-8">
      {/* Profile Header */}
      <div className="flex items-center space-x-3 md:space-x-10 pb-6 border-b border-gray-700">
        <div className="space-y-4">
          <img
            src={profileUser.profilePhoto || "/OSK.jpg"} // path is relative to /public
            alt={profileUser.username}
            className="w-30 h-30 rounded-full"
          />
          <button className="bg-gray-700 hover:bg-gray-600 font-semibold px-4 py-1 rounded">
            Edit profile
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl">{profileUser.username}</h1>
            
              <button
                className="bg-red-600 hover:bg-red-500 font-semibold px-4 py-1 rounded-xl"
                onClick={logoutAction}
              >
                Logout
              </button>
           
          </div>
          <div className="flex space-x-8">
            <p>
              <span className="font-semibold">{posts.length}</span> posts
            </p>
          </div>
          <div>
            
            <p className="whitespace-pre-line">
              {profileUser.bio || "No bio available"}
            </p>
          </div>
        </div>
      </div>



      <div className="flex justify-center space-x-35 border-b border-gray-700 -mt-px">
        <button
          onClick={() => setActiveTab('posts')}
          // Conditionally apply active styles
          className={`flex items-center space-x-2 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'posts'
              ? 'border-t border-white text-white'
              : 'text-gray-500 border-t border-transparent'
          }`}
        >
          <GridOn sx={{ fontSize: 16 }} />
          <span>POSTS</span>
        </button>
        <button
          onClick={() => setActiveTab('reels')}
          // Conditionally apply active styles
          className={`flex items-center space-x-2 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'reels'
              ? 'border-t border-white text-white'
              : 'text-gray-500 border-t border-transparent'
          }`}
        >
          <Movie sx={{ fontSize: 16 }} />
          <span>REELS</span>
        </button>
        {/* Saved tab is visually present but disabled */}
        
      </div>

      {/* --- DYNAMIC CONTENT GRID --- */}
      <div>
        {/* Conditionally pass either the 'posts' or 'reels' array to the ContentGrid component */}
        {activeTab === 'posts' && <ContentGrid items={posts} />}
        {activeTab === 'reels' && <ContentGrid items={reels} />}
      </div>
    </div>
  );
}
