import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiftItem } from "@/types/wedding";
import GiftCard from "./GiftCard";
import { Filter } from "lucide-react";

interface GiftListProps {
  gifts: GiftItem[];
  isAdmin: boolean;
  onTogglePurchased: (id: string, buyerName: string) => void;
  onRemove: (id: string) => void;
}

type FilterType = "all" | "available" | "purchased";

const GiftList = ({ gifts, isAdmin, onTogglePurchased, onRemove }: GiftListProps) => {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredGifts = gifts.filter((gift) => {
    if (filter === "available") return !gift.purchased;
    if (filter === "purchased") return gift.purchased;
    return true;
  });

  const totalGifts = gifts.length;
  const purchasedCount = gifts.filter((g) => g.purchased).length;
  const progress = totalGifts > 0 ? (purchasedCount / totalGifts) * 100 : 0;

  const filters: { label: string; value: FilterType }[] = [
    { label: "Todos", value: "all" },
    { label: "Disponíveis", value: "available" },
    { label: "Comprados", value: "purchased" },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Lista de Presentes
          </h2>
          <p className="text-muted-foreground font-body">
            Escolha um presente e faça parte deste momento especial
          </p>

          {/* Progress Bar */}
          <div className="mt-6 max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-muted-foreground font-body mb-2">
              <span>{purchasedCount} de {totalGifts} presentes</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full gradient-gold rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-body transition-all ${
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Gift Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredGifts.map((gift) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                isAdmin={isAdmin}
                onTogglePurchased={onTogglePurchased}
                onRemove={onRemove}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredGifts.length === 0 && (
          <p className="text-center text-muted-foreground font-body mt-10">
            Nenhum presente encontrado nesta categoria.
          </p>
        )}
      </div>
    </section>
  );
};

export default GiftList;
