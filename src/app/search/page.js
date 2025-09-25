"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from '@mui/icons-material';
import api from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Image from 'next/image';



export default function SearchPage() {
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                setLoading(true);
                const response = await api.get('/users');
                setAllUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllUsers();
    }, []); // Empty dependency array means this runs once on mount

    // Filter users based on the search term. This is calculated on every render.
    const filteredUsers = searchTerm
        ? allUsers.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : allUsers; // Show all users if search term is empty

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="py-8 px-4">
            <h1 className="text-2xl font-bold mb-4">Search</h1>
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search for users..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* --- Dynamic Search Results --- */}
            <div className="space-y-4">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <div key={user._id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 transition-colors">
                            <Image
                                src={user.profilePhoto || '/OSK.jpg'}
                                alt={user.username}
                                className="w-12 h-12 rounded-full object-cover"
                                width={48}
                                height={48}
                                 priority={true}
                            />
                            <div>
                                <p className="font-semibold">{user.username}</p>
                                {/* You could add the user's name here if you send it from the backend */}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 pt-10">
                        <p>No users found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

