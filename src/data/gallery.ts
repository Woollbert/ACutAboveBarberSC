// Shop-wide gallery items. As Kristy/DJ identify which barber did each cut,
// move items into the per-barber `portfolio` array in barbers.json and remove
// from here so they aren't shown twice.
//
// Captions are intentionally generic for now — Kristy can edit them via the
// CMS once we wire that up, or we can hand-categorize them later.

export type GalleryItem = {
  image: string;
  caption?: string;
  /** Optional: which barber did the cut, by slug. Used for filtering later. */
  barber?: string;
};

export const gallery: GalleryItem[] = [
  { image: "/gallery/cut-01-78c648ca.jpg", caption: "Skin fade with razor lineup" },
  { image: "/gallery/cut-02-49d86e70.jpg", caption: "Mid taper with textured top" },
  { image: "/gallery/cut-03-850ea619.jpg", caption: "Buzz fade, clean blend" },
  { image: "/gallery/cut-04-4451a505.jpg", caption: "Low fade with longer top" },
  { image: "/gallery/cut-05-5e7254d7.jpg", caption: "High & tight with full beard" },
  { image: "/gallery/cut-06-cf4c1198.jpg", caption: "Skin fade, military regulation" },
  { image: "/gallery/cut-07-61f8754d.jpg", caption: "Women's bob with color" },
  { image: "/gallery/cut-08-4d171788.jpg", caption: "Curly top with skin fade" },
  { image: "/gallery/cut-09-5ba7d622.jpg", caption: "Short fade, clean detail" },
  { image: "/gallery/cut-10-19755134.jpg", caption: "Side part with low fade — kid's cut" },
  { image: "/gallery/cut-11-4e479974.jpg", caption: "Comb-over fade collage — kid's cut" },
  { image: "/gallery/cut-12-044baaa6.jpg", caption: "Mullet fade, modern take" },
  { image: "/gallery/cut-13-c040ad1c.jpg", caption: "Razor design with high fade" },
  { image: "/gallery/cut-14-8d005c37.jpg", caption: "Razor design with curly top" },
  { image: "/gallery/cut-15-8d8bd3ee.jpg", caption: "Skin fade with sharp lineup" },
  { image: "/gallery/cut-16-f2544623.jpg", caption: "Skin fade with razor design — kid's cut" },
  { image: "/gallery/cut-17-33d63b83.jpg", caption: "Spiked top with fade and beard" },
  { image: "/gallery/cut-18-3cd54d08.jpg", caption: "Short cut with full beard" },
  { image: "/gallery/cut-19-75409b86.jpg", caption: "Buzz with sharp lineup" },
  { image: "/gallery/cut-20-361f7464.jpg", caption: "Spiked top with fade and beard" },
];
