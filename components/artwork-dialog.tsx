"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Artist, Artwork, useArt } from "@/context/art-context";
import { useToast } from "@/hooks/use-toast";

const artworkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z
    .string()
    .url("Must be a valid URL")
    .or(z.string().min(1, "Image URL is required")),
  artistId: z.string().min(1, "Artist is required"),
  medium: z.string().min(1, "Medium is required"),
  year: z.coerce
    .number()
    .int()
    .min(1, "Year is required")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
});

type ArtworkFormValues = z.infer<typeof artworkSchema>;

interface ArtworkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artists: Artist[];
  artwork?: Artwork;
}

export function ArtworkDialog({
  open,
  onOpenChange,
  artists,
  artwork,
}: ArtworkDialogProps) {
  const { addArtwork, updateArtwork } = useArt();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const form = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      title: artwork?.title ?? "",
      description: artwork?.description ?? "",
      imageUrl: artwork?.imageUrl ?? "",
      artistId: artwork?.artistId ?? "",
      medium: artwork?.medium ?? "",
      year: artwork?.year ?? new Date().getFullYear(),
    },
  });

  const onSubmit = (values: ArtworkFormValues) => {
    setIsSubmitting(true);

    if (artwork) {
      updateArtwork(artwork.id, values);
      toast({
        title: "Artwork updated",
        description: "Artwork has been updated successfully",
      });
    } else {
      addArtwork(values);
      toast({
        title: "Artwork added",
        description: "Artwork has been added successfully",
      });
    }

    setIsSubmitting(false);
    handleOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }

    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px] h-[90vh] flex flex-col px-0">
        <DialogHeader className="px-6">
          <DialogTitle>Add New Artwork</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grow flex flex-col gap-4 min-h-0"
          >
            <div className="flex flex-col gap-4 grow min-h-0 overflow-auto px-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter artwork title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter artwork description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="artistId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artist</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an artist" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {artists.map((artist) => (
                          <SelectItem key={artist.id} value={artist.id}>
                            {artist.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="medium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medium</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Oil on canvas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="px-6">
              {artwork ? (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Artwork"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
