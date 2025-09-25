"use client";
import { useState } from 'react';
import {
  FavoriteBorder,
  ModeCommentOutlined,
  SendOutlined,
  BookmarkBorder,
  Favorite,
  MoreVert,
} from "@mui/icons-material";
import Image from 'next/image';

import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';

const PostCard = ({ post }) => {
   const { user: currentUser } = useAuth();
  const { togglePostLike, deletePost } = useFeed();
 // State to manage the visibility of the delete menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determine if the current user owns this post
  const isMyPost = currentUser?._id === post.user._id;
  // Determine if the current user has liked this post
  const isLiked = post.likes.includes(currentUser._id);

  const handleLike = () => {
    togglePostLike(post._id);
  };

   const handleDelete = () => {
    // Optionally add a confirmation dialog
    if (window.confirm("Are you sure you want to delete this post?")) {
        deletePost(post._id);
    }
  };
  return (
    <div className="border-b border-gray-700 mb-8">
       <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
            <Image
            src={post.user.profilePhoto || '/OSK.jpg'}
            alt={post.user.username}
            className="h-8 w-8 rounded-full object-cover"
            width={32}
            height={32}
             priority={true}
            />
            <p className="ml-3 font-semibold">{post.user.username}</p>
        </div>

        {/* --- DELETE POST MENU --- */}
        {/* Conditionally render the menu icon only for the post's author */}
        {isMyPost && (
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <MoreVert sx={{ fontSize: 35 }}/>
            </button>
            {/* The dropdown menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700"
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Image
        src={post.media || "/OSK.jpg"} // path is relative to /public
        alt="Post Media"
            
         className="w-full h-auto"
          width={600}
          height={600}
           priority={true}
      />

      {/* Post Actions */}
      <div className="flex justify-between p-4">
        <div className="flex space-x-4">
           <button onClick={handleLike}>
            {isLiked ? <Favorite className="text-red-500" /> : <FavoriteBorder />}
          </button>
          <ModeCommentOutlined />
          <SendOutlined />
        </div>
        <div>
          <BookmarkBorder />
        </div>
      </div>

      {/* Post Info */}
      <div className="px-4 pb-4">
        <p className="font-semibold">{post.likes.length} likes</p>
        <p>
          <span className="font-semibold">{post.user.username}</span>{" "}
          {post.caption}
        </p>
        <p className="text-gray-400 text-sm mt-2">
          View all {post.comments.length} comments
        </p>
        <input
          type="text"
          placeholder="Add a comment..."
          className="bg-transparent w-full mt-2 outline-none"
        />
      </div>
    </div>
  );
};

export default PostCard;
