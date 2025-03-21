"use client";

import { ArtworkCard } from "@/components/artwork-card";
import { useArt } from "@/context/art-context";

export default function Home() {
  const { artworks, getArtistById, getCommentsByArtworkId } = useArt();

  // Sort artworks by creation date (newest first)
  const sortedArtworks = [...artworks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Explore Artwork</h1>
      <div className="space-y-8">
        {sortedArtworks.map((artwork) => {
          const artist = getArtistById(artwork.artistId);
          const comments = getCommentsByArtworkId(artwork.id);

          if (!artist) return null;

          return (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              artist={artist}
              comments={comments}
            />
          );
        })}
      </div>
    </div>
  );
}
