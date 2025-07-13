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
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
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
      <Card className="w-full h-full md:w-[400px] md:h-auto">
        <CardHeader>
          <CardTitle className="text-xl text-center">Register</CardTitle>
          <CardDescription className="text-xl text-center">
            Welcome to Notecraft
          </CardDescription>
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
                      <FormLabel className="text-xl ">Username</FormLabel>
                      <FormControl>
                        <Input
                          className="placeholder:text-xl p-4"
                          placeholder="Enter your username"
                          {...field}
                        />
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
                      <FormLabel className="text-xl ">Email</FormLabel>
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
                className={cn(
                  "cursor-pointer w-full hover:bg-white hover:text-black transition-all",
                  (isSubmitting || isValidating && "cursor-not-allowed")
                )}
                disabled={
                  isSubmitting || isValidating
                }
              >
                Register
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between flex-col">
          <Link className="text-lg underline hover:text-blue-600" href="/login">
            Already have an account ?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupForm;
