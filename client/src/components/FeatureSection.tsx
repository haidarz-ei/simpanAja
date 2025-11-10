import { Clock, CreditCard, Users, BarChart3, MessageCircle, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: Clock,
    title: "Akses 24/7",
    description: "Kirim paket kapan saja tanpa perlu menunggu jam operasional admin."
  },
  {
    icon: CreditCard,
    title: "Hitung Ongkir Otomatis",
    description: "Sistem menghitung tarif pengiriman secara real-time dari berbagai kurir."
  },
  {
    icon: Package,
    title: "Multi Kurir",
    description: "Pilih dari berbagai pilihan kurir seperti JNE, JNT, SiCepat, dan lainnya."
  },
  {
    icon: BarChart3,
    title: "Dashboard Admin",
    description: "Admin dapat memantau semua pengiriman dalam satu dashboard terpusat."
  },
  {
    icon: MessageCircle,
    title: "Bantuan Interaktif",
    description: "Panduan otomatis membantu pengguna baru dalam proses pengiriman."
  },
  {
    icon: Users,
    title: "Privasi Terjaga",
    description: "Proses mandiri menjaga privasi tanpa interaksi langsung."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function FeatureSection() {
  return (
    <motion.section
      className="py-16 md:py-20 bg-background"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Kenapa Memilih SimpanAja?
          </h2>
          <p className="text-lg text-muted-foreground">
            Solusi lengkap untuk kebutuhan pengiriman Anda dengan kemudahan akses
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6 hover-elevate h-full" data-testid={`card-feature-${idx}`}>
                <motion.div
                  className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <feature.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
