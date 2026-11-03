import Link from "next/link";
import { footerColumns } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="bg-black px-6 pb-7 pt-14 text-white">
      <div className="grid grid-cols-2 gap-8 text-[15px] md:grid-cols-5">
        {footerColumns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="flex flex-col gap-2.5">
            <span className="font-medium">{column.title}</span>
            {column.links.map((link) => (
              <Link key={link.label} href={link.href} className="text-[#bdbdbd] hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <div className="mt-14 flex flex-wrap justify-between gap-3 border-t border-[#262626] pt-5 text-sm text-soft">
        <span>sunt culpa qui officia deserunt mollit anim id</span>
        <span>Est laborum lorem ipsum</span>
      </div>
    </footer>
  );
}
