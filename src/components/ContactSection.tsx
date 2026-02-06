import { motion } from "framer-motion";
import { WeddingInfo } from "@/types/wedding";
import { Phone, Mail, MapPin, Key } from "lucide-react";

interface ContactSectionProps {
  info: WeddingInfo;
}

const ContactSection = ({ info }: ContactSectionProps) => {
  const contacts = [
    { icon: Phone, label: "Telefone", value: info.phone },
    { icon: Mail, label: "E-mail", value: info.email },
    { icon: MapPin, label: "Endereço", value: info.address },
  ];

  return (
    <section className="py-16 px-6 bg-blush/30">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Nosso Contato
          </h2>
          <p className="text-muted-foreground font-body">
            Entre em contato conosco para qualquer dúvida
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-card rounded-xl border border-border p-6 text-center shadow-wedding"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blush/50 mb-4">
                <contact.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-2">
                {contact.label}
              </h3>
              <p className="font-body text-sm text-foreground leading-relaxed">{contact.value}</p>
            </motion.div>
          ))}
        </div>

        {info.pixKey && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-card rounded-xl border border-gold/30 p-6 text-center shadow-gold"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full gradient-gold mb-4">
              <Key className="w-5 h-5 text-accent-foreground" />
            </div>
            <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-2">
              Chave Pix
            </h3>
            <p className="font-body text-foreground font-medium">{info.pixKey}</p>
            <p className="font-body text-xs text-muted-foreground mt-2">
              Para quem preferir presentear em dinheiro 💛
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
