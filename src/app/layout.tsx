import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthButton } from '@/components/auth-button';
// Removed Clerk import as Firebase Auth is used
// import { currentUser } from '@clerk/nextjs/server';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'UniReview',
  description: 'Review university units',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Removed server-side auth check logic that depended on Clerk.
  // The AuthButton component now determines the auth state client-side.

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
         <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4 md:px-6">
                 {/* You might want a logo or site title here */}
                <span className="font-bold">UniReview</span>
                {/* Removed isSignedIn prop, AuthButton will manage its state */}
                <AuthButton />
            </div>
        </header>
        <div className="flex-1"> {/* Ensure children take up remaining space */}
             {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
