import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ChevronsLeft, Edit, Home } from "lucide-react";
import { UserDropDown } from "./user-dropdown";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/redux-hooks";
interface SidebarHeaderProps {
  isMobile: boolean;
  collapseSideBar: () => void;
}
export function SidebarHeader({
  isMobile,
  collapseSideBar,
}: SidebarHeaderProps) {
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  return (
    <div className="flex items-center justify-between gap-x-2 px-2 py-4">
      <div className="gap-x-2 flex items-center ">
        <Avatar>
          <AvatarImage src={user?.profileImage !== '' ?  user.profileImage:  "/avatar.png"} />
        </Avatar>
        <span className="font-medium line-clamp-1 text-start">
          {user.name} workspace
        </span>
      </div>
      <div className="flex items-center gap-x-2">
        <UserDropDown />
        <Home
          onClick={() => router.push("/")}
          className={cn(
            "text-muted-foreground opacity-0 group-hover/sidebar:opacity-100 h-4 w-4 cursor-pointer hover:bg-primary/5 rounded-sm",
            isMobile && "opacity-100 h-6 w-6"
          )}
        />
        <ChevronsLeft
          onClick={collapseSideBar}
          className={cn(
            "opacity-0 rounded-sm group-hover/sidebar:opacity-100 h-5 w-5 text-muted-foreground hover:bg-primary/5 dark:bg-neutral-600 transition cursor-pointer",
            isMobile && "opacity-100 h-6 w-6"
          )}
        />
      </div>
    </div>
  );
}
