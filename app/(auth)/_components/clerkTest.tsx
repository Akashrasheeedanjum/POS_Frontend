// 'use client';
// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { signIn } from 'next-auth/react';
// import { useSearchParams } from 'next/navigation';
// import { useTransition } from 'react';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';
// import * as z from 'zod';


// import { useState } from "react";
// import { useSignIn } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";


// export const formSchema = z.object({
//   name: z
//     .string()
//     .min(1, { message: "Name is required" }),
//     // .email({ message: "Enter a valid email address" }),

//   password: z
//     .string()
//     .min(8, { message: "Password must be at least 8 characters long" })
//     .max(50, { message: "Password must not exceed 50 characters" })
//     .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
//     .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
//     .regex(/[0-9]/, { message: "Password must contain at least one number" })
//     .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character (@, $, !, %, *, ?, &, #)" }),
// });

// type UserFormValue = z.infer<typeof formSchema>;

// export default function UserAuthForm() {
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get('callbackUrl');
//   // const [loading, startTransition] = useTransition();

//   const [loading, setLoading] = useState(false);

//     const router = useRouter();
//   const { setActive }: {setActive:any} = useSignIn(); // gives us control to set Clerk session
  
//   const form = useForm<UserFormValue>({
//     resolver: zodResolver(formSchema),
//   });

//   const onSubmit = async (data: UserFormValue) => {

//     console.log('data', data)
//     // startTransition(() => {
//     //   signIn('credentials', {
//     //     email: data.email,
//     //     password: data.password,
//     //     callbackUrl: callbackUrl ?? '/dashboard'
//     //   });
//     //   toast.success('Signed In Successfully!');
//     // });

//     // till step 2 from chatgpt chat
//   setLoading(true)

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: data?.name, password: data?.password }),
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message || "Login failed");

//       console.log('result', result)

//       // Here you get JWT from your NestJS backend
//       const jwt = result?.token;

//       if(jwt){

//         await setActive({ session: jwt });
//         router.push("/dashboard/overview");
//         toast.success('Login Successful!')
//       }

//     } catch (err: any) {
//       console.error('Could not Login!', err)
//       toast.error('Could not Login!')
//     } finally {
//       setLoading(false);
//     }
//   }


//   return (
//     <>
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="w-full space-y-3"
//         >
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Name</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="text"
//                     placeholder="Enter your Name..."
//                     disabled={loading}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />


//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Password</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="password"
//                     placeholder="Enter your password..."
//                     disabled={loading}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <Button disabled={loading} className="mt-4 ml-auto w-full" type="submit">
//             Login
//           </Button>
//         </form>
//       </Form>
//       {/* <div className="relative">
//         <div className="absolute inset-0 flex items-center">
//           <span className="w-full border-t" />
//         </div>
//         <div className="relative flex justify-center text-xs uppercase">
//           <span className="bg-background px-2 text-muted-foreground">
//             Or continue with
//           </span>
//         </div>
//       </div>
//       <GithubSignInButton /> */}
//     </>
//   );
// }
