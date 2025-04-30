"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas";
import { useRouter } from "next/navigation";
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
import { useEffect, useState } from "react";
const LoginForm = () => {
  const isAuthenticated = useSession().status === "authenticated";
  const router = useRouter();
  useEffect(() => {
    isAuthenticated && router.push("/");
  }, [isAuthenticated, router]);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const onSubmit = async (value: z.infer<typeof loginSchema>) => {
    const result = loginSchema.safeParse(value);
    if (!result.success) {
      console.log("Error:\n", result.error.format());
      return;
    }
    const res = await signIn("credentials", {
      email: value.email,
      password: value.password,
      redirect: false,
    });

    if (res?.error) {
      setError("Login failed. Please check your credentials.");
    } else {
      router.push("/");
    }
  };
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Welcome back!</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
            <div className="space-y-4">
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
            <Button type="submit" size="lg" className="w-full">
              Sign in
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between flex-col">
        {error && <p className="text-red-500 text-base my-2 font-semibold">{error}</p>}
        <Link
          className="text-lg underline hover:text-blue-600"
          href="/auth/signup"
        >
          Don't have an account ?
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
