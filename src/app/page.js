"use client";
import { useFeed } from './context/FeedContext';
import StoryBar from './components/StoryBar';
import PostCard from './components/PostCard';
import LoadingSpinner from './components/LoadingSpinner';

// It's good practice to create a skeleton for posts as well
const PostFeedSkeleton = () => (
    <div className="space-y-8 mt-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
                    <div className="h-4 w-32 bg-gray-700 rounded"></div>
                </div>
                <div className="h-96 bg-gray-700 rounded"></div>
            </div>
        ))}
    </div>
);


export default function HomePage() {
    // Get posts and loading state from the context
    const { posts, loading } = useFeed();

    return (
        <div className="py-4 px-2">
            {/* 1. Render StoryBar unconditionally. It handles its own loading state. */}
            <StoryBar />

            {/* 2. Check the loading state specifically for the posts feed. */}
            {loading ? (
                // If loading, show a placeholder specifically for the posts.
                <PostFeedSkeleton />
            ) : (
                // If not loading, show the actual posts.
                <div>
                    {posts.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}