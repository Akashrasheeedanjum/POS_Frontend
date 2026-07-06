'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
// import { signIn } from 'next-auth/react';
// import { redirect, useSearchParams } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { useState } from "react";
import { useSignIn, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";



export const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" }),

  password: z
    .string()
    .max(50, { message: "Password must not exceed 50 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character (@, $, !, %, *, ?, &, #)" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {

  const { sessionId, isLoaded, isSignedIn } = useAuth();
  console.log('sessionId of clerk', sessionId)
  console.log('isLoaded of clerk', isLoaded)
  console.log('isSignedIn of clerk', isSignedIn)
  const router = useRouter();
  const { signIn } = useSignIn();
  const { setActive, signOut } = useClerk();
  const [loading, setLoading] = useState(false);

  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get('callbackUrl');

    // ✅ Redirect if already logged in
  // useEffect(() => {
  //   if (isLoaded && isSignedIn) {
  //     // router.replace('/dashboard/overview');
  //     redirect('/dashboard/overview')
  //   }
  // }, [isLoaded, isSignedIn, router]);
  
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: UserFormValue) => {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/\/$/, '');
    if (!apiUrl) {
      toast.error('API URL is not configured. Set NEXT_PUBLIC_API_URL in Vercel.');
      return;
    }

    if (!isLoaded || !signIn) {
      toast.error('Auth is still loading. Please wait and try again.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data?.name, password: data?.password }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'Invalid name or password');
      }

      await signOut();

      const clerkSignInToken = result?.clerkSignInToken;
      if (!clerkSignInToken) {
        throw new Error('Login succeeded but Clerk token was missing from API response');
      }

      const exchange = await signIn.create({
        strategy: 'ticket',
        ticket: clerkSignInToken,
      });

      if (!exchange?.createdSessionId) {
        throw new Error('Clerk session could not be created');
      }

      await setActive({ session: exchange.createdSessionId });
      router.push('/dashboard/overview');
      toast.success('Login Successful!');
    } catch (err: any) {
      console.error('Error while login!', err);
      toast.error(err?.message || err?.errors?.[0]?.message || 'Error while login!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your name..."
                    disabled={loading}
                    {...field}
                  />
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
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Login
          </Button>
        </form>
      </Form>
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GithubSignInButton /> */}
    </>
  );
}
