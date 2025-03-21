"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";

export interface Artist {
  id: string;
  name: string;
  bio: string;
  avatar: string;
}

export interface Comment {
  id: string;
  artworkId: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  artistId: string;
  medium: string;
  year: number;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

interface ArtContextType {
  artworks: Artwork[];
  artists: Artist[];
  comments: Comment[];
  addArtwork: (
    artwork: Omit<Artwork, "id" | "createdAt" | "upvotes" | "downvotes">
  ) => void;
  updateArtwork: (id: string, artwork: Partial<Artwork>) => void;
  deleteArtwork: (id: string) => void;
  addComment: (comment: Omit<Comment, "id" | "createdAt">) => void;
  updateComment: (id: string, text: string) => void;
  deleteComment: (id: string) => void;
  upvoteArtwork: (id: string) => void;
  downvoteArtwork: (id: string) => void;
  getArtworkById: (id: string) => Artwork | undefined;
  recoverArtwork: (artwork: Artwork) => void;
  getArtistById: (id: string) => Artist | undefined;
  getArtworksByArtistId: (artistId: string) => Artwork[];
  getCommentsByArtworkId: (artworkId: string) => Comment[];
  recoverComment: (comment: Comment) => void;
}

const ArtContext = createContext<ArtContextType | undefined>(undefined);

const initialArtists: Artist[] = [
  {
    id: "1",
    name: "Vincent van Gogh",
    bio: "Dutch post-impressionist painter who posthumously became one of the most famous and influential figures in Western art history.",
    avatar: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Frida Kahlo",
    bio: "Mexican painter known for her many portraits, self-portraits, and works inspired by the nature and artifacts of Mexico.",
    avatar: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Claude Monet",
    bio: "French painter and founder of impressionist painting who is seen as a key precursor to modernism.",
    avatar: "/placeholder.svg?height=200&width=200",
  },
];

const initialArtworks: Artwork[] = [
  {
    id: "1",
    title: "Starry Night",
    description:
      "The Starry Night is an oil on canvas painting by Dutch Post-Impressionist painter Vincent van Gogh.",
    imageUrl: "/placeholder.svg?height=600&width=800",
    artistId: "1",
    medium: "Oil on canvas",
    year: 1889,
    upvotes: 120,
    downvotes: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "The Two Fridas",
    description:
      "The Two Fridas is an oil painting by Mexican artist Frida Kahlo. The painting was the first large-scale work done by Kahlo.",
    imageUrl: "/placeholder.svg?height=600&width=800",
    artistId: "2",
    medium: "Oil on canvas",
    year: 1939,
    upvotes: 95,
    downvotes: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Water Lilies",
    description:
      "Water Lilies is a series of approximately 250 oil paintings by French Impressionist Claude Monet.",
    imageUrl: "/placeholder.svg?height=600&width=800",
    artistId: "3",
    medium: "Oil on canvas",
    year: 1916,
    upvotes: 110,
    downvotes: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Sunflowers",
    description:
      "Sunflowers is the name of two series of still life paintings by the Dutch painter Vincent van Gogh.",
    imageUrl: "/placeholder.svg?height=600&width=800",
    artistId: "1",
    medium: "Oil on canvas",
    year: 1888,
    upvotes: 130,
    downvotes: 7,
    createdAt: new Date().toISOString(),
  },
];

const initialComments: Comment[] = [
  {
    id: "1",
    artworkId: "1",
    text: "This is one of my favorite paintings of all time!",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    artworkId: "1",
    text: "The swirling clouds and stars are so captivating.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    artworkId: "2",
    text: "The symbolism in this painting is incredible.",
    createdAt: new Date().toISOString(),
  },
];

export function ArtProvider({ children }: { children: ReactNode }) {
  const [artworks, baseSetArtworks] = useState<Artwork[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const setArtworks = (artworks: Artwork[]) => {
    baseSetArtworks(
      artworks.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
  };

  // Load initial data from localStorage or use defaults
  useEffect(() => {
    const storedArtworks = localStorage.getItem("artworks");
    const storedArtists = localStorage.getItem("artists");
    const storedComments = localStorage.getItem("comments");

    setArtworks(storedArtworks ? JSON.parse(storedArtworks) : initialArtworks);
    setArtists(storedArtists ? JSON.parse(storedArtists) : initialArtists);
    setComments(storedComments ? JSON.parse(storedComments) : initialComments);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (artworks.length > 0)
      localStorage.setItem("artworks", JSON.stringify(artworks));
    if (artists.length > 0)
      localStorage.setItem("artists", JSON.stringify(artists));
    if (comments.length > 0)
      localStorage.setItem("comments", JSON.stringify(comments));
  }, [artworks, artists, comments]);

  const addArtwork = (
    artwork: Omit<Artwork, "id" | "createdAt" | "upvotes" | "downvotes">
  ) => {
    const newArtwork: Artwork = {
      ...artwork,
      id: uuidv4(),
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
    };
    setArtworks([...artworks, newArtwork]);
  };

  const updateArtwork = (id: string, updatedArtwork: Partial<Artwork>) => {
    setArtworks(
      artworks.map((artwork) =>
        artwork.id === id ? { ...artwork, ...updatedArtwork } : artwork
      )
    );
  };

  const deleteArtwork = (id: string) => {
    setArtworks(artworks.filter((artwork) => artwork.id !== id));
    // Also delete associated comments
    setComments(comments.filter((comment) => comment.artworkId !== id));
  };

  const addComment = (comment: Omit<Comment, "id" | "createdAt">) => {
    const newComment: Comment = {
      ...comment,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
  };

  const updateComment = (id: string, text: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              text,
              updatedAt: new Date().toISOString(),
            }
          : comment
      )
    );
  };

  const deleteComment = (id: string) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  const upvoteArtwork = (id: string) => {
    setArtworks(
      artworks.map((artwork) =>
        artwork.id === id
          ? { ...artwork, upvotes: artwork.upvotes + 1 }
          : artwork
      )
    );
  };

  const downvoteArtwork = (id: string) => {
    setArtworks(
      artworks.map((artwork) =>
        artwork.id === id
          ? { ...artwork, downvotes: artwork.downvotes + 1 }
          : artwork
      )
    );
  };

  const getArtworkById = (id: string) => {
    return artworks.find((artwork) => artwork.id === id);
  };

  const recoverArtwork = (artwork: Artwork) => {
    setArtworks([...artworks.filter((art) => art.id !== artwork.id), artwork]);
  };

  const getArtistById = (id: string) => {
    return artists.find((artist) => artist.id === id);
  };

  const getArtworksByArtistId = (artistId: string) => {
    return artworks.filter((artwork) => artwork.artistId === artistId);
  };

  const getCommentsByArtworkId = (artworkId: string) => {
    return comments.filter((comment) => comment.artworkId === artworkId);
  };

  const recoverComment = (comment: Comment) => {
    setComments([...comments.filter((com) => com.id !== comment.id), comment]);
  };

  return (
    <ArtContext.Provider
      value={{
        artworks,
        artists,
        comments,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        addComment,
        updateComment,
        deleteComment,
        upvoteArtwork,
        downvoteArtwork,
        getArtworkById,
        recoverArtwork,
        getArtistById,
        getArtworksByArtistId,
        getCommentsByArtworkId,
        recoverComment,
      }}
    >
      {children}
    </ArtContext.Provider>
  );
}

export function useArt() {
  const context = useContext(ArtContext);
  if (context === undefined) {
    throw new Error("useArt must be used within an ArtProvider");
  }
  return context;
}
