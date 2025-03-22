"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  type Artwork,
  type Artist,
  type Comment,
  useArt,
} from "@/context/art-context";
import { CommentSection } from "@/components/comment-section";
import { ArtworkLightbox } from "@/components/artwork-lightbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ArtworkCardProps {
  artwork: Artwork;
  artist: Artist;
  comments: Comment[];
}

export function ArtworkCard({ artwork, artist, comments }: ArtworkCardProps) {
  const { updateVote } = useArt();
  const [showComments, setShowComments] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleVote = (
    artworkId: string,
    voteType: "upvote" | "downvote" | undefined
  ) => {
    updateVote(artworkId, voteType);
  };

  console.log(artwork.vote);

  return (
    <Card className="mb-6 overflow-hidden">
      <div className="md:flex">
        <div
          className="md:w-1/2 relative cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        >
          <div className="w-full h-full relative aspect-[4/3]">
            <Image
              src={artwork.imageUrl || "/placeholder.svg"}
              alt={artwork.title}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>
        </div>
        <div className="md:w-1/2 p-6">
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{artwork.title}</h2>
              <div className="mt-1 mb-3">
                <Link
                  href={`/artists/${artist.id}`}
                  className="text-primary hover:underline"
                >
                  {artist.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {artwork.medium}, {artwork.year}
                </p>
              </div>
            </div>
            <ToggleGroup
              type="single"
              onValueChange={(val) => handleVote(artwork.id, val as any)}
              value={artwork.vote}
            >
              <ToggleGroupItem aria-label="Upvote" value="upvote">
                <ThumbsUp className="h-5 w-5" />
              </ToggleGroupItem>
              <span className="text-sm font-medium">{artwork.upvotes}</span>
              <ToggleGroupItem aria-label="Downvote" value="downvote">
                <ThumbsDown className="h-5 w-5" />
              </ToggleGroupItem>
              <span className="text-sm font-medium">{artwork.downvotes}</span>
            </ToggleGroup>
          </div>
          <p className="mt-4">{artwork.description}</p>
        </div>
      </div>
      <CardFooter className="flex justify-between p-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare className="h-4 w-4" />
          <span>{comments.length} Comments</span>
          {showComments ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
      {showComments && (
        <CardContent className="pt-0 pb-4">
          <CommentSection artworkId={artwork.id} comments={comments} />
        </CardContent>
      )}
      <ArtworkLightbox
        artwork={artwork}
        artist={artist}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </Card>
  );
}
