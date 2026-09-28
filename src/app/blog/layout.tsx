import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
