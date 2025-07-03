"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
export default function VerfifyCode() {
  const router = useRouter();
  const { username } = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });
  const { isSubmitting, isValidating } = form.formState;
  async function onSubmit(formData: z.infer<typeof verifySchema>) {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/verify-code`, {
        username,
        code: formData.code,
      });
      toast.success(response.data.message || "user verified");
      router.replace("/login");
    } catch (error) {
      console.log("Error verifying code:", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("unexpected error");
      }
    }
  }
  return (
    <div className="flex justify-center items-center bg-white dark:invert min-h-screen md:bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white md:rounded-lg md:shadow-md">
        <div className="text-center">
          <h1 className="text-4xl dark:invert font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4 dark:invert">
            Enter the verification code sent to your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:invert">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="dark:invert"
                      placeholder="Enter your code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting || isValidating}
              className={cn(
                "cursor-pointer hover:bg-white w-full md:w-max hover:text-black transition-all",
                isSubmitting || (isValidating && "cursor-not-allowed")
              )}
            >
              {isSubmitting || isValidating ? "Submitting" : "Verify"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
