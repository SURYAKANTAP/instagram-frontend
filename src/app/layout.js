import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import { FeedProvider } from './context/FeedContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Instagram",
  description: "A clone of Instagram built with the MERN stack and Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
      >
         <AuthProvider>
            <FeedProvider>
               <AppLayout>
                   {children}
               </AppLayout>
            </FeedProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
