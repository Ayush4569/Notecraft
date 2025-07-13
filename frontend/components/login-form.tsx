"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas";
import { useAppDispatch } from "@/hooks/redux-hooks";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { setUser } from "@/redux/slices/user";
type FormData = z.infer<typeof loginSchema>;
const LoginForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const dispatch = useAppDispatch();
  const { isSubmitting, isValidating } = form.formState;
  const router = useRouter();
  const onSubmit = async (value: FormData) => {
    const result = loginSchema.safeParse(value);
    if (!result.success) {
      toast.error(result.error.format()._errors.toString());
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`,
        {
          identifier: value.identifier,
          password: value.password,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.success || res.status === 200) {
        dispatch(
          setUser({
            id: res.data.user.id,
            name: res.data.user.name,
            email: res.data.user.email,
            profileImage: res.data.user.profileImage ?? "",
            status: 'authenticated',
            isPro: res.data.user.isPro,
          })
        );
        
        router.replace("/documents");
        toast.success("Login successful");
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("unexpected error ");
      }
      return;
    }
    finally{
      form.reset({
        identifier:"",
        password:""
      })
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg md:shadow-md dark:invert">
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
              className={`cursor-pointer w-full hover:bg-white hover:text-black transition-all ${isSubmitting || (isValidating && "cursor-not-allowed")
                }`}
              type="submit"
              disabled={isSubmitting || isValidating}
            >
              Sign In
            </Button>
          </form>
        </Form>

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
