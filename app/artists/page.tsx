"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useArt } from "@/context/art-context";

export default function ArtistsPage() {
  const { artists, getArtworksByArtistId } = useArt();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Artists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => {
          const artworks = getArtworksByArtistId(artist.id);
          const totalUpvotes = artworks.reduce(
            (sum, artwork) => sum + artwork.upvotes,
            0
          );
          const totalDownvotes = artworks.reduce(
            (sum, artwork) => sum + artwork.downvotes,
            0
          );

          return (
            <Card key={artist.id} className="overflow-hidden flex flex-col">
              <div className="aspect-square relative">
                <Image
                  src={artist.avatar || "/placeholder.svg"}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4 grow">
                <h2 className="text-xl font-bold">{artist.name}</h2>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                  {artist.bio}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <div className="text-sm">
                  <span className="font-medium">{artworks.length}</span>{" "}
                  artworks
                </div>
                <div className="text-sm">
                  <span className="font-medium">
                    {totalUpvotes - totalDownvotes}
                  </span>{" "}
                  rating
                </div>
                <Link
                  href={`/artists/${artist.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  View Profile
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
