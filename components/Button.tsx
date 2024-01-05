import Link from "next/link";
import Image from "next/image";

type Props = {
  link: string;
  classname: string;
  text: string;
  icon?: string;
};

const Button = ({ link, classname, text, icon }: Props) => {
  return (
    <Link className={`w-fit ${classname}`} href={`/${link}`}>
      <button>{text}</button>
    </Link>
  );
};

export default Button;
