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
import { useAuthContext } from "@/context/auth-context";
import { transferGuestDocumentApi } from "@/lib/api/documents";
import { hasGuestDocument, getGuestDocument, clearGuestDocument } from "@/lib/guest-session";
import { getApiErrorMessage } from "@/lib/api/client";
import { toast } from 'sonner';
import { useEffect } from "react";
import { useAppSelector } from "@/hooks/redux-hooks";
type FormData = z.infer<typeof registerSchema>;
const SignupForm = () => {
  const router = useRouter();
  const { register } = useAuthContext();
  const form = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const { isSubmitting, isValidating } = form.formState;
  const { status } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/documents");
    }
  }, [status, router]);

  const onSubmit = async (data: FormData) => {
    const result = registerSchema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.format()._errors.toString());
      return;
    }
    const { username, email, password } = data;
    try {
      await register({
        username,
        email,
        password,
      });
      
      toast.success("Account created and logged in!");

      // If visitor was working on a guest document, transfer it to their account
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
            console.error("Failed to transfer guest document:", transferErr);
            toast.error("Account created, but could not transfer guest document automatically.");
          }
        }
      }
      
      router.replace("/documents");
    } catch (error) {
      console.error("Error during sign-up:", error);
      toast.error(getApiErrorMessage(error));
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
