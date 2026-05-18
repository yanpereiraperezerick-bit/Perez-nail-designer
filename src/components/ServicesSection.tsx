import { motion } from "framer-motion";

const services = [
  { name: "Aplicação natural (incluso cutilagem e esmaltação)", price: "R$ 100,00" },
  { name: "Aplicação encapsulada (variando conforme decoração)", price: "R$ 120,00" },
  { name: "Manutenção natural", price: "R$ 80,00" },
  { name: "Manutenção esmaltada", price: "R$ 90,00" },
  { name: "Manutenção encapsulada (variando conforme decoração)", price: "R$ 100,00" },
  { name: "Blindagem (incluso cutilagem e esmaltação)", price: "R$ 80,00" },
  { name: "Reposição de unha na manutenção", price: "R$ 5,00" },
  { name: "Reposição de unha fora da manutenção", price: "R$ 10,00" },
  { name: "Remoção total", price: "R$ 35,00" },
  { name: "Troca de formato", price: "R$ 15,00" },
  { name: "Decoração", price: "Consultar" },
];

const ServicesSection = () => (
  <section id="servicos" className="py-16 md:py-32 bg-dark">
    <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-display text-3xl sm:text-4xl md:text-5xl text-center text-secondary-foreground mb-4"
      >
        Serviços & <span className="text-gold italic">Preços</span>
      </motion.h2>
      <div className="w-16 h-px bg-gold mx-auto mb-10 md:mb-16" />

      <div className="space-y-4 md:space-y-5">
        {services.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-0"
          >
            <span className="min-w-0 break-words font-body text-sm text-secondary-foreground/90 md:text-base sm:shrink">
              {s.name}
            </span>
            <span className="dotted-line hidden sm:block" />
            <span className="shrink-0 font-display text-base text-gold sm:text-lg">
              {s.price}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
