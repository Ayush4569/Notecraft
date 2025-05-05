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
import axios from "axios";
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
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { login } from "@/redux/slices/auth";
const LoginForm = () => {
  const isAuthenticated = useSession().status === "authenticated";
  const dispatch = useDispatch<AppDispatch>();
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
      form.setError("root", {
        message: "Login failed. Please check your credentials.",
      });
    } else {
      router.push("/");
    }
  };
  return (
    <Card className="w-full h-full md:w-[400px] md:h-max">
      <CardHeader>
        <CardTitle className="text-xl text-center">Login</CardTitle>
        <CardDescription className="text-xl text-center">
          Welcome back!
        </CardDescription>
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
                    <FormLabel className="text-xl">Email</FormLabel>
                    <FormControl>
                      <Input
                        className="placeholder:text-xl p-4"
                        placeholder="Enter your email"
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
                    <FormLabel className="text-xl">Password</FormLabel>
                    <FormControl>
                      <Input
                        className="placeholder:text-xl p-4"
                        {...field}
                        placeholder="Enter password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full text-lg cursor-pointer bg-yellow-300 hover:bg-white hover:text-black transition-all"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting || form.formState.isValidating
                ? "Loading..."
                : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between flex-col">
        {form.formState.errors.root && (
          <p className="text-red-500 text-base my-2 font-semibold">
            {form.formState.errors.root.message}
          </p>
        )}
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
