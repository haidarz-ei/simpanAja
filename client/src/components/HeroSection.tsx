import { Package, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <motion.div
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />

      {/* Animated floating packages background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ top: '-10%', bottom: '-10%' }}>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${10 + Math.random() * 70}%`,
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              rotate: Math.random() * 45,
            }}
            transition={{
              delay: i * 0.1,
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 15 + i * 2,
            }}
          >
            <Package
              className="text-primary"
              size={40 + Math.random() * 40}
            />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="inline-block"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                Layanan 24/7 Tanpa Henti
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Kirim Paket{" "}
              <span className="text-primary">Anti Gabut</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              SimpanAja adalah solusi pengiriman mandiri yang cepat, mudah, dimana saja dan kapan saja
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-16 py-6 text-xl"
                  data-testid="button-start-shipping"
                  onClick={() => window.location.href = '/packages'}
                >
                  <b>Kirim Paket Sekarang</b>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="flex justify-center items-center gap-6 pt-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {[
            { icon: Package, text: "Multi Kurir" },
            { icon: Clock, text: "Real-time Tracking" },
            { icon: Shield, text: "Aman & Terpercaya" }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <item.icon className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
