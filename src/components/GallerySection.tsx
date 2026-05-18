import { motion } from "framer-motion";

type GalleryItem = {
  src: string;
  alt: string;
  label: string;
  type: "image" | "video";
};

const labelMap: Record<string, string> = {
  "gallery-brown-gold.jpg": "Brown & Gold",
  "gallery-francesinha.jpg": "Francesinha",
  "gallery-perolada.jpg": "Perolada",
  "gallery-red-nailart.jpg": "Red Nail Art",
};

const galleryImports = import.meta.glob(
  "../assets/gallery/*.{jpg,jpeg,png,webp,mp4,webm}",
  { eager: true }
) as Record<string, { default: string }>;

const normalizeLabel = (fileName: string) => {
  const base = fileName.replace(/\.(jpg|jpeg|png|webp|mp4|webm)$/i, "");
  return labelMap[fileName] ??
    base
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
};

const images: GalleryItem[] = Object.entries(galleryImports)
  .map(([path, mod]) => {
    const fileName = path.split("/").pop() ?? path;
    const type = /\.(mp4|webm)$/i.test(fileName) ? "video" : "image";
    return {
      src: mod.default,
      alt: `Galeria ${normalizeLabel(fileName)}`,
      label: normalizeLabel(fileName),
      type,
    };
  })
  .filter((item, index, array) => array.findIndex((candidate) => candidate.label === item.label) === index)
  .sort((a, b) => a.label.localeCompare(b.label));

const GallerySection = () => (
  <section id="galeria" className="py-16 md:py-32 bg-background">
    <div className="container mx-auto max-w-7xl px-4 sm:px-6">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-display text-3xl sm:text-4xl md:text-5xl text-center mb-4"
      >
        <span className="text-gold italic">Galeria</span>
      </motion.h2>
      <div className="w-16 h-px bg-gold mx-auto mb-10 md:mb-16" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {images.map((img, i) => (
          <motion.div
            key={img.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden aspect-[3/4] sm:aspect-square rounded-sm"
          >
            {img.type === "image" ? (
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                width={800}
                height={800}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <video
                src={img.src}
                controls
                muted
                loop
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            )}
            <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/50 transition-all duration-500 flex items-center justify-center">
              <span className="font-display text-sm sm:text-lg text-secondary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {img.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 md:mt-16 text-center"
      >
        <p className="font-body text-sm sm:text-base text-muted-foreground mb-4">
          Quer ver mais opções de designs e inspirações?
        </p>
        <a
          href="https://instagram.com/pereznaildesigner"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-display text-gold hover:text-gold/80 transition-colors duration-300 text-lg"
        >
          <span>Siga @pereznaildesigner no Instagram</span>
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
      </motion.div>
    </div>
  </section>
);

export default GallerySection;
