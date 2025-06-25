"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas";
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
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
type FormData = z.infer<typeof loginSchema>;
const LoginForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const { isSubmitting, isValidating } = form.formState;
  const router = useRouter();
  const onSubmit = async (value: FormData) => {
    const result = loginSchema.safeParse(value);
    if (!result.success) {
      console.log("Error:\n", result.error.format()._errors);
      toast.error(result.error.format()._errors.toString());
      return;
    }

    const res = await signIn("credentials", {
      identifier: value.identifier,
      password: value.password,
      redirect: false,
    });

    if (res?.error) {
      if (res.error === "CredentialsSignin") {
        toast.error("Incorrect username or password");
      } else {
        toast.error(res.error.toString());
      }
    }
    if (res?.ok) {
      router.replace("/documents");
      toast.success("Login successful");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg md:shadow-md dark:invert">
        <div className="text-center dark:invert">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to Notecraft
          </h1>
          <p className="mb-4">Sign in to continue using our app</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 dark:invert"
          >
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
              className={`cursor-pointer w-full hover:bg-white hover:text-black transition-all ${isSubmitting || (isValidating && "cursor-not-allowed")}`}
              type="submit"
              disabled={isSubmitting || isValidating}
            >
              Sign In
            </Button>
          </form>
        </Form>
        <Button 
        onClick={() => signIn("google")}
        >
          <img src="/google.svg" alt="Google" className="w-6 h-6" />
          Sign in with Google
        </Button>
        <div className="text-center mt-4 dark:invert">
          <p>
            Not a member yet?{" "}
            <Link href="/signup" className="hover:text-blue-600 underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
