import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/5569993630686"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Fale pelo WhatsApp"
    className="fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-secondary-foreground shadow-lg transition-transform hover:scale-110 hover:bg-[#1ebe57] bottom-[max(1rem,env(safe-area-inset-bottom,0px)+0.5rem)] right-[max(1rem,env(safe-area-inset-right,0px)+0.5rem)] sm:bottom-6 sm:right-6"
  >
    <MessageCircle size={28} />
  </a>
);

export default WhatsAppButton;
