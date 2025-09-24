"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext'; // We will use this later

export default function LoginPage() {
    const { loginAction } = useAuth(); // Use the login action from context
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await loginAction({ email, password });
            // Redirect is handled within loginAction
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-center font-serif">Instagram</h1>
            <form onSubmit={handleSubmit} className="space-y-4 mt-8">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold">
                    Log In
                </button>
            </form>
            <p className="text-center text-sm text-gray-400 mt-8">
                Don't have an account?{' '}
                <Link href="/signup" className="font-semibold text-blue-500 hover:underline">
                    Sign Up
                </Link>
            </p>
        </>
    );
}