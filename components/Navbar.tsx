"use client";

import Image from "next/image";
import Link from "next/link";
import { mainNavigation, mainIconNavigation } from "@/constants";
import { useScrollHeader } from "@/hooks/useScrollHeader";

const Navbar = () => {
  const { isScrolled } = useScrollHeader();
  return (
    <header
      className={`w-full px-20 py-4 flex items-center justify-between g-4 bg-transparent z-10 transition-[0.3s] fixed ${
        isScrolled ? "bg-white" : "bg-transparent"
      }`}
    >
      <Link href={"/"}>
        <Image
          className="cursor-pointer"
          width={60}
          height={60}
          src="/technaija.svg"
          alt="logo"
        />
      </Link>
      <ul className="flex gap-10">
        {mainNavigation.map((navigation) => (
          <Link
            key={navigation.id}
            href={`${navigation.link}`}
            className="text-sm hover:text-red-400 hover:transition cursor-pointer"
          >
            {navigation.text}
          </Link>
        ))}
      </ul>
      <ul className="flex gap-4 items-center justify-center">
        {mainIconNavigation.map((icon) => (
          <Link key={icon.id} href={`${icon.link && icon.link}`}>
            <Image
              className="text-lg"
              width={20}
              height={20}
              src={`${icon.src}`}
              alt={`${icon.alt}`}
            />
          </Link>
        ))}
      </ul>
    </header>
  );
};

export default Navbar;
