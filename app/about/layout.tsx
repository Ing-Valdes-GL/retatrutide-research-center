import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us | Retatrutide Research Center",
  description: "Learn more about Retatrutide Research Center, our mission, and our commitment to medical innovation.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}