import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface InstallPromptProps {
  deferredPrompt: any;
  onInstall: () => void;
}

export const InstallPrompt = ({
  deferredPrompt,
  onInstall,
}: InstallPromptProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (deferredPrompt) {
      setIsVisible(true);
    }
  }, [deferredPrompt]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg p-6 z-50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#FFD400] rounded-xl flex items-center justify-center">
                <img
                  src="/icons/icon-192x192.png"
                  alt="Lumore"
                  className="w-12 h-12"
                />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">
                  Install Lumore
                </h3>
                <p className="text-sm text-gray-500">Get the best experience</p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-start space-x-4 mb-6 overflow-x-auto pb-2">
            <div className="flex-shrink-0 w-48">
              <img
                src="/assets/1.png"
                alt="Home Screen"
                className="w-full h-80 object-cover rounded-lg shadow-md"
              />
              <p className="text-sm text-gray-600 mt-2">Explore new people</p>
            </div>
            <div className="flex-shrink-0 w-48">
              <img
                src="/assets/2.png"
                alt="Chat Screen"
                className="w-full h-80 object-cover rounded-lg shadow-md"
              />
              <p className="text-sm text-gray-600 mt-2">Saved Chats</p>
            </div>
            <div className="flex-shrink-0 w-48">
              <img
                src="/assets/3.png"
                alt="Profile Screen"
                className="w-full h-80 object-cover rounded-lg shadow-md"
              />
              <p className="text-sm text-gray-600 mt-2">Personal Profile</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onInstall}
              className="flex-1 bg-ui-primary text-ui-shade py-3 px-6 rounded-xl font-semibold hover:bg-ui-primary/90 transition-colors"
            >
              Install Now
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
