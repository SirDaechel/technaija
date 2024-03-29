"use client";

import { useScrollHeader } from "@/hooks/useScrollHeader";
import { useSelector, useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import { cartCountState } from "@/libs/redux-state/features/cart-count/cartCountSlice";
import { useEffect } from "react";
import { setCartCount } from "@/libs/redux-state/features/cart-count/cartCountSlice";
import LargeScreenNav from "./LargeScreenNav";
import MobileNav from "./MobileNav";
// import CurrencyConverter from "./CurrencyConverter";

type NavBarProps = {
  userCart: UserCartCount[];
  userId: string;
};

const NavbarItems = ({ userCart }: NavBarProps) => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const theCount = useSelector(cartCountState);
  const { cartCount } = theCount;

  const { isScrolled } = useScrollHeader();

  useEffect(() => {
    // Set the total carted product number to the redux cartCount state
    dispatch(setCartCount(userCart[0]?.count));
  }, [userCart]);

  return (
    <header
      className={`w-full px-20 py-4 z-[55] transition-[0.3s] bg-transparent sticky top-0 drop-shadow-md m:px-6 xl:px-12 ${
        isScrolled ? "bg-white" : "bg-transparent"
      }`}
    >
      {/* Large screen nav */}
      <LargeScreenNav pathname={pathname} cartCount={cartCount} />

      {/* Small screen size */}
      <MobileNav />
    </header>
  );
};

export default NavbarItems;
