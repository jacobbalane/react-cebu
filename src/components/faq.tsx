export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="border-t border-black">
      {items.map((item) => (
        <details key={item.q} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[26px] tracking-[-0.025em] [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              aria-hidden="true"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-fog text-2xl transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mb-5 max-w-[60ch] text-lg leading-normal text-[#4d4d4d]">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
