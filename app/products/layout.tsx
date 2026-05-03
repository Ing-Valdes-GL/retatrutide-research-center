import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Our Products | Retatrutide Research Center",
  description: "Explore the full range of high-quality pharmaceutical products and medical solutions offered by Retatrutide Research Center.",
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}