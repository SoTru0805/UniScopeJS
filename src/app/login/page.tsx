import { LoginForm } from '@/components/login-form';
import { signInUser } from '@/app/actions';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components
import { LogIn } from 'lucide-react'; // Import icon

export default function LoginPage() {
  return (
     // Use flex container for centering
    <main className="flex min-h-[calc(100vh-theme(spacing.14))] flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30"> {/* Adjusted min-height to account for header */}
       <Card className="w-full max-w-md shadow-lg"> {/* Wrap in Card */}
         <CardHeader className="space-y-1 text-center">
           <LogIn className="mx-auto h-8 w-8 text-primary" /> {/* Add icon */}
           <CardTitle className="text-2xl font-bold">Login to UniScope</CardTitle>
           <CardDescription>Enter your email and password to access your account.</CardDescription>
         </CardHeader>
         <CardContent>
           <LoginForm onSignIn={signInUser} />
         </CardContent>
         <CardFooter className="flex justify-center"> {/* Center footer content */}
             <p className="text-center text-sm text-muted-foreground">
                 Don't have an account?{' '}
                <Link href="/signup" className="font-medium text-primary hover:underline underline-offset-4">
                 Sign up
                </Link>
            </p>
         </CardFooter>
       </Card>
    </main>
  );
}
