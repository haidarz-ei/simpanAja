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
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />

      {/* Floating packages */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary"
            style={{
              left: `${10 + i * 12}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + i,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Package size={40 + i * 10} />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* KIRI: Teks */}
          <motion.div className="order-2 lg:order-1 space-y-6">
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              Layanan 24/7 Tanpa Henti
            </motion.span>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Mau Cepat? <span className="text-primary">Ya, SimpanAja!</span>
            </motion.h1>

            {/* GAMBAR KHUSUS MOBILE */}
            <div className="block lg:hidden my-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-center"
              >
                <img
                  src="/source/img/maskot4.png"
                  alt="Maskot SimpanAja"
                  className="w-64 sm:w-80 h-auto object-contain drop-shadow-xl"
                />
              </motion.div>
            </div>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Solusi pengiriman mandiri yang cepat, mudah, dimana saja dan kapan saja
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Button
                size="lg"
                className="w-full sm:w-auto px-16 py-7 text-xl font-bold"
                onClick={() => window.location.href = "/packages"}
              >
                Kirim Paket Sekarang
              </Button>
            </motion.div>
          </motion.div>

          {/* KANAN: Gambar hanya di desktop */}
          <motion.div
            className="hidden lg:flex justify-center order-1 lg:order-2"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: -50, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <img
              src="/source/img/maskot4.png"
              alt="Maskot SimpanAja"
              className="w-full max-w-2xl h-auto object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Feature badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mt-16"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {[
            { icon: Package, label: "Multi Kurir" },
            { icon: Clock, label: "Real-time Tracking" },
            { icon: Shield, label: "Aman & Terpercaya" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <item.icon className="w-8 h-8 text-primary" />
              <span className="text-muted-foreground font-medium">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}