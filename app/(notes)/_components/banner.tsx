import { ConfirmModal } from "@/components/confirm-modal";
import { Button } from "@/components/ui/button";
import { useDeleteTrashDocuments } from "@/hooks/useDeleteTrashDocuments";
import { useRestoreDocuments } from "@/hooks/useRestoreDocuments";
import { useRouter } from "next/navigation";

export function Banner({ docId }: { docId: string }) {
  const router = useRouter();
  const { mutate: DeleteDoc } = useDeleteTrashDocuments();
  const { mutate: RestoreDoc } = useRestoreDocuments();
  const handleDeleteForever = () => {
    DeleteDoc(docId);
    router.replace("/documents");
  };

  const handleRestore = () => RestoreDoc(docId);
  return (
    <div className="w-full bg-rose-500 text-center text-white p-2 text-sm flex items-center gap-x-2 justify-center">
      <p>This page is in trash</p>
      <Button
        onClick={handleRestore}
        variant="outline"
        size="sm"
        className="border-white bg-transparent  hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        Restore page
      </Button>
      <ConfirmModal onConfirm={handleDeleteForever}>
        <Button
          variant="outline"
          size="sm"
          className="border-white bg-transparent  hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
}
