import { SignUpForm } from '@/components/signup-form';
import { signUpUser } from '@/app/actions';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components
import { UserPlus } from 'lucide-react'; // Import icon

export default function SignUpPage() {
  return (
     // Use flex container for centering
    <main className="flex min-h-[calc(100vh-theme(spacing.14))] flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30"> {/* Adjusted min-height */}
       <Card className="w-full max-w-md shadow-lg"> {/* Wrap in Card */}
         <CardHeader className="space-y-1 text-center">
            <UserPlus className="mx-auto h-8 w-8 text-primary" /> {/* Add icon */}
           <CardTitle className="text-2xl font-bold">Create UniScope Account</CardTitle>
           <CardDescription>Enter your details below to create a new account.</CardDescription>
         </CardHeader>
         <CardContent>
           <SignUpForm onSignUp={signUpUser} />
         </CardContent>
         <CardFooter className="flex justify-center"> {/* Center footer content */}
              <p className="text-center text-sm text-muted-foreground">
                 Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
                 Log in
                </Link>
            </p>
         </CardFooter>
       </Card>
    </main>
  );
}
