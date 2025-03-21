"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CircleSlash, Edit, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useArt } from "@/context/art-context";
import { ArtworkLightbox } from "@/components/artwork-lightbox";
import { ArtworkDialog } from "@/components/artwork-dialog";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function ArtistPage() {
  const params = useParams();
  const artistId = params.id as string;

  const {
    artists,
    getArtworksByArtistId,
    getArtistById,
    deleteArtwork,
    getArtworkById,
    recoverArtwork,
  } = useArt();

  const { toast } = useToast();

  const artist = getArtistById(artistId);
  const artworks = getArtworksByArtistId(artistId);

  const [editingArtwork, setEditingArtwork] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [artworkToDelete, setArtworkToDelete] = useState<string | null>(null);
  const [lightboxArtwork, setLightboxArtwork] = useState<string | null>(null);

  if (!artist) {
    return <div>Artist not found</div>;
  }

  const totalUpvotes = artworks.reduce(
    (sum, artwork) => sum + artwork.upvotes,
    0
  );
  const totalDownvotes = artworks.reduce(
    (sum, artwork) => sum + artwork.downvotes,
    0
  );

  const handleEdit = (artworkId: string) => {
    setEditingArtwork(artworkId);
  };

  const handleDelete = (artworkId: string) => {
    setArtworkToDelete(artworkId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (artworkToDelete) {
      const artwork = getArtworkById(artworkToDelete);

      deleteArtwork(artworkToDelete);
      setArtworkToDelete(null);

      toast({
        title: "Artwork deleted",
        description: "Are you sure, you wanted to do that?",
        action: (
          <ToastAction altText="Undo" onClick={() => recoverArtwork(artwork!)}>
            Undo
          </ToastAction>
        ),
      });
    }
    setDeleteDialogOpen(false);
  };

  const artworkToEdit = artworks.find(
    (artwork) => artwork.id === editingArtwork
  );
  const lightboxArtworkObj = artworks.find(
    (artwork) => artwork.id === lightboxArtwork
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/3">
          <div className="relative aspect-square w-full max-w-[300px] mx-auto">
            <Image
              src={artist.avatar || "/placeholder.svg"}
              alt={artist.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{artist.name}</h1>
          <p className="mb-4">{artist.bio}</p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{artworks.length}</div>
              <div className="text-sm text-muted-foreground">Artworks</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{totalUpvotes}</div>
              <div className="text-sm text-muted-foreground">Upvotes</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{totalDownvotes}</div>
              <div className="text-sm text-muted-foreground">Downvotes</div>
            </div>
          </div>
          <div className="flex items-center">
            <Link href="/" className="text-primary hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      {artworks.length > 0 ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Artworks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <Card key={artwork.id} className="overflow-hidden">
                <div
                  className="aspect-[4/3] relative cursor-pointer"
                  onClick={() => setLightboxArtwork(artwork.id)}
                >
                  <Image
                    src={artwork.imageUrl || "/placeholder.svg"}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold">{artwork.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {artwork.medium}, {artwork.year}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span className="text-sm">{artwork.upvotes}</span>
                    </div>
                    <div className="flex items-center">
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      <span className="text-sm">{artwork.downvotes}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(artwork.id);
                      }}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(artwork.id);
                      }}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-60 gap-5 w-full">
          <CircleSlash className="h-10 w-10 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            This artist has no artworks yet
          </p>
        </div>
      )}

      {artworkToEdit && (
        <ArtworkDialog
          artwork={artworkToEdit}
          open={!!editingArtwork}
          onOpenChange={(open) => {
            if (!open) setEditingArtwork(null);
          }}
          artists={artists}
        />
      )}

      {lightboxArtworkObj && artist && (
        <ArtworkLightbox
          artwork={lightboxArtworkObj}
          artist={artist}
          open={!!lightboxArtwork}
          onOpenChange={(open) => {
            if (!open) setLightboxArtwork(null);
          }}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              artwork and all associated comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
