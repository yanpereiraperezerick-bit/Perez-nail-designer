import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#galeria", label: "Galeria" },
  { href: "#agendamento", label: "Agendar" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-all duration-500 ${
        scrolled ? "bg-dark/95 py-3 shadow-lg backdrop-blur-md" : "bg-transparent py-5 sm:py-6"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6">
        <a
          href="#home"
          className="min-w-0 font-display text-lg tracking-wide text-gold sm:text-xl md:text-2xl md:tracking-wider"
        >
          Perez <span className="font-light text-secondary-foreground">NailDesigner</span>
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex md:items-center md:gap-6 lg:gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-xs font-body uppercase tracking-[0.15em] text-secondary-foreground/80 transition-colors duration-300 hover:text-gold lg:text-sm lg:tracking-[0.2em]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="-mr-2 min-h-[44px] min-w-[44px] p-2 text-secondary-foreground md:hidden"
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X size={24} strokeWidth={1.75} /> : <Menu size={24} strokeWidth={1.75} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="max-h-[min(70vh,calc(100dvh-5rem))] overflow-y-auto border-t border-gold/20 bg-dark/95 backdrop-blur-md md:hidden">
          <ul className="flex flex-col items-center gap-4 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block min-h-[44px] py-2 text-center text-sm font-body uppercase tracking-[0.2em] text-secondary-foreground/80 transition-colors hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
