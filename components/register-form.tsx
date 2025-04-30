"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { Signup } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
const SignupForm = () => {
  const router = useRouter();
  const isAuthenticated = useSession().status === "authenticated";
  useEffect(() => {
    isAuthenticated && router.push("/");
  }, [isAuthenticated, router]);
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      profileImage: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const result = registerSchema.safeParse(data);
    if (!result.success) {
      console.log("Error:\n", result.error.format());
      return;
    }
    const { username, email, password } = data;
    const response = await Signup({ username, email, password });
    if (response.success) {
      signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/",
      });
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Welcome to Notecraft</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
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
                      <Input {...field} placeholder="******" type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full cursor-pointer hover:bg-white hover:text-black transition-all"
              disabled={
                form.formState.isSubmitting || form.formState.isValidating
              }
            >
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between flex-col">
        <Link
          className="text-lg underline hover:text-blue-600"
          href="/auth/login"
        >
          Already have an account ?
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
