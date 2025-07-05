"use client";
import Logo from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/useScroll";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import axios, { AxiosError } from "axios";
import { clearUser } from "@/redux/slices/user";
import { toast } from "sonner";
import { Crown, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
const navbar = ({ isSubscriptionPage }: { isSubscriptionPage?: boolean }) => {
  const scrolled = useScroll();
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const handleLogOut = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/logout`,
        null,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(clearUser());
        toast.success("Logged out successfully.");
      }
    } catch (error) {
      console.error("Failed to logout:", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("unexpected error ");
      }
    }
  };
  return (
    <>
      {isSubscriptionPage ? (
        <div
          className={cn(
            "w-full z-50 bg-background p-4 flex items-center justify-between fixed top-0 dark:bg-[#1f1f1f]",
            scrolled && "border-b  shadow-xl"
          )}
        >
          <div className="flex items-center gap-x-3">
            <span>
              <Home
                onClick={() => router.push("/")}
                className="h-6 w-6 text-gray-500 cursor-pointer"
              />
            </span>
            <Logo />
          </div>

          <div className="flex items-center gap-x-3">
            <Button variant="outline">
              <span className="text-gray-700">{user.email}</span>
            </Button>
            <Image
              src={user.profileImage || "/avatar.png"}
              className="h-10 w-10 rounded-full"
              alt="avatar"
              height={40}
              width={40}
            />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "w-full z-50 bg-background p-4 flex items-center justify-end fixed top-0 dark:bg-[#1f1f1f]",
            scrolled && "border-b  shadow-xl"
          )}
        >
          <div className="flex items-center gap-x-3">
            {user.status === "loading" && (
              <div className="flex gap-2 animate-out">
                <Skeleton className="h-9 w-24 rounded-sm bg-neutral-200 dark:bg-neutral-700" />
                <Skeleton className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              </div>
            )}
            {user.status !== "loading" && user.status === "unauthenticated" && (
              <Button asChild className="cursor-pointer">
                <Link href="/login">Login</Link>
              </Button>
            )}
            {user.status === "authenticated" && user.id && (
              <>
                {
                  user.isPro ? (
                    <Button
                      variant="outline"
                      className="hover:underline"
                    >
                      <Crown className="h-4 w-4" />
                     Pro User
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="hover:underline cursor-pointer"
                      onClick={() => router.push("/subscriptions")}
                    >
                      <Crown className="h-4 w-4" />
                      Get Notecraft Pro
                    </Button>
                  )
                }
                <Button variant="default" onClick={handleLogOut}>
                  Logout
                </Button>
                <Image
                  src={user.profileImage || "/avatar.png"}
                  className="h-10 w-10 rounded-full"
                  alt="avatar"
                  height={40}
                  width={40}
                />
              </>
            )}

            <ModeToggle />
          </div>
        </div>
      )}
    </>
  );
};

export default navbar;
