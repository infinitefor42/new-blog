import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function GuestbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
