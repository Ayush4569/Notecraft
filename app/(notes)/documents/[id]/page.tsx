"use client";
import { Toolbar } from "@/components/toolbar";
import { usePage } from "@/hooks/useGetDocumentById";
import { useParams } from "next/navigation";
import { CoverImage } from "../../_components/cover-image";
export default function () {
  const params = useParams();
  const id = params.id as string;
  const { data: document } = usePage(id);
  if (!document) return;
  return (
    <div className="pb-40">
     <CoverImage imageUrl={document.coverImage ?? "/cover.avif"}/>
      <div className="md:max-w-3xl lg:max-w-4xl mt-4">
        <Toolbar doc={document!}/>
      </div>
    </div>
  );
}
