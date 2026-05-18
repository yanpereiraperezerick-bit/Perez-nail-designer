import { motion } from "framer-motion";

const items = [
  {
    title: "Missão",
    text: "Realçar a beleza e autoestima de cada cliente através de técnicas avançadas em nail design, proporcionando uma experiência única de cuidado e sofisticação.",
  },
  {
    title: "Visão",
    text: "Ser referência em nail design premium, reconhecida pela excelência, inovação e atendimento personalizado que transforma cada visita em um momento especial.",
  },
  {
    title: "Valores",
    text: "Higiene impecável, atendimento personalizado, qualidade nos materiais, educação contínua e compromisso com a satisfação total de cada cliente.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

const AboutSection = () => (
  <section id="sobre" className="py-16 md:py-32 bg-background">
    <div className="container mx-auto max-w-7xl px-4 sm:px-6">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-display text-3xl sm:text-4xl md:text-5xl text-center mb-4"
      >
        Sobre <span className="text-gold italic">Nós</span>
      </motion.h2>
      <div className="w-16 h-px bg-gold mx-auto mb-10 md:mb-16" />

      <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-12">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center"
          >
            <h3 className="font-display text-xl sm:text-2xl text-gold mb-3 sm:mb-4">{item.title}</h3>
            <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
