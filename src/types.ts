export interface ServiceCardData {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  image: string;
  features: string[];
}

export interface BenefitData {
  title: string;
  description: string;
  icon: string;
}

export interface CaseStudyData {
  title: string;
  client: string;
  segment: string;
  description: string;
  results: string[];
  impact: string;
}

export interface FAQData {
  question: string;
  answer: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  budgetEstimated?: number;
}
