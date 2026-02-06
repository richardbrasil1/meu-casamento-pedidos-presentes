import { motion } from "framer-motion";
import heroImage from "@/assets/hero-wedding.jpg";
import { WeddingInfo } from "@/types/wedding";

interface HeroSectionProps {
  info: WeddingInfo;
}

const HeroSection = ({ info }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Decoração floral de casamento"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 text-center px-6 max-w-2xl"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-body mb-4"
        >
          Lista de Presentes
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-display text-5xl md:text-7xl font-semibold text-foreground mb-4 leading-tight"
        >
          {info.couple}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="w-24 h-px gradient-gold mx-auto mb-4"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-lg font-body text-muted-foreground"
        >
          {info.date}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-base font-body text-muted-foreground mt-6 max-w-lg mx-auto leading-relaxed"
        >
          {info.message}
        </motion.p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
