import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GiftItem } from "@/types/wedding";
import { toast } from "sonner";

interface AddGiftFormProps {
  onAdd: (gift: Omit<GiftItem, "id" | "purchased">) => void;
}

const AddGiftForm = ({ onAdd }: AddGiftFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Informe o nome do presente!");
      return;
    }

    onAdd({
      name: name.trim(),
      description: description.trim() || undefined,
      price: price ? parseFloat(price) : undefined,
      link: link.trim() || undefined,
    });

    setName("");
    setDescription("");
    setPrice("");
    setLink("");
    setIsOpen(false);
    toast.success("Presente adicionado! 🎁");
  };

  return (
    <div className="mb-8">
      {!isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="gap-2 bg-gold hover:bg-gold/90 text-accent-foreground font-body shadow-gold"
          >
            <Plus className="w-4 h-4" />
            Adicionar Presente
          </Button>
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-card border border-border rounded-xl p-6 shadow-wedding"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-medium">Novo Presente</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <Input
              placeholder="Nome do presente *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-body"
            />
            <Textarea
              placeholder="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="font-body resize-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Preço (R$)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                className="font-body"
              />
              <Input
                placeholder="Link do produto"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="font-body"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 font-body"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground font-body">
              Adicionar
            </Button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default AddGiftForm;
