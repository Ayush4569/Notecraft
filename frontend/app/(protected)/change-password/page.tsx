'use client'
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { passwordChangeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { EyeIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
type FormData = z.infer<typeof passwordChangeSchema>
export default function () {
  const form = useForm<FormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })
  const { isValidating, isSubmitting } = form.formState
  const handleSubmit = async (data: FormData) => {
    const { password, confirmPassword } = data
    if (password.trim() !== confirmPassword.trim()) {
      toast.error("Password does not match");
      return;
    }
    const result = passwordChangeSchema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.format()._errors.toString() ?? "Password not valid");
      return;
    }
    try {
      const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/change-password`,{
      password,
      },{
        withCredentials: true
      });
      if (data.success) {
        toast.success("Password changed successfully")
      }
    } catch (error) {
      console.log('Error resetting password');
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("unexpected error ");
      }
    }
    finally {
      form.reset({
        confirmPassword: "",
        password: ""
      })
    }
  }
  return (
    <div className="flex justify-center items-center dark:bg-gray-900 min-h-screen bg-gray-50 relative">
      <main className="w-full max-w-md p-6 md:outline-1 md:rounded-lg">

        <h1 className="text-2xl font-bold text-center mb-4">Create new password</h1>
        <p className="text-center text-gray-600 mb-6">Your new password must be different from previous used passwords.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input
                      type="password"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-gray-500 mt-1">Must be at least 8 characters.</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                      type="password"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                        placeholder="confirm password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-gray-500 mt-1">Both passwords must match.</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className={cn(
                "w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors",
                (isSubmitting || isValidating) && "opacity-50 cursor-not-allowed"
              )}
              disabled={isSubmitting || isValidating}
            >
              Reset Password
            </Button>
          </form>
        </Form>
      </main>

    </div>
  )
}