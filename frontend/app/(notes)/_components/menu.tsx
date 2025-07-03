import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useArchiveDocument } from "@/hooks/useArchiveDocument";
import { MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
export function Menu({ docId }: { docId: string }) {
  const router = useRouter();
  const { mutate: ArchiveDoc } = useArchiveDocument();
  const handleTrash = () => {
    router.replace('/documents');
    ArchiveDoc({ docId, payload: {} });
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className=" max400 md:mr-0" asChild>
        <Button variant="ghost" className="" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-auto mt-1 md:w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem className="cursor-pointer" onClick={handleTrash}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
