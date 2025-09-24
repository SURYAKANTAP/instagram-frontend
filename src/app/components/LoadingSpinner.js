export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-screen w-full bg-black">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-pink-500"></div>
        </div>
    );
}