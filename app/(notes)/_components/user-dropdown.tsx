import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
export function UserDropDown() {
  const session = useSession();
  if (session.status === "loading") {
    return null;
  }
  const user = session?.data?.user;
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
                  src={user?.image || "/avatar.png"}
                />
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="capitalize line-clamp-1">
                {user?.username}&apos;s workspace
              </p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full p-2 cursor-pointer text-muted-foreground hover:border-none">
          <Button className="w-full" onClick={() => signOut()}>
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
