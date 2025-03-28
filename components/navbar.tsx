"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { PlusCircle } from "lucide-react";
import { useArt } from "@/context/art-context";
import { ArtworkDialog } from "./artwork-dialog";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isAddArtworkOpen, setIsAddArtworkOpen] = useState(false);
  const { artists } = useArt();

  return (
    <>
      <header className="border-b py-2">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-6 flex-col sm:flex-row">
            <Link href="/" className="text-xl font-bold">
              Art Gallery
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Home
              </Link>
              <Link
                href="/artists"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/artists"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Artists
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-2"
              onClick={() => setIsAddArtworkOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              Add Artwork
            </Button>
            <ModeToggle />
          </div>
        </div>
        <div className="container mx-auto flex md:hidden items-center justify-between px-4">
          <nav className="flex gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/artists"
              className={`text-sm font-medium transition-colors ${
                pathname === "/artists"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              Artists
            </Link>
          </nav>
        </div>
        <ArtworkDialog
          open={isAddArtworkOpen}
          onOpenChange={setIsAddArtworkOpen}
          artists={artists}
        />
      </header>
      <Button
        variant="outline"
        size="sm"
        className="flex sm:hidden gap-2 m-4"
        onClick={() => setIsAddArtworkOpen(true)}
      >
        <PlusCircle className="h-4 w-4" />
        Add Artwork
      </Button>
    </>
  );
}
