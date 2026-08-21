export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  features: string[];
  link: string;
}

export interface StatItem {
  number: number;
  suffix: string;
  label: string;
  icon: string;
  color: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface ClientItem {
  id: number;
  name: string;
  logo: string;
  category: string;
}
