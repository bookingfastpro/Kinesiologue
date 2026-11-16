import { createContext, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ExternalLink } from "lucide-react";
import { SITE } from "../site";
import { useDialog } from "./ui";

const BookingContext = createContext<{ open: () => void }>({ open: () => {} });
export const useBooking = () => useContext(BookingContext);

const BookingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const ref = useDialog(isOpen, onClose);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col"
        >
          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b border-sand/50 bg-nude-50">
            <h2 id="booking-title" className="font-serif text-xl sm:text-2xl text-deep-brown">
              Prendre rendez-vous
            </h2>
            <div className="flex items-center gap-2">
              <a
                href={SITE.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-deep-brown/80 hover:text-deep-brown px-3 py-2 rounded-full"
              >
                Ouvrir dans un nouvel onglet <ExternalLink size={14} aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={onClose}
                data-autofocus
                aria-label="Fermer la réservation"
                className="w-12 h-12 bg-deep-brown text-nude-50 rounded-full hover:scale-105 transition-transform shadow-lg flex items-center justify-center"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>
          </div>
          <iframe
            src={SITE.bookingUrl}
            className="w-full flex-1 border-none"
            title="Module de réservation en ligne des séances de kinésiologie"
            loading="lazy"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <BookingContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <BookingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </BookingContext.Provider>
  );
};
