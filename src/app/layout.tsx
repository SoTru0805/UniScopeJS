import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Changed from Geist/Geist_Mono
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthButton } from '@/components/auth-button';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' }); // Use Inter

export const metadata: Metadata = {
  title: 'UniScope', // Changed from UniReview
  description: 'Review university units',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply Inter font variable to the body */}
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
         <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4 md:px-6">
                <span className="font-bold">UniScope</span> {/* Changed from UniReview */}
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
