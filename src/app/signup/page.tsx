import { SignUpForm } from '@/components/signup-form';
import { signUpUser } from '@/app/actions';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-primary">Create UniReview Account</h1>
        <SignUpForm onSignUp={signUpUser} />
         <p className="text-center text-sm text-muted-foreground">
             Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
             Log in
            </Link>
        </p>
      </div>
    </main>
  );
}
