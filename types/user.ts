export enum UserTypeEnum {
  DEV = 'dev',
  CLIENT = 'client',
  RECRUITER = 'recruiter',
  HUNTER = 'hunter',
  ADMIN = 'admin',
  CONTRACTOR = 'contractor'
}

export enum DeveloperTypeEnum {
  FRONTEND = 'Frontend developer',
  BACKEND = 'Backend developer',
  FULLSTACK = 'Fullstack developer',
  MOBILE = 'Mobile developer',
  DATA_SCIENTIST = 'Data scientist',
  DATA_ENGINEER = 'Data engineer',
}

export enum ContactLocationEnum {
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  LINKEDIN = 'linkedin'
}

export type Tech = {
  name: string;
  years: number;
}

export type TechInput = {
  name: string;
  years: string;
}

export default interface User {
  id: string,
  password: string,
  email: string,
  name: string,
  type: UserTypeEnum,
  looking: boolean,
  contactLocation: ContactLocationEnum,
  tech: Tech[],
  languages?: string[],
  location?: {
    country: string,
    state: string,
    city: string
  },
  destinationUrl?: string,
  CVUrl?: string,
  linkedinUrl?: string,
  linkedinAccessToken?: string,
  phone?: string,
  businessReferral?: string,
  lastShowedAppsumoReviewModalAt?: Date,
  reviewSent?: boolean;
  createdAt?: Date,
  updatedAt?: Date,
  referral?: string,
}