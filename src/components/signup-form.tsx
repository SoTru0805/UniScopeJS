'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation'; // Import useRouter

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {useCreateUserWithEmailAndPassword} from "react-firebase-hooks/auth";
import {auth} from "@/app/firebase/config"

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // path of error
});

type SignUpFormValues = z.infer<typeof formSchema>;

interface SignUpFormProps {
  onSignUp: (data: Pick<SignUpFormValues, 'email' | 'password'>) => Promise<any>; // Only send email/password
}

export function SignUpForm({ onSignUp }: SignUpFormProps) {
  const { toast } = useToast();
  const router = useRouter(); // Initialize router
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleFormSubmit = async (data: SignUpFormValues) => {
    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth)
    const handleSignUp = async (email: string, password: string) =>{
      try {
        const res = await createUserWithEmailAndPassword(email, password)
        if (res) {
          console.log({res})
        }
      } catch (e){
        console.error(e)
      }
    }
    
    setIsSubmitting(true);
    try {
      // Only pass email and password to the server action
      await onSignUp({ email: data.email, password: data.password });
      toast({
        title: 'Account Created',
        description: 'Welcome to UniScope! Please log in.', // Changed from UniReview
      });
       // Redirect to login page after successful signup
      router.push('/login');
    } catch (error) {
      console.error('Failed to sign up:', error);
      toast({
        title: 'Sign Up Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-6 border rounded-lg shadow-sm bg-card">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} type="email" disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" {...field} type="password" disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" {...field} type="password" disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </Form>
  );
}
