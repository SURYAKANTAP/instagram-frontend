"use client";
import { useFeed } from '../context/FeedContext';
import Image from 'next/image';
const StoryBar = () => {
     const { stories, openStoryViewer } = useFeed();

    return (
        <div className="flex space-x-4 p-4 border-b border-gray-700 overflow-x-auto no-scrollbar">
             {stories.map((story) => (
                // Use a button for accessibility and attach the onClick handler
                <button
                    key={story._id}
                    onClick={() => openStoryViewer(story)} // <-- This is the trigger
                    className="flex flex-col items-center space-y-1 flex-shrink-0"
                >
                    <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full p-0.5">
                        <div className="bg-black rounded-full p-0.5">
                           <Image className="h-16 w-16 rounded-full object-cover" src={story.user.profilePhoto || "/OSK.jpg"} alt={story.user.username} />
                        </div>
                    </div>
                    <p className="text-xs truncate w-20 text-center">{story.user.username}</p>
                </button>
            ))}
        </div>
    );
};

export default StoryBar;