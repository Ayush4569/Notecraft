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
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export function UserDropDown() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter()
  const handleLogOut = async()=>{
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/logout`,null,{
        withCredentials:true
      });
      if(res.data.success) {
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
        <ChevronDown className="text-muted-foreground h-5 w-5 cursor-pointer hover:bg-primary/5 rounded-sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex flex-col space-y-4 p-4">
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
