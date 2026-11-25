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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/hooks/redux-hooks";
import { useAuthContext } from "@/context/auth-context";
import { transferGuestDocumentApi } from "@/lib/api/documents";
import { hasGuestDocument, getGuestDocument, clearGuestDocument } from "@/lib/guest-session";
import { getApiErrorMessage } from "@/lib/api/client";
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
  const { login } = useAuthContext();
  const { status, isGuest } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (status === "authenticated" && !isGuest) {
      router.replace("/documents");
    }
  }, [status, isGuest, router]);
  const onSubmit = async (value: FormData) => {
    const result = loginSchema.safeParse(value);
    if (!result.success) {
      toast.error(result.error.format()._errors.toString());
      return;
    }
    try {
      await login({
        identifier: value.identifier,
        password: value.password,
      });

      if (hasGuestDocument()) {
        const guestDoc = getGuestDocument();
        if (guestDoc) {
          try {
            const transferRes = await transferGuestDocumentApi({
              title: guestDoc.title,
              content: guestDoc.content,
              icon: guestDoc.icon,
              coverImage: guestDoc.coverImage,
            });
            clearGuestDocument();
            toast.success("Your guest document was saved to your account!");
            if (transferRes.data?.id) {
              router.replace(`/documents/${transferRes.data.id}`);
              return;
            }
          } catch (transferErr) {
            console.error("Failed to transfer guest document on login:", transferErr);
          }
        }
      }

      router.replace("/documents");
      toast.success("Login successful");
    } catch (error) {
      console.error("Error during login:", error);
      toast.error(getApiErrorMessage(error));
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
              Login
            </Button>
          </form>
        </Form>

        <div className="text-center flex flex-col justify-center gap-y-1 mt-4 dark:invert">
          <p>
            Not a member yet?{" "}
            <Link href="/signup" className="hover:text-blue-600 underline">
              Sign up
            </Link>
          </p>
          <p>
            <Link href="/forgot-password" className="hover:text-blue-600 underline">
            Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
