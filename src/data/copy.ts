// Single import surface for all editable page copy.
// Each JSON file is editable via Decap CMS at /admin/ → "Page Copy".

import home from './copy/home.json';
import about from './copy/about.json';
import servicesPage from './copy/services-page.json';
import barbersPage from './copy/barbers-page.json';
import galleryPage from './copy/gallery-page.json';
import contactPage from './copy/contact-page.json';
import global from './copy/global.json';

export const copy = {
  home,
  about,
  servicesPage,
  barbersPage,
  galleryPage,
  contactPage,
  global,
};

export type Copy = typeof copy;
