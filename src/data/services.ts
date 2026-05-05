import data from './services.json';

export type Service = {
  name: string;
  description: string;
  features?: string[];
  /** "Starting at" price as display string, e.g. "$35". Empty string = no badge. */
  priceFrom?: string;
  priceNote?: string;
  addOns?: string[];
};

// Empty priceFrom means "no fixed price" — strip it so the badge is hidden cleanly.
export const services: Service[] = (data.items as Service[]).map((s) => ({
  ...s,
  priceFrom: s.priceFrom && s.priceFrom.trim().length > 0 ? s.priceFrom : undefined,
}));

export const pricingIsPlaceholder = data.pricingIsPlaceholder;
export const extras = data.extras;
