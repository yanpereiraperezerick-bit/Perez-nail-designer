import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section
    id="home"
    className="relative flex min-h-screen items-center justify-center overflow-hidden"
  >
    <img
      src={heroBg}
      alt="Perez NailDesigner studio"
      className="absolute inset-0 w-full h-full object-cover"
      width={1920}
      height={1080}
    />
    <div className="absolute inset-0 bg-dark/70" />

    <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center sm:px-6">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-body text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gold mb-3 sm:mb-4"
      >
        Estúdio Premium
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-secondary-foreground mb-4 sm:mb-6"
      >
        Perez <span className="italic text-gold">NailDesigner</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mx-auto mb-8 max-w-md px-1 font-body text-base text-secondary-foreground/70 sm:mb-10 sm:max-w-lg sm:text-lg md:max-w-xl"
      >
        Elegância e sofisticação em cada detalhe
      </motion.p>
      <motion.a
        href="#agendamento"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="inline-flex min-h-[48px] items-center justify-center border-2 border-gold px-8 py-3 font-body text-xs uppercase tracking-[0.2em] text-gold transition-all duration-500 hover:bg-gold hover:text-dark sm:px-10 sm:py-4 sm:text-sm"
      >
        Agendar Agora
      </motion.a>
    </div>
  </section>
);

export default HeroSection;
