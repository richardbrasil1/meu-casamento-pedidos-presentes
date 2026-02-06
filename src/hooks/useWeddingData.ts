import { useState, useEffect } from "react";
import { GiftItem, WeddingInfo } from "@/types/wedding";

const DEFAULT_INFO: WeddingInfo = {
  couple: "Ana & João",
  date: "15 de Março de 2026",
  message: "Estamos muito felizes em compartilhar esse momento com vocês! Aqui está nossa lista de presentes para nos ajudar a começar essa nova etapa juntos. 💕",
  phone: "(11) 99999-9999",
  email: "ana.joao@email.com",
  address: "Rua das Flores, 123 - São Paulo, SP",
  pixKey: "ana.joao@email.com",
};

const DEFAULT_GIFTS: GiftItem[] = [
  {
    id: "1",
    name: "Jogo de Panelas",
    description: "Jogo de panelas antiaderente com 5 peças",
    price: 350,
    purchased: false,
  },
  {
    id: "2",
    name: "Jogo de Cama Queen",
    description: "Jogo de cama 400 fios, algodão egípcio",
    price: 280,
    purchased: false,
  },
  {
    id: "3",
    name: "Cafeteira Elétrica",
    description: "Cafeteira programável com jarra térmica",
    price: 450,
    purchased: false,
  },
  {
    id: "4",
    name: "Aspirador Robô",
    description: "Aspirador robô com mapeamento inteligente",
    price: 1200,
    purchased: false,
  },
  {
    id: "5",
    name: "Jogo de Toalhas",
    description: "Kit com 8 toalhas de banho e rosto",
    price: 180,
    purchased: false,
  },
  {
    id: "6",
    name: "Air Fryer",
    description: "Fritadeira elétrica 5 litros digital",
    price: 550,
    purchased: false,
  },
];

export function useWeddingData() {
  const [gifts, setGifts] = useState<GiftItem[]>(() => {
    const saved = localStorage.getItem("wedding-gifts");
    return saved ? JSON.parse(saved) : DEFAULT_GIFTS;
  });

  const [info, setInfo] = useState<WeddingInfo>(() => {
    const saved = localStorage.getItem("wedding-info");
    return saved ? JSON.parse(saved) : DEFAULT_INFO;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("wedding-admin") === "true";
  });

  useEffect(() => {
    localStorage.setItem("wedding-gifts", JSON.stringify(gifts));
  }, [gifts]);

  useEffect(() => {
    localStorage.setItem("wedding-info", JSON.stringify(info));
  }, [info]);

  const addGift = (gift: Omit<GiftItem, "id" | "purchased">) => {
    const newGift: GiftItem = {
      ...gift,
      id: Date.now().toString(),
      purchased: false,
    };
    setGifts((prev) => [...prev, newGift]);
  };

  const removeGift = (id: string) => {
    setGifts((prev) => prev.filter((g) => g.id !== id));
  };

  const togglePurchased = (id: string, buyerName: string) => {
    setGifts((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, purchased: !g.purchased, purchasedBy: g.purchased ? undefined : buyerName }
          : g
      )
    );
  };

  const updateInfo = (newInfo: Partial<WeddingInfo>) => {
    setInfo((prev) => ({ ...prev, ...newInfo }));
  };

  const login = (password: string): boolean => {
    if (password === "casamento2026") {
      setIsAdmin(true);
      localStorage.setItem("wedding-admin", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("wedding-admin");
  };

  return {
    gifts,
    info,
    isAdmin,
    addGift,
    removeGift,
    togglePurchased,
    updateInfo,
    login,
    logout,
  };
}
