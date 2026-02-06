import { useState } from "react";
import { motion } from "framer-motion";
import { GiftItem } from "@/types/wedding";
import { Gift, Check, ShoppingBag, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface GiftCardProps {
  gift: GiftItem;
  isAdmin: boolean;
  onTogglePurchased: (id: string, buyerName: string) => void;
  onRemove: (id: string) => void;
}

const GiftCard = ({ gift, isAdmin, onTogglePurchased, onRemove }: GiftCardProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [buyerName, setBuyerName] = useState("");

  const handlePurchase = () => {
    if (!buyerName.trim()) {
      toast.error("Por favor, informe seu nome!");
      return;
    }
    onTogglePurchased(gift.id, buyerName.trim());
    setShowDialog(false);
    setBuyerName("");
    toast.success(`Obrigado, ${buyerName}! 🎁`);
  };

  const handleUndoPurchase = () => {
    onTogglePurchased(gift.id, "");
    toast.info("Compra desmarcada.");
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`group relative rounded-xl border p-6 transition-all duration-300 ${
          gift.purchased
            ? "bg-muted/50 border-border opacity-75"
            : "bg-card border-border hover:shadow-wedding hover:border-primary/30"
        }`}
      >
        {gift.purchased && (
          <div className="absolute top-3 right-3 bg-sage/20 rounded-full p-1.5">
            <Check className="w-4 h-4 text-sage" />
          </div>
        )}

        {isAdmin && (
          <button
            onClick={() => onRemove(gift.id)}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-start gap-4">
          <div className={`rounded-lg p-3 ${gift.purchased ? "bg-muted" : "bg-blush/50"}`}>
            <Gift className={`w-5 h-5 ${gift.purchased ? "text-muted-foreground" : "text-gold"}`} />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-display text-lg font-medium ${
                gift.purchased ? "line-through text-muted-foreground" : "text-card-foreground"
              }`}
            >
              {gift.name}
            </h3>

            {gift.description && (
              <p className="text-sm text-muted-foreground mt-1 font-body">{gift.description}</p>
            )}

            <div className="flex items-center gap-3 mt-3">
              {gift.price && (
                <span className="text-sm font-semibold text-gold font-body">
                  R$ {gift.price.toFixed(2)}
                </span>
              )}

              {gift.link && (
                <a
                  href={gift.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 font-body"
                >
                  <ExternalLink className="w-3 h-3" />
                  Ver produto
                </a>
              )}
            </div>

            {gift.purchased && gift.purchasedBy && (
              <p className="text-xs text-sage mt-2 font-body italic">
                Comprado por {gift.purchasedBy} ✓
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          {gift.purchased ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndoPurchase}
              className="w-full text-muted-foreground hover:text-foreground font-body text-xs"
            >
              Desmarcar compra
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowDialog(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Vou presentear!
            </Button>
          )}
        </div>
      </motion.div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="font-body">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Presentear: {gift.name}</DialogTitle>
            <DialogDescription>
              Informe seu nome para registrar que você vai presentear com este item.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Seu nome"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePurchase()}
            className="font-body"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)} className="font-body">
              Cancelar
            </Button>
            <Button onClick={handlePurchase} className="font-body bg-primary text-primary-foreground">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GiftCard;
