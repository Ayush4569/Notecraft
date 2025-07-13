import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { clearUser } from "@/redux/slices/user";
import axios, { AxiosError } from "axios";
import { ChevronDown, Crown, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export function UserDropDown({ isHomePage = false }: { isHomePage?: boolean }) {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter()
  const handleLogOut = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/logout`, null, {
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(clearUser())

        toast.success("Logged out successfully.");
        router.push("/login");
      }
    } catch (error) {
      console.error("Failed to logout:", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("unexpected error ");
      }
    }
  }
  if (user.status === "unauthenticated") {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        {
          isHomePage ? (
            <Image
              src={user.profileImage || "/avatar.png"}
              className="h-10 w-10 rounded-full"
              alt="avatar"
              height={40}
              width={40}
            />
          ) : (
            <ChevronDown className="text-muted-foreground h-5 w-5 cursor-pointer hover:bg-primary/5 rounded-sm" />
          )
        }

      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 mr-4"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex flex-col space-y-2 p-3">
          <p className="font-medium text-muted-foreground leading-none">
            {user?.email}
          </p>
          <div className="flex items-center gap-x-2">
            <div className="rounded-md bg-secondary p-1">
              <Avatar>
                <AvatarImage
                  className="h-8 w-8"
                  src={
                    user?.profileImage !== ""
                      ? user.profileImage
                      : "/avatar.png"
                  }
                />
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="capitalize line-clamp-1">
                {user?.name}&apos;s workspace
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            {
              user.isPro ? (
                <Button
                  variant="outline"
                  className="hover:underline w-full cursor-pointer"
                  onClick={() => router.push("/subscriptions")}
                >
                  <Crown className="h-4 w-4" />
                  Pro User
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="hover:underline w-full cursor-pointer"
                  onClick={() => router.push("/subscriptions")}
                >
                  <Crown className="h-4 w-4" />
                  Get Notecraft Pro
                </Button>
              )
            }
            <Button
                  variant="outline"
                  className="hover:underline w-full cursor-pointer"
                  onClick={() => router.push("/change-password")}
                >
                  <Pencil className="h-4 w-4" />
                  Change Password
                </Button>
          </div>
        </div>
        <DropdownMenuSeparator />{" "}
        <DropdownMenuItem className="w-full p-2 cursor-pointer text-muted-foreground hover:border-none">
          <Button className="w-full" onClick={() => handleLogOut()}>
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
