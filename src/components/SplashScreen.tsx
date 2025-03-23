import { motion } from "framer-motion";

export const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#F1E9DA] flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-32 h-32 mx-auto mb-8"
        >
          <div className="absolute inset-0 bg-[#FFD400] rounded-full animate-pulse" />
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border-4 border-white rounded-full"
          />
          <div className="absolute inset-4 flex items-center justify-center">
            <span className="text-4xl font-bold text-[#FFD400]">L</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          Lumore
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600"
        >
          Connecting you with like-minded people
        </motion.p>
      </div>
    </div>
  );
};
