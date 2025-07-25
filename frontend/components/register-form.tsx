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

import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from 'sonner';
type FormData = z.infer<typeof registerSchema>;
const SignupForm = () => {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const { isSubmitting, isValidating } = form.formState;
  const onSubmit = async (data: FormData) => {
    const result = registerSchema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.format()._errors.toString());
      return;
    }
    const { username, email, password } = data;
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signup`, {
        username,
        email,
        password,
      });
      
      toast.success(response.data.message || "user registered");
      router.replace(`/verifycode/${username}`);
    } catch (error) {
      console.error("Error during sign-up:", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("unexpected error ");
      }
    }
    finally {
      form.reset({
        email:"",
        username: "",
        password: "",
      })
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg md:shadow-md dark:invert">
        <div className="text-center dark:invert">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Register
          </h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 dark:invert"
          >
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className={`cursor-pointer w-full hover:bg-white hover:text-black transition-all ${isSubmitting || (isValidating && "cursor-not-allowed")
                }`}
              type="submit"
              disabled={isSubmitting || isValidating}
            >
              Register
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4 dark:invert">
          <p>
            Already have an account ?{" "}
            <Link href="/login" className="hover:text-blue-600 underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
