export default function ReelsLayout({ children }) {
    // This layout provides a full-height, centered container specifically for the reels.
    // It overrides the default padding from the root AppLayout's main content area.
    return (
        <div className="flex justify-center items-center w-full h-screen">
            {children}
        </div>
    );
}