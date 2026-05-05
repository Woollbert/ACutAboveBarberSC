import data from './barbers.json';

export type Barber = {
  slug: string;
  name: string;
  role: string;
  years: string;
  tagline: string;
  bio: string;
  specialties: string[];
  /** Path under /public, e.g. "/barbers/kristy.jpg". Empty string = use placeholder. */
  photo?: string;
};

// Strip empty photo strings so the avatar component falls back to monogram cleanly.
export const barbers: Barber[] = (data.barbers as Barber[]).map((b) => ({
  ...b,
  photo: b.photo && b.photo.trim().length > 0 ? b.photo : undefined,
}));
