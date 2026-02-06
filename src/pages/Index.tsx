import { useWeddingData } from "@/hooks/useWeddingData";
import HeroSection from "@/components/HeroSection";
import GiftList from "@/components/GiftList";
import AddGiftForm from "@/components/AddGiftForm";
import ContactSection from "@/components/ContactSection";
import AdminToggle from "@/components/AdminToggle";
import { Heart } from "lucide-react";

const Index = () => {
  const {
    gifts,
    info,
    isAdmin,
    addGift,
    removeGift,
    togglePurchased,
    login,
    logout,
  } = useWeddingData();

  return (
    <div className="min-h-screen bg-background">
      <HeroSection info={info} />

      <div className="relative">
        {isAdmin && (
          <div className="pt-10 px-6">
            <AddGiftForm onAdd={addGift} />
          </div>
        )}

        <GiftList
          gifts={gifts}
          isAdmin={isAdmin}
          onTogglePurchased={togglePurchased}
          onRemove={removeGift}
        />
      </div>

      <ContactSection info={info} />

      {/* Footer */}
      <footer className="py-8 text-center bg-background border-t border-border">
        <p className="font-body text-sm text-muted-foreground flex items-center justify-center gap-1">
          Feito com <Heart className="w-3 h-3 text-primary fill-primary" /> para {info.couple}
        </p>
      </footer>

      <AdminToggle isAdmin={isAdmin} onLogin={login} onLogout={logout} />
    </div>
  );
};

export default Index;
