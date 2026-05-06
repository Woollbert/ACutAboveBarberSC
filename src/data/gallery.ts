import data from './gallery.json';

export type GalleryItem = {
  image: string;
  caption?: string;
  /** Optional: which barber did the cut, by slug. Used for filtering later. */
  barber?: string;
};

export const gallery: GalleryItem[] = (data.items as GalleryItem[]).filter(
  (item) => item.image && item.image.trim().length > 0
);
