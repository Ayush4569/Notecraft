'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passwordChangeSchema } from "@/schemas";
import axios, {  isAxiosError } from "axios";
import Link from "next/link";
import { useRef, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof passwordChangeSchema>;

export default function ForgotPassword() {
  const emailInput = useRef<HTMLInputElement | null>(null);
  const otpInput = useRef<HTMLInputElement | null>(null);
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false);
  const [resetToken, setResetToken] = useState<string>("");
  const [canResend, setCanResend] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const { isValidating, isSubmitting } = form.formState;

  const sendOtp = async (): Promise<void> => {
    if (!emailInput.current || !emailInput.current.value) {
      toast.error("Please enter an email address");
      return;
    }
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.current.value);
    if (!isValidEmail) {
      toast.error("Invalid email address");
      return;
    }
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/resetOtp`, {
        email: emailInput.current.value
      });
      if (data.success) {
        setIsCodeSent(true);
        toast.success("OTP sent to your email!");
        setTimeout(() => {
          setCanResend(true);
        }, 60000);
      }
    } catch (error) {
      toast.error(isAxiosError(error) ? error.response?.data.message : "Error sending OTP");
    }
  };

  const verifyOtp = async (): Promise<void> => {
    if (!otpInput.current || !otpInput.current.value) {
      toast.error("Please enter the OTP");
      return;
    }
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/verify-code?key=forgot`, {
        email: emailInput.current?.value,
        otp: otpInput.current.value
      });
      if (data.success && data.resetToken) {
        setIsCodeVerified(true);
        setResetToken(data.resetToken);
        toast.success("OTP verified successfully!");
      }
    } catch (error) {
      toast.error(isAxiosError(error) ? error.response?.data.message : "Error verifying OTP");
    }
  };

  const handleSubmit = async (data: FormData) => {
    const { password, confirmPassword } = data;
    if (password.trim() !== confirmPassword.trim()) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/forgotPassword`, {
        newPassword: password,
        resetToken
      });
      if (data.success) {
        toast.success("Password changed successfully");
        router.replace("/login");
      }
    } catch (error) {
      toast.error(isAxiosError(error) ? error.response?.data.message : "Unexpected error");
    } finally {
      form.reset({
        confirmPassword: "",
        password: ""
      });
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Forgot Password?
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            {isCodeVerified
              ? "Create a new password for your account."
              : "Enter your email to receive a one-time otp."}
          </p>
        </div>

        {isCodeSent && !isCodeVerified && (
          <div className="text-center text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            OTP sent! Check your email. {canResend ? "You can resend now." : "You can resend after 60 seconds."}
          </div>
        )}

        {!isCodeVerified && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Email Address
              </Label>
              <Input
                ref={emailInput}
                disabled={isCodeSent}
                id="email"
                type="email"
                placeholder="Enter your email"
                className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {isCodeSent && (
              <div>
                <Label htmlFor="otp" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  OTP Code
                </Label>
                <Input
                  ref={otpInput}
                  id="otp"
                  type="text"
                  placeholder="Enter your OTP"
                  className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                />
              </div>
            )}

            <Button
              onClick={isCodeSent ? verifyOtp : sendOtp}
              className="w-full bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg py-2.5 hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              // disabled={ !isCodeVerified && !canResend}
            >
              {isCodeSent ? "Verify OTP" : "Send OTP"}
            </Button>

            {isCodeSent && canResend && !isCodeVerified && (
              <div className="text-center">
                <button
                  onClick={sendOtp}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                >
                  Resend OTP
                </button>
              </div>
            )}
          </div>
        )}

        {isCodeVerified && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Must be at least 8 characters.
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Both passwords must match.
                    </FormMessage>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className={cn(
                  "w-full bg-purple-600 dark:bg-purple-500 text-white font-semibold rounded-lg py-2.5 hover:bg-purple-700 dark:hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all",
                  (isSubmitting || isValidating) && "opacity-50 cursor-not-allowed"
                )}
                disabled={isSubmitting || isValidating}
              >
                Reset Password
              </Button>
            </form>
          </Form>
        )}

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Back to{" "}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}