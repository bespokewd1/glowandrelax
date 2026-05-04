import type { ImageMetadata } from 'astro';

import services1Img from '@assets/images/Services-1.TherapeuticMassage.jpg';
import services2Img from '@assets/images/Services-2.DeepTissueMassage.jpg';
import services3Img from '@assets/images/swedish-massage.jpg';
import services4Img from '@assets/images/Services-4.CuppingMassage.jpg';
import services6Img from '@assets/images/Services-6.LymphaticMassage.jpg';
import services7Img from '@assets/images/Services-7.jpg';
import services8Img from '@assets/images/Services-8.jpg';
import services9Img from '@assets/images/bucal-massage.jpg';
import services10Img from '@assets/images/couples-massage.jpg';
import services11Img from '@assets/images/injury.png';
import services12Img from '@assets/images/hilot.png';
import services13Img from '@assets/images/foot.png';
import services14Img from '@assets/images/therapeutic.png';
import services15Img from '@assets/images/stone-massage-background1.png';

import services1ImgBlur from '@assets/images/blur-Services-1.TherapeuticMassage.webp';
import services2ImgBlur from '@assets/images/blur-Services-2.DeepTissueMassage.webp';
import services3ImgBlur from '@assets/images/blur-swedish-massage.webp';
import services4ImgBlur from '@assets/images/blur-Services-4.CuppingMassage.webp';
import services6ImgBlur from '@assets/images/blur-Services-6.LymphaticMassage.webp';
import services7ImgBlur from '@assets/images/blur-Services-7.webp';
import services8ImgBlur from '@assets/images/blur-Services-8.webp';
import services9ImgBlur from '@assets/images/blur-bucal-massage.webp';
import services10ImgBlur from '@assets/images/blur-couples-massage.webp';
import services11ImgBlur from '@assets/images/blur-injury.webp';
import services12ImgBlur from '@assets/images/blur-hilot.webp';
import services13ImgBlur from '@assets/images/blur-foot.webp';
import services14ImgBlur from '@assets/images/blur-therapeutic.webp';
import services15ImgBlur from '@assets/images/blur-hot-stone.webp';

export type ServiceMeta = {
  title?: string; // optional for override
  blurb: string;
  cta?: string;
  img: ImageMetadata;
  blurImg: ImageMetadata;
};

// Key by the last path segment (slug) from navData children URLs
export const serviceMetaBySlug: Record<string, ServiceMeta> = {
  'deep-tissue': {
    blurb:
      'Targets deeper muscle layers to relieve chronic tension, muscle tightness, and pain.',
    img: services2Img,
    blurImg: services2ImgBlur,
  },
  swedish: {
    blurb:
      'A gentle, full-body massage designed to reduce stress, ease tension, and promote overall relaxation.',
    img: services3Img,
    blurImg: services3ImgBlur,
  },
  prenatal: {
    blurb:
      'A soothing massage tailored to the needs of expectant mothers to ease discomfort and support prenatal wellness.',
    img: services1Img,
    blurImg: services1ImgBlur,
  },
  cupping: {
    blurb:
      'An ancient therapy using suction cups to improve circulation, relieve muscle tension, and promote healing.',
    img: services4Img,
    blurImg: services4ImgBlur,
  },
  sports: {
    blurb:
      'Focused therapy for athletes to enhance performance, prevent injury, and aid recovery.',
    img: services6Img,
    blurImg: services6ImgBlur,
  },
  craniosacral: {
    blurb:
      'A light-touch technique that releases tension in the central nervous system to improve overall health and well-being.',
    img: services7Img,
    blurImg: services7ImgBlur,
  },
  mva: {
    blurb:
      'Therapeutic treatment to address pain and soft tissue injuries resulting from car accidents, often covered by insurance.',
    img: services8Img,
    blurImg: services8ImgBlur,
  },
  'bucal-massage': {
    blurb: 'Gentle facial and jaw therapy to relieve tension and improve circulation.',
    img: services9Img,
    blurImg: services9ImgBlur,
  },
  'couples-massage': {
    blurb:
      'Relaxing side-by-side massage experience for you and your partner.',
    img: services10Img,
    blurImg: services10ImgBlur,
  },
  'injury-recovery-massage': {
    blurb: 'Targeted therapy to aid healing, reduce pain, and restore mobility.',
    img: services11Img,
    blurImg: services11ImgBlur,
  },
  'filipino-oil-massage': {
    blurb:
      'Traditional Filipino massage using local Filipino warm oils (e.g., Pau d’Arco) to relax muscles and promote wellness.',
    img: services12Img,
    blurImg: services12ImgBlur,
  },
  'foot-massage': {
    blurb:
      'A focused treatment that targets pressure points in the feet to relieve tension, improve circulation, and promote full-body relaxation.',
    img: services13Img,
    blurImg: services13ImgBlur,
  },
  'therapeutic-massage': {
    blurb:
      'A customized, hands-on treatment designed to reduce muscle tension, ease pain, and support overall mobility and recovery.',
    img: services14Img,
    blurImg: services14ImgBlur,
  },
  'hot-stone': {
    blurb:
      'A soothing massage that uses warmed stones to relax tight muscles, improve blood flow, and deliver deep, calming relief.',
    img: services15Img,
    blurImg: services15ImgBlur,
  },
  
};
