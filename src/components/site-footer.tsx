import { TransitionLink } from "@/components/page-transition";
import { footerColumns } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="bg-black px-6 pb-7 pt-14 text-white">
      <div className="grid grid-cols-2 gap-8 text-[15px] md:grid-cols-4">
        {footerColumns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="flex flex-col gap-2.5">
            <span className="font-medium">{column.title}</span>
            {column.links.map((link) => {
              // Other sites open in a new tab so the visitor keeps their place here.
              const external = link.href.startsWith("http");
              return (
                <TransitionLink
                  key={link.label}
                  href={link.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="text-[#bdbdbd] hover:text-white"
                >
                  {link.label}
                </TransitionLink>
              );
            })}
          </nav>
        ))}
      </div>
      <div className="mt-14 flex flex-wrap justify-between gap-3 border-t border-[#262626] pt-5 text-sm text-soft">
        <span>© 2026 React Cebu, a JavaScript Cebu community</span>
        <span>Sample photos from Unsplash</span>
      </div>
    </footer>
  );
}
