"use client";
export default function AuthLayout({ children }) {
    return (
        <div className="bg-black text-white flex items-center justify-center h-screen">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-lg shadow-lg">
                {children}
            </div>
        </div>
    );
}