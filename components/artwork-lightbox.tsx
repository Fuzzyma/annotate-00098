"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Artwork, Artist } from "@/context/art-context";

interface ArtworkLightboxProps {
  artwork: Artwork;
  artist: Artist;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArtworkLightbox({
  artwork,
  artist,
  open,
  onOpenChange,
}: ArtworkLightboxProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col min-h-0">
        <DialogHeader>
          <DialogTitle>{artwork.title}</DialogTitle>
          <DialogDescription>
            By{" "}
            <Link
              href={`/artists/${artist.id}`}
              className="text-primary hover:underline"
            >
              {artist.name}
            </Link>
            , {artwork.year}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col grow shrink min-h-0 gap-4">
          <div className="relative w-full max-h-full  grow shrink">
            <Image
              src={artwork.imageUrl || "/placeholder.svg"}
              alt={artwork.title}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <p className="mt-2">{artwork.description}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Medium: {artwork.medium}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
