"use client";
import { Toolbar } from "@/components/toolbar";
import { usePage } from "@/hooks/useGetDocumentById";
import { useParams } from "next/navigation";
import { CoverImage } from "@/app/(notes)/_components/cover-image";
import Editor from "@/components/editor";
import { useMediaQuery } from "usehooks-ts";
import { PartialBlock } from "@blocknote/core";
import { useEffect } from "react";
import {useSideBarResizable} from "@/hooks/useSidebarResizable"
export default function () {
  const params = useParams();
  const isMobile = useMediaQuery("(max-width:768px)");
  const {collapseSidebar} = useSideBarResizable()
  const id = params.id as string;
  const { data: document } = usePage(id);
  useEffect(() => {
    if (isMobile) {
      collapseSidebar();
    }
  }, [isMobile]);
  if (!document) return;
  return (
    <div className="pb-0 md:pb-40">
      <CoverImage docId={document.id} imageKey={document.coverImage} coverImage={document.tempImageUrl ?? ""} />
      <div className="md:max-w-3xl lg:max-w-4xl mt-4">
        <Toolbar doc={document} />
        <Editor
          docId={document.id}
          editable
          initialContent={document.content?.blocks as PartialBlock[]}
        />
      </div>
    </div>
  );
}
