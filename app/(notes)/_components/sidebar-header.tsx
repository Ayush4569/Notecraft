import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ChevronsLeft, Edit } from "lucide-react";
import { useSession } from "next-auth/react";
import { UserDropDown } from "./user-dropdown";
interface SidebarHeaderProps {
  isMobile: boolean;
  collapseSideBar: () => void;
}
export function SidebarHeader({
  isMobile,
  collapseSideBar,
}: SidebarHeaderProps) {
  const session = useSession();
  if (session.status === "loading") {
    return null;
  }
  const user = session?.data?.user;
  return (
    <div className="flex items-center justify-between gap-x-2 px-2 py-4">
      <div className="gap-x-2 flex items-center ">
        <Avatar>
          <AvatarImage src={user?.image || "/avatar.png"} />
          <AvatarFallback>user_image</AvatarFallback>
        </Avatar>
        <span className="font-medium line-clamp-1 text-start">
          {user?.username} workspace
        </span>
      </div>
      <div className="flex items-center gap-x-2">
      <UserDropDown/>
      <Edit
        className={
          "text-muted-foreground opacity-0 group-hover/sidebar:opacity-100 h-4 w-4 cursor-pointer hover:bg-primary/5 rounded-sm"
        }
      />
      <ChevronsLeft
      onClick={collapseSideBar}
      className={cn(
        "opacity-0 rounded-sm group-hover/sidebar:opacity-100 h-6 w-6 text-muted-foreground hover:bg-primary/5 dark:bg-neutral-600 transition cursor-pointer",
        isMobile && "opacity-100"
      )}
      />
      </div>
     

    </div>
  );
}
