import { Instagram, MapPin, MessageCircle } from "lucide-react";

const STUDIO_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Av. Amazonas, 8787, Bairro Pantanal");

const Footer = () => (
  <footer className="border-t border-gold/10 bg-dark py-10 pb-[max(5rem,env(safe-area-inset-bottom,0px)+3.5rem)] sm:py-12 sm:pb-12">
    <div className="container mx-auto px-4 sm:px-6 text-center">
      <p className="font-display text-xl sm:text-2xl text-gold mb-4 sm:mb-6">
        Perez <span className="font-light text-secondary-foreground">NailDesigner</span>
      </p>
      <address className="font-body text-sm sm:text-base not-italic max-w-md mx-auto mb-6 sm:mb-8">
        <a
          href={STUDIO_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center sm:flex-row sm:items-start sm:justify-center gap-2 sm:gap-3 text-center text-white hover:text-white transition-colors"
          aria-label="Abrir endereço no Google Maps"
        >
          <MapPin
            className="w-5 h-5 text-white shrink-0 sm:mt-0.5"
            aria-hidden
          />
          <span>
            <span className="block text-white underline-offset-2 group-hover:underline">
              Av. Amazonas, Nº 8787
            </span>
            <span className="block text-white underline-offset-2 group-hover:underline">
              Bairro Pantanal
            </span>
          </span>
        </a>
      </address>
      <div className="flex justify-center gap-6 mb-6 sm:mb-8">
        <a
          href="https://instagram.com/pereznaildesigner"
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary-foreground/60 hover:text-gold transition-colors"
          aria-label="Instagram"
        >
          <Instagram size={22} />
        </a>
      </div>
      <p className="font-body text-xs text-muted-foreground tracking-wider">
        © {new Date().getFullYear()} Perez NailDesigner. Todos os direitos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
