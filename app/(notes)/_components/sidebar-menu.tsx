
import { PlusCircle, SearchIcon, SettingsIcon } from "lucide-react";

export function SidebarMenu (){
    return (
        <div className="flex flex-col gap-y-2 my-4 text-muted-foreground w-full ">
        <div className="flex relative hover:bg-gray-200 p-1 cursor-pointer items-center gap-x-3 w-full rounded-md">
          <SearchIcon className="h-5 w-5" />{" "}
          <span className="font-medium">Search</span>
          <div>
           
            <span>K</span>
          </div>
        </div>
        <div className="flex hover:bg-gray-200 p-1 cursor-pointer items-center gap-x-3 w-full rounded-md">
          <SettingsIcon className="h-5 w-5" />{" "}
          <span className="font-medium">Settings</span>
        </div>
        <div className="flex hover:bg-gray-200 p-1 cursor-pointer items-center gap-x-3 w-full rounded-md">
          <PlusCircle className="h-5 w-5" />{" "}
          <span className="font-medium">New Page</span>
        </div>
      </div>
    )
}