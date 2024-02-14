import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/shared/Footer";
import Overlay from "@/components/shared/Overlay";
import SlideInCart from "@/components/shared/SlideInCart";
import Search from "@/components/ui/Search";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Overlay />
      <SlideInCart />
      <Search />
      {children}
      <Footer />
    </>
  );
}
