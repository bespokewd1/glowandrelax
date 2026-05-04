import navInfo from '@data/navInfo.json';
import bookingInfo from "@data/booking.json"
import { getCollection } from 'astro:content';

export type NavChild = {
  key: string;
  url: string;
};

export type NavItem = {
  key: string;
  url: string;
  children?: NavChild[];
};

type NavInfo = {
  home: string;
  about: string;
  services: string;
  contact: string;
  directBilling: string;
  book: string;
};

export async function getNavData(): Promise<NavItem[]> {
  const labels = navInfo as NavInfo;

  const baseNav: NavItem[] = [
    { key: labels.home, url: '/' },
    { key: labels.about, url: '/about' },
    { key: labels.services, url: '/services/' },
    { key: labels.contact, url: '/contact/' },
    { key: labels.directBilling, url: '/direct-billing/' },
    {
      key: 'Book Appointment',
      url: bookingInfo.buttonLink,
    },
  ];

  const servicesEntries = await getCollection('services');

  const serviceChildren: NavChild[] = servicesEntries
    .sort((a, b) => a.data.title.localeCompare(b.data.title))
    .map((entry) => ({
      key: entry.data.title,
      url: `/services/${entry.id}`,
    }));

  // Attach children to the Services node
  return baseNav.map((item) =>
    item.key === 'Services'
      ? { ...item, children: serviceChildren }
      : item,
  );
}
