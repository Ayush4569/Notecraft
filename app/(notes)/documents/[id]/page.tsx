"use client";
import { Toolbar } from "@/components/toolbar";
import { usePage } from "@/hooks/useGetDocumentById";
import { useParams } from "next/navigation";
import { CoverImage } from "../../_components/cover-image";
import Editor from "@/components/editor";
export default function () {
  const params = useParams();
  const id = params.id as string;
  const { data: document } = usePage(id);

  if (!document) return;
  return (
    <div className="pb-40">
      <CoverImage docId={document.id} imageUrl={document.imageUrl} />
      <div className="md:max-w-3xl lg:max-w-4xl mt-4">
        <Toolbar doc={document} />
        <Editor
          docId={document.id}
          editable
          initialContent={document.content?.blocks || null}
        />
      </div>
    </div>
  );
}
