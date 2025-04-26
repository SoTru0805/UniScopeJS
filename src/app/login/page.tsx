import { LoginForm } from '@/components/login-form';
import { signInUser } from '@/app/actions';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-primary">Login to UniScope</h1> {/* Changed from UniReview */}
        <LoginForm onSignIn={signInUser} />
         <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
             Sign up
            </Link>
        </p>
      </div>
    </main>
  );
}
