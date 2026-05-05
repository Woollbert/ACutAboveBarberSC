import data from './barbers.json';

export type SocialLinks = {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
};

export type PortfolioItem = {
  /** Path under /public, e.g. "/work/kristy/cut-01.jpg". */
  image: string;
  /** Optional short description, e.g. "Skin fade with razor lineup". */
  caption?: string;
};

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
  social?: SocialLinks;
  portfolio?: PortfolioItem[];
};

// Normalize: strip empty strings so consumers can use truthy checks cleanly.
function clean<T extends Record<string, unknown>>(obj?: T): T | undefined {
  if (!obj) return undefined;
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string' && v.trim().length === 0) continue;
    cleaned[k] = v;
  }
  return Object.keys(cleaned).length > 0 ? (cleaned as T) : undefined;
}

export const barbers: Barber[] = (data.barbers as Barber[]).map((b) => ({
  ...b,
  photo: b.photo && b.photo.trim().length > 0 ? b.photo : undefined,
  social: clean(b.social),
  portfolio: (b.portfolio ?? []).filter((p) => p.image && p.image.trim().length > 0),
}));

export function findBarberBySlug(slug: string): Barber | undefined {
  return barbers.find((b) => b.slug === slug);
}
