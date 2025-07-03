"use client";
import { Toolbar } from "@/components/toolbar";
import { usePage } from "@/hooks/useGetDocumentById";
import { useParams } from "next/navigation";
import { CoverImage } from "@/app/(notes)/_components/cover-image"
import Editor from "@/components/editor";
import { PartialBlock } from "@blocknote/core";
export default function () {
  const params = useParams();
  const id = params.id as string;
  const { data: document } = usePage(id);

  if (!document || !document.isPublished) return;
  return (
    <div className="pb-40">
      <CoverImage preview docId={document.id} coverImage={document.tempImageUrl ?? ""} />
      <div className="md:max-w-3xl lg:max-w-4xl mt-4">
        <Toolbar preview doc={document} />
        <Editor
          docId={document.id}
          editable = {false}
          initialContent={document.content?.blocks as PartialBlock[]}
        />
      </div>
    </div>
  );
}
