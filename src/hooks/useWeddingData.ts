import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GiftItem, WeddingInfo } from "@/types/wedding";

const DEFAULT_INFO: WeddingInfo = {
  couple: "Caroline & Richard",
  date: "07 de Março de 2026",
  message: "Estamos muito felizes em compartilhar esse momento com vocês! Aqui está nossa lista de presentes para nos ajudar a começar essa nova etapa juntos. 💕",
  phone: "(11) 99999-9999",
  email: "caroline.richard@email.com",
  address: "Rua das Flores, 123 - São Paulo, SP",
  pixKey: "caroline.richard@email.com",
};

export function useWeddingData() {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [info, setInfo] = useState<WeddingInfo>(DEFAULT_INFO);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          // Check admin role
          const { data } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "admin");
          setIsAdmin(!!data && data.length > 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Check current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin");
        setIsAdmin(!!data && data.length > 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch wedding info
  useEffect(() => {
    const fetchInfo = async () => {
      const { data } = await supabase
        .from("wedding_info")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (data) {
        setInfo({
          couple: data.couple,
          date: data.date,
          message: data.message,
          phone: data.phone,
          email: data.email,
          address: data.address,
          pixKey: data.pix_key || undefined,
        });
      }
    };
    fetchInfo();
  }, []);

  // Fetch gifts
  const fetchGifts = useCallback(async () => {
    const { data } = await supabase
      .from("gifts")
      .select("*")
      .order("created_at", { ascending: true });

    if (data) {
      setGifts(
        data.map((g) => ({
          id: g.id,
          name: g.name,
          description: g.description || undefined,
          price: g.price ? Number(g.price) : undefined,
          link: g.link || undefined,
          image: g.image || undefined,
          purchased: g.purchased,
          purchasedBy: g.purchased_by || undefined,
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGifts();
  }, [fetchGifts]);

  // Realtime subscription for gifts
  useEffect(() => {
    const channel = supabase
      .channel("gifts-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "gifts" },
        () => {
          fetchGifts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchGifts]);

  const addGift = async (gift: Omit<GiftItem, "id" | "purchased">) => {
    const { error } = await supabase.from("gifts").insert({
      name: gift.name,
      description: gift.description || null,
      price: gift.price || null,
      link: gift.link || null,
      image: gift.image || null,
    });
    if (error) {
      console.error("Error adding gift:", error);
      throw error;
    }
  };

  const removeGift = async (id: string) => {
    const { error } = await supabase.from("gifts").delete().eq("id", id);
    if (error) {
      console.error("Error removing gift:", error);
      throw error;
    }
  };

  const togglePurchased = async (id: string, buyerName: string) => {
    const gift = gifts.find((g) => g.id === id);
    if (!gift) return;

    const { error } = await supabase
      .from("gifts")
      .update({
        purchased: !gift.purchased,
        purchased_by: gift.purchased ? null : buyerName,
      })
      .eq("id", id);

    if (error) {
      console.error("Error toggling purchase:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return !error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return {
    gifts,
    info,
    isAdmin,
    loading,
    addGift,
    removeGift,
    togglePurchased,
    login,
    logout,
  };
}
