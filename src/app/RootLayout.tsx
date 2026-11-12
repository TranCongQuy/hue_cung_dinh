import { Outlet } from "react-router";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { ToastContainer } from "../components/common/UI";
import { CartDrawer } from "../components/common/CartDrawer";
import { ScrollToTop } from "../components/common/ScrollToTop";
import { ScrollProgressBar } from "../components/common/ScrollProgressBar";
import { RoyalCommandPalette } from "../components/common/RoyalCommandPalette";
import {
  WishlistDrawer,
  ComparePackagesWidget,
} from "../components/common/WishlistAndCompareWidgets";

export function RootLayout() {
  return (
    <div className="root-layout-wrapper">
      <ScrollProgressBar />
      <ScrollToTop />
      <Header />
      <main className="root-main-content">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
      <CartDrawer />
      <WishlistDrawer />
      <ComparePackagesWidget />
      <RoyalCommandPalette />
    </div>
  );
}
