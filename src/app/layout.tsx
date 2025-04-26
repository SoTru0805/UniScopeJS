
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Changed from Geist/Geist_Mono
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthButton } from '@/components/auth-button';
import { Separator } from '@/components/ui/separator'; // Import Separator
import Link from 'next/link'; // Import Link
import { Button } from '@/components/ui/button'; // Import Button for link styling
import { LayoutDashboard } from 'lucide-react'; // Import icon

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
    <html lang="en" className="h-full">
      {/* Apply Inter font variable to the body */}
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}>
         <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4 md:px-6">
                 <div className="flex items-center gap-4"> {/* Group title and dashboard link */}
                    <Link href="/" className="font-bold text-lg text-primary hover:opacity-80 transition-opacity"> {/* Link to homepage */}
                       UniScope
                    </Link>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary">
                             <LayoutDashboard className="mr-2 h-4 w-4" />
                             Dashboard
                        </Link>
                    </Button>
                </div>
                 {/* AuthButton now contains the dropdown menu */}
                <AuthButton />
            </div>
        </header>
        <main className="flex-1 w-full"> {/* Main content takes remaining space */}
             {children}
        </main>
         <footer className="mt-auto w-full border-t bg-muted/50"> {/* Footer sticks to bottom */}
            <div className="container flex flex-col items-center justify-center gap-1 h-16 px-4 md:px-6 text-center">
                <p className="text-xs text-muted-foreground">
                 © {new Date().getFullYear()} UniScope. All rights reserved.
                </p>
                 {/* Optional: Add more footer links if needed */}
                 {/* <div className="flex gap-2 text-xs">
                   <a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a>
                   <Separator orientation="vertical" className="h-4" />
                   <a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a>
                 </div> */}
            </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
