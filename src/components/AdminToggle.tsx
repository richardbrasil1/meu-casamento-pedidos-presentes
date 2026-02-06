import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface AdminToggleProps {
  isAdmin: boolean;
  onLogin: (password: string) => boolean;
  onLogout: () => void;
}

const AdminToggle = ({ isAdmin, onLogin, onLogout }: AdminToggleProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (onLogin(password)) {
      setShowDialog(false);
      setPassword("");
      toast.success("Modo administrador ativado! ✨");
    } else {
      toast.error("Senha incorreta!");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <AnimatePresence mode="wait">
          {isAdmin ? (
            <motion.div
              key="admin"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2"
            >
              <span className="bg-card border border-gold/30 rounded-full px-4 py-2 text-xs font-body text-gold shadow-gold flex items-center gap-2">
                <Settings className="w-3 h-3 animate-spin" style={{ animationDuration: "3s" }} />
                Modo Admin
              </span>
              <Button
                size="icon"
                variant="outline"
                onClick={onLogout}
                className="rounded-full w-10 h-10 border-border"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div key="lock" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setShowDialog(true)}
                className="rounded-full w-10 h-10 border-border hover:border-gold hover:text-gold shadow-wedding"
              >
                <Lock className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="font-body">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Acesso Administrativo</DialogTitle>
            <DialogDescription>
              Digite a senha para gerenciar a lista de presentes.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="font-body"
          />
          <p className="text-xs text-muted-foreground">
            Dica: a senha padrão é <strong>casamento2026</strong>
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)} className="font-body">
              Cancelar
            </Button>
            <Button onClick={handleLogin} className="font-body bg-primary text-primary-foreground">
              Entrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminToggle;
