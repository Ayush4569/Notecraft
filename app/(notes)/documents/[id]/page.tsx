"use client";
import { Toolbar } from "@/components/toolbar";
import { usePage } from "@/hooks/useGetDocumentById";
import { useParams } from "next/navigation";
export default function () {
  const params = useParams();
  const id = params.id as string;
  const { data: document } = usePage(id);
  if (!document) return;
  return (
    <div className="pb-40">
      {/* add the cover image instead of below div */}
      <div className="h-[30vh]"/> 
      <div className="md:max-w-3xl lg:max-w-4xl">
        <Toolbar doc={document!}/>
      </div>
    </div>
  );
}
