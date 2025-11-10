import { FileText, Truck, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: FileText,
    number: "01",
    title: "Isi Form Pengiriman",
    description: "Masukkan data pengirim, penerima, dan detail paket Anda dengan mudah"
  },
  {
    icon: Truck,
    number: "02",
    title: "Pilih Kurir & Layanan",
    description: "Sistem akan menampilkan pilihan kurir dengan harga dan estimasi waktu"
  },
  {
    icon: CreditCard,
    number: "03",
    title: "Selesaikan Pembayaran",
    description: "Dapatkan kode unik, Lakukan pembayaran, dan paket anda siap di kirim"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    }
  }
};

const stepVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      delay: 0.2,
      type: "spring",
      stiffness: 200
    }
  }
};

export default function HowItWorks() {
  return (
    <motion.section
      className="py-16 md:py-20 bg-card/30"
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
            Cara Kerja SimpanAja
          </h2>
          <p className="text-lg text-muted-foreground">
            Hanya 3 langkah mudah untuk mengirim paket Anda
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className="relative"
              variants={stepVariants}
              data-testid={`step-${idx}`}
            >
              {idx < steps.length - 1 && (
                <motion.div
                  className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-border"
                  style={{ transform: 'translateX(50%)' }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 + idx * 0.2 }}
                />
              )}

              <motion.div
                className="relative bg-card border border-card-border rounded-xl p-6 text-center hover-elevate"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="inline-flex w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4 relative z-10"
                  variants={iconVariants}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <step.icon className="w-8 h-8 text-primary" />
                </motion.div>

                <motion.div
                  className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + idx * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  {step.number}
                </motion.div>

                <motion.h3
                  className="text-xl font-semibold text-foreground mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
                >
                  {step.title}
                </motion.h3>
                <motion.p
                  className="text-sm text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 + idx * 0.1 }}
                >
                  {step.description}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
