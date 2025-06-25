"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEditDocument } from "@/hooks/useUpdateDocument";
import { Document } from "@/types/document";
import { Check, Copy, Globe } from "lucide-react";
import { useEffect, useState } from "react";

interface PublishProps {
    pageId: string;
    isPublished:boolean;
}

export function Publish({ pageId,isPublished }: PublishProps) {
  const pathname: string =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { mutate } = useEditDocument();
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  if(!pageId) return null

  const url: string = `${pathname}/preview/${pageId}`;

  const handlePublish = (): void => {
    setSubmitting(true);
    mutate({ docId: pageId, data: { isPublished: true } });
    setSubmitting(false);
  };
  const handleUnpublish = (): void => {
    setSubmitting(true);
    mutate({ docId: pageId, data: { isPublished: false } });
    setSubmitting(false);
  };
  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          Publish
          {isPublished && <Globe className="ml-2 h-4 w-4 text-sky-500" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {isPublished ? (
          <div className="space-y-4">
            <div className="flex gap-x-2 items-center ">
              <Globe className="animate-pulse h-4 w-4 text-sky-500" />
              <p className="text-xs font-medium text-sky-500">
                This note is live on web.
              </p>
            </div>
            <div className="flex items-center">
              <input
                disabled
                value={url}
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
              />
              <Button
                className="h-8 rounded-l-none"
                onClick={onCopy}
                disabled={copied}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              
            </div>
            <Button
                size="sm"
                className="w-full text-xs"
                disabled={submitting}
                onClick={handleUnpublish}
              >
                Unpublish
              </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">Publish this note</p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your work with others
            </span>
            <Button
              className="w-full text-xs"
              size="sm"
              disabled={submitting}
              onClick={handlePublish}
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
