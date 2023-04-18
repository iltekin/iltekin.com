import type { SponsorsCategoryKey } from './manual-sponsors';

type TimeStamp =
  `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;


export interface Sponsor {
  name: string;
  link?: string;
  photo: string;
  username?: string;
  since?: TimeStamp;
}

export interface SponsorCategory {
  id?: string;
  name?: string;
  key: SponsorsCategoryKey;
  sponsors?: Array<Sponsor>;
  price?: number;
  totalEarningsPerMonth?: number;
  sponsorsCount?: number;
}

export interface Testimonial {
  content: string;
  sponsor: {
    name: string;
    photo?: string;
  };
}

export interface SponsorsCategoriesResponse {
  categories?: Array<SponsorCategory>;
  testimonials?: Array<Testimonial>;
  error?: string;
  totalEarningsPerMonth?: number;
  sponsorsCount?: number;
  bmac?: unknown;
}
