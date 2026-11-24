import { Button } from "@/components/ui/button";
import Logo from "./logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/60 bg-background/80 dark:bg-[#1f1f1f]/80 py-6 px-4 sm:px-8 mt-12">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-xs text-muted-foreground hidden md:inline">
            • Distraction-free connected workspace
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/guest" className="hover:text-foreground transition-colors">
            Guest Editor
          </Link>
          <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-muted-foreground">
            Privacy Policy
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-muted-foreground">
            Terms of Service
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center sm:text-right">
          © {new Date().getFullYear()} Notecraft. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
