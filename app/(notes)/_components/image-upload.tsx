'use client'
import { useAppDispatch } from "@/hooks/redux-hooks";
import { onOpen } from "@/redux/slices/imagemodal";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { useState } from "react";

export function ImageUpload(){
    const [file,setFile] = useState<File>()
    const dispatch = useAppDispatch()
    return(
      <div className="flex items-center gap-x-2 absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all">
      <Button className="flex items-center cursor-pointer gap-x-0.5" onClick={() => dispatch(onOpen())}>
        <ImageIcon className="h-4 w-4" />
        Replace image
      </Button>
      <Button className="flex items-center cursor-pointer gap-x-0.5">
        <X className="h-4 w-4" />
        Remove image
      </Button>
    </div>
        
    )
}