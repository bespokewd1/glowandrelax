import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { GetImageResult, ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import client from '@data/clientData';
import settings from '@data/seo-pages.json';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
// Increment after visual template changes to refresh previously shared cards.
const TEMPLATE_VERSION = 1;

export type SocialImage = {
  src: string;
  width: number;
  height: number;
  type: string;
  alt: string;
};

export const pagePaths = {
  home: '/',
  about: '/about/',
  services: '/services/',
  contact: '/contact/',
  directBilling: '/direct-billing/',
  gallery: '/gallery/',
  reviews: '/reviews/',
} as const;
export type PageKey = keyof typeof pagePaths | 'global';

type PageSettings = {
  title?: string;
  description?: string;
  ogImage?: string;
  ogPhoto?: string;
  ogImageAlt?: string;
};

const pageCards: Record<
  PageKey,
  { headline: string; label: string; detail: string; action: string }
> = {
  global: {
    headline: 'Care for body.\nRoom to relax.',
    label: 'Massage therapy',
    detail: 'Therapeutic and relaxation massage',
    action: 'Explore our services',
  },
  home: {
    headline: 'Your time\nto feel better.',
    label: 'Massage therapy',
    detail: 'Personalized care for your body and mind.',
    action: 'Find your massage',
  },
  about: {
    headline: 'Thoughtful care.\nPersonal to you.',
    label: 'About Glow and Relax',
    detail: 'Get to know our approach to massage.',
    action: 'Discover our approach',
  },
  services: {
    headline: 'Find the massage\nfor you.',
    label: 'Our services',
    detail: 'Deep tissue, Swedish, hot stone and more.',
    action: 'Explore our services',
  },
  contact: {
    headline: 'Let’s plan\nyour visit.',
    label: 'Contact and directions',
    detail: [
      client.address.lineOne,
      client.address.lineTwo,
      client.address.city,
      client.address.state,
      client.address.zip,
    ]
      .filter(Boolean)
      .join(', '),
    action: client.phoneFormatted,
  },
  directBilling: {
    headline: 'Less paperwork.\nMore time for you.',
    label: 'Direct billing',
    detail: 'Ask us about your insurance provider.',
    action: 'See how it works',
  },
  gallery: {
    headline: 'A moment\nof calm.',
    label: 'Our gallery',
    detail: 'Explore massage and treatment photography.',
    action: 'View the gallery',
  },
  reviews: {
    headline: 'Care worth\ntalking about.',
    label: 'Client reviews',
    detail: 'Glow and Relax · Massage therapy',
    action: 'Explore our approach',
  },
};

export function getServiceSeo(service: CollectionEntry<'services'>) {
  const data = service.data;
  return {
    title:
      data.seo?.title?.trim() ||
      `${data.title} in ${client.address.city}, ${client.address.state}`,
    description:
      data.seo?.description?.trim() ||
      data.subtitle.trim() ||
      data.cardDescription?.trim() ||
      settings.global.description,
  };
}

export function documentTitle(title: string) {
  return title === client.name || title.endsWith(` | ${client.name}`)
    ? title
    : `${title} | ${client.name}`;
}

const sourceImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpeg,jpg,png,gif,webp,avif}'
);
let imagePaths: Promise<Map<string, string>> | undefined;

async function sourcePath(image: string | ImageMetadata) {
  if (typeof image === 'string') {
    if (!sourceImages[image])
      throw new Error(`Social image is not a local image asset: ${image}`);
    return image;
  }
  imagePaths ??= Promise.all(
    Object.entries(sourceImages).map(async ([path, load]) => {
      const { default: metadata } = await load();
      return [metadata.src, path] as const;
    })
  ).then((entries) => new Map(entries));
  const path = (await imagePaths).get(image.src);
  if (!path) throw new Error(`Cannot locate social image source: ${image.src}`);
  return path;
}

async function readImage(image: string | ImageMetadata) {
  const path = await sourcePath(image);
  // Astro's CLI builds from the project root; read source bytes, never deployed URLs.
  return readFile(resolve(process.cwd(), path.slice(1)));
}

export type OgCard = {
  key: string;
  route: string;
  headline: string;
  label: string;
  detail: string;
  action: string;
  photo: Buffer;
  override: boolean;
  image: SocialImage;
};

export const brandAssets = Promise.all([
  readFile(
    resolve(process.cwd(), 'src/assets/fonts/fraunces-latin-normal-400.woff2')
  ),
  readFile(
    resolve(process.cwd(), 'src/assets/fonts/mona-sans-latin-normal-400.woff')
  ),
  readFile(
    resolve(process.cwd(), 'src/assets/images/logo/glow-relax-icon.png')
  ),
]).then(([serif, sans, logo]) => ({ serif, sans, logo }));

async function makeCard(input: {
  key: string;
  route: string;
  headline: string;
  label: string;
  detail: string;
  action: string;
  photo: string | ImageMetadata;
  override?: string | ImageMetadata;
  alt?: string;
}): Promise<OgCard> {
  const photo = await readImage(input.override || input.photo);
  const assets = await brandAssets;
  const { photo: _photo, override: _override, ...text } = input;
  const hash = createHash('sha256')
    .update(String(TEMPLATE_VERSION))
    .update(String(Boolean(input.override)))
    .update(JSON.stringify(text))
    .update(client.name)
    .update(client.domain)
    .update(client.address.city)
    .update(client.address.state)
    .update(new Uint8Array(photo))
    .update(new Uint8Array(assets.serif))
    .update(new Uint8Array(assets.sans))
    .update(new Uint8Array(assets.logo))
    .digest('hex')
    .slice(0, 12);
  const slug = `${input.key}-${hash}`;
  return {
    ...text,
    photo,
    override: Boolean(input.override),
    image: {
      src: `/og/${slug}.png`,
      width: OG_WIDTH,
      height: OG_HEIGHT,
      type: 'image/png',
      alt:
        input.alt?.trim() ||
        `${client.name} social card: ${input.headline.replace(/\n/g, ' ')} ${client.address.city}, ${client.address.state}.`,
    },
  };
}

let cardsPromise: Promise<OgCard[]> | undefined;
export function getOgCards() {
  if (import.meta.env.DEV) cardsPromise = undefined;
  cardsPromise ??= (async () => {
    const pages = await Promise.all(
      (Object.keys(pageCards) as PageKey[]).map((key) => {
        const seo: PageSettings = settings[key];
        return makeCard({
          key,
          route: key === 'global' ? '/' : pagePaths[key],
          ...pageCards[key],
          photo:
            seo.ogPhoto?.trim() ||
            settings.global.ogPhoto?.trim() ||
            '/src/assets/images/home/hero-img1.webp',
          override: seo.ogImage?.trim() || undefined,
          alt: seo.ogImageAlt,
        });
      })
    );
    const services = await getCollection('services');
    const serviceCards = await Promise.all(
      services.map((service) =>
        makeCard({
          key: `service-${service.id}`,
          route: `/services/${service.id}/`,
          headline: service.data.title,
          label: 'Massage services',
          detail: `Personalized care in ${client.address.city}, Alberta.`,
          action: 'Explore this treatment',
          photo: service.data.image,
          override: service.data.seo?.ogImage,
          alt:
            service.data.seo?.ogImageAlt?.trim() ||
            `${client.name} card for ${service.data.title} in ${client.address.city}, Alberta, with treatment photography.`,
        })
      )
    );
    return [...pages, ...serviceCards];
  })();
  return cardsPromise;
}

export async function getSocialImage(key: string) {
  const card = (await getOgCards()).find((entry) => entry.key === key);
  if (!card) throw new Error(`No social card configured for ${key}`);
  return card.image;
}

export async function getPageSeo(key: PageKey) {
  const page: PageSettings = settings[key];
  return {
    seo: {
      title: page.title?.trim() || settings.global.title,
      description: page.description?.trim() || settings.global.description,
    },
    ogImage: await getSocialImage(key),
  };
}

// Older routes can continue passing an optimized photo without changing preloads.
export function socialImageFromOptimized(
  image: GetImageResult,
  alt: string
): SocialImage {
  const format = String(image.options.format || 'webp');
  return {
    src: image.src,
    width: Number(image.attributes.width),
    height: Number(image.attributes.height),
    type: `image/${format === 'jpg' ? 'jpeg' : format}`,
    alt,
  };
}
