import siteData from './site.json';

// All editable shop content lives in site.json (so the CMS can edit it).
// This file just adds derived/computed values (tel:, sms: links and helpers)
// and the navLinks (dev-only structural data).

const phoneDigits = siteData.phone.replace(/\D/g, '');
const smsDigits = siteData.smsNumber.replace(/\D/g, '');

export const site = {
  ...siteData,
  phoneTel: `+1${phoneDigits}`,
  smsHref: `sms:+1${smsDigits}`,
  navLinks: [
    { href: "/",          label: "Home" },
    { href: "/about/",    label: "About" },
    { href: "/services/", label: "Services" },
    { href: "/barbers/",  label: "Barbers" },
    { href: "/gallery/",  label: "Gallery" },
    { href: "/contact/",  label: "Visit & Book" },
  ],
};

export const fullAddress = `${siteData.address.street}, ${siteData.address.city}, ${siteData.address.region} ${siteData.address.postal}`;
export const mapsHref = "https://maps.google.com/?q=" + encodeURIComponent(fullAddress);
