"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, ChevronUp, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { type Artwork, type Artist, type Comment, useArt } from "@/context/art-context"
import { CommentSection } from "./comment-section"
import { ArtworkLightbox } from "./artwork-lightbox"

interface ArtworkCardProps {
  artwork: Artwork
  artist: Artist
  comments: Comment[]
}

export function ArtworkCard({ artwork, artist, comments }: ArtworkCardProps) {
  const { upvoteArtwork, downvoteArtwork } = useArt()
  const [showComments, setShowComments] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <Card className="mb-6 overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2 relative cursor-pointer" onClick={() => setLightboxOpen(true)}>
          <div className="aspect-[4/3] relative">
            <Image src={artwork.imageUrl || "/placeholder.svg"} alt={artwork.title} fill className="object-cover" />
          </div>
        </div>
        <div className="md:w-1/2 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{artwork.title}</h2>
              <div className="mt-1 mb-3">
                <Link href={`/artists/${artist.id}`} className="text-primary hover:underline">
                  {artist.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {artwork.medium}, {artwork.year}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => upvoteArtwork(artwork.id)} aria-label="Upvote">
                <ThumbsUp className="h-5 w-5" />
              </Button>
              <span className="text-sm font-medium">{artwork.upvotes}</span>
              <Button variant="ghost" size="icon" onClick={() => downvoteArtwork(artwork.id)} aria-label="Downvote">
                <ThumbsDown className="h-5 w-5" />
              </Button>
              <span className="text-sm font-medium">{artwork.downvotes}</span>
            </div>
          </div>
          <p className="mt-4">{artwork.description}</p>
        </div>
      </div>
      <CardFooter className="flex justify-between p-4 pt-0 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare className="h-4 w-4" />
          <span>{comments.length} Comments</span>
          {showComments ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardFooter>
      {showComments && (
        <CardContent className="pt-0 pb-4">
          <CommentSection artworkId={artwork.id} comments={comments} />
        </CardContent>
      )}
      <ArtworkLightbox artwork={artwork} artist={artist} open={lightboxOpen} onOpenChange={setLightboxOpen} />
    </Card>
  )
}

