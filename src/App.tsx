/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import About from "./pages/About";
import Blog from "./pages/Blog";
import { 
  Leaf, 
  MapPin, 
  Phone, 
  Calendar, 
  User, 
  Baby, 
  Heart, 
  Sparkles, 
  Instagram, 
  Search, 
  MessageCircle,
  ChevronRight,
  Menu,
  X,
  Quote,
  ArrowRight,
  ArrowUpRight
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
};

const Navbar = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: "Présentation", path: "/#presentation" },
    { name: "À Propos", path: "/a-propos" },
    { name: "Le Journal", path: "/blog" },
    { name: "Prestations", path: "/#prestations" },
    { name: "Bénéfices", path: "/#bénéfices" },
    { name: "Contact", path: "/#contact" }
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 border-none ${
          isScrolled ? "py-4 glass" : "py-8 bg-transparent"
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 flex justify-between items-center">
          <Link to="/" className="group">
            <div className="flex flex-col">
              <span className="font-serif text-3xl tracking-tighter text-deep-brown group-hover:italic transition-all duration-500">Inès Mallaroni</span>
              <span className="micro-label !mb-0 !text-[8px]">Kinésiologue • Porto-Vecchio</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-12">
            {navItems.map((item) => (
              item.path.startsWith("/#") ? (
                <a 
                  key={item.name} 
                  href={item.path}
                  className="text-[11px] uppercase tracking-[0.3em] text-deep-brown/60 hover:text-deep-brown transition-all duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-deep-brown transition-all duration-500 group-hover:w-full"></span>
                </a>
              ) : (
                <Link 
                  key={item.name} 
                  to={item.path}
                  className="text-[11px] uppercase tracking-[0.3em] text-deep-brown/60 hover:text-deep-brown transition-all duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-deep-brown transition-all duration-500 group-hover:w-full"></span>
                </Link>
              )
            ))}
            <button onClick={onOpenBooking} className="btn-luxury">
              Réserver
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-deep-brown p-2 rounded-full hover:bg-deep-brown/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white lg:hidden flex flex-col p-12"
          >
            <div className="flex justify-between items-center mb-20">
              <span className="font-serif text-2xl">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-deep-brown/5 transition-colors"><X size={32} /></button>
            </div>
            <div className="flex flex-col space-y-8">
              {navItems.map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={item.name}
                >
                  {item.path.startsWith("/#") ? (
                    <a 
                      href={item.path}
                      className="text-5xl font-serif text-deep-brown"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link 
                      to={item.path}
                      className="text-5xl font-serif text-deep-brown"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </motion.div>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="btn-luxury w-full text-2xl py-6 mt-4"
              >
                Réserver
              </motion.button>
            </div>
            <div className="mt-auto pt-12 border-t border-sand/30">
              <p className="micro-label">Porto-Vecchio, Corse</p>
              <p className="text-xl font-serif">06 83 57 17 84</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="home" className="relative h-[110vh] flex items-center overflow-hidden bg-nude-100">
      <div className="max-w-[1800px] mx-auto px-8 md:px-16 w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="micro-label">Kinésiologie & Bien-être</span>
            <h1 className="section-title">
              Retrouvez votre <br />
              <span className="italic text-terracotta">équilibre</span> intérieur <br />
              en Corse-du-Sud
            </h1>
            <p className="text-xl md:text-2xl text-deep-brown/70 mb-12 max-w-xl font-light leading-relaxed">
              Je vous accompagne afin de libérer vos blocages et retrouver votre équilibre.
            </p>
            <div className="flex flex-wrap gap-8 items-center">
              <button onClick={onOpenBooking} className="btn-luxury group flex items-center gap-4">
                Prendre rendez-vous
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              <a href="#presentation" className="text-[11px] uppercase tracking-[0.4em] font-bold flex items-center gap-3 group">
                Découvrir l'approche
                <div className="w-10 h-[1px] bg-deep-brown group-hover:w-16 transition-all duration-500"></div>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Image with Parallax */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute top-40 right-[10%] w-[30%] aspect-[4/5] z-0 hidden lg:block"
      >
        <div className="relative w-full h-full">
          <img 
            src="/images/cabinetphoto.png" 
            alt="Nature Corse" 
            className="w-full h-full object-cover rounded-[2rem] shadow-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 rounded-[2rem] ring-1 ring-white/20 inset-shadow-sm"></div>
          
          {/* Floating Glass Card */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute -bottom-10 -left-10 lg:-left-20 glass p-8 rounded-2xl max-w-[280px] hidden md:block"
          >
            <Sparkles className="text-terracotta mb-4" />
            <p className="font-serif text-lg leading-snug">
              Une approche douce et personnalisée pour chaque étape de votre vie.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Background Text Marquee */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden whitespace-nowrap opacity-[0.03] pointer-events-none select-none py-4">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-12"
        >
          <span className="text-[18vw] md:text-[10vw] font-serif leading-none uppercase tracking-tighter">PORTO-VECCHIO • CORSE • BIEN-ÊTRE • PORTO-VECCHIO • CORSE • BIEN-ÊTRE • </span>
          <span className="text-[18vw] md:text-[10vw] font-serif leading-none uppercase tracking-tighter">PORTO-VECCHIO • CORSE • BIEN-ÊTRE • PORTO-VECCHIO • CORSE • BIEN-ÊTRE • </span>
        </motion.div>
      </div>
    </section>
  );
};

const Presentation = () => {
  return (
    <section id="presentation" className="py-32 px-8 md:px-16 bg-white overflow-hidden">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative order-2 lg:order-1 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 max-w-md"
            >
              <img 
                src="/images/-29.jpg" 
                alt="Ines Mallaroni" 
                className="w-full aspect-[3/4] object-cover rounded-[3rem] shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute -top-8 -left-8 w-48 h-48 bg-nude-200 rounded-full -z-10 blur-3xl opacity-50"></div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-sand rounded-full -z-10 blur-3xl opacity-30"></div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <span className="micro-label">L'approche Ines Mallaroni</span>
            <h2 className="section-title">Écouter le corps, <br /><span className="italic">libérer</span> l'esprit.</h2>
            <div className="space-y-8 text-xl text-deep-brown/70 font-light leading-relaxed">
              <p>
                Installée à <strong>Porto-Vecchio</strong>, je pratique une kinésiologie moderne qui allie techniques ancestrales et compréhension contemporaine du stress.
              </p>
              <p>
                Mon rôle est de vous aider à identifier les racines de vos blocages — qu'ils soient émotionnels, physiques ou énergétiques — pour vous permettre de retrouver votre autonomie et votre joie de vivre.
              </p>
              <div className="grid grid-cols-2 gap-12 pt-8">
                <div>
                  <span className="text-4xl font-serif text-terracotta block mb-2">100%</span>
                  <span className="text-xs uppercase tracking-widest font-bold opacity-60">Personnalisé</span>
                </div>
                <div>
                  <span className="text-4xl font-serif text-terracotta block mb-2">Corse</span>
                  <span className="text-xs uppercase tracking-widest font-bold opacity-60">Porto-Vecchio</span>
                </div>
              </div>
              <div className="pt-10">
                <Link to="/a-propos" className="group flex items-center gap-4 text-deep-brown hover:text-terracotta transition-colors">
                  <span className="text-sm uppercase tracking-[0.2em] font-bold">En savoir plus sur mon parcours</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

interface Service {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  details: string[];
  price: string;
  duration: string;
  img: string;
}

const ServiceModal = ({ service, isOpen, onClose, onOpenBooking }: { 
  service: Service | null, 
  isOpen: boolean, 
  onClose: () => void,
  onOpenBooking: () => void 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center md:p-8"
        >
          <div 
            className="absolute inset-0 bg-deep-brown/40 backdrop-blur-md hidden md:block"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full h-full md:h-auto md:max-h-[90vh] max-w-4xl bg-nude-50 rounded-none md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-12 h-12 glass rounded-full flex items-center justify-center text-deep-brown hover:bg-sand transition-colors"
            >
              <X size={24} />
            </button>

            <div className="w-full md:w-1/2 h-72 md:h-auto overflow-hidden shrink-0">
              <img 
                src={service.img} 
                alt={service.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto pb-24 md:pb-12">
              <span className="micro-label !mb-2">{service.subtitle}</span>
              <h3 className="text-4xl font-serif text-deep-brown mb-6">{service.title}</h3>
              
              <p className="text-lg text-deep-brown/70 mb-8 font-light leading-relaxed">
                {service.desc}
              </p>

              <div className="space-y-4 mb-10">
                <h4 className="text-xs uppercase tracking-widest font-bold opacity-40">Ce que nous travaillons :</h4>
                <ul className="space-y-3">
                  {service.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-3 text-deep-brown/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-terracotta mt-2 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-sand">
                <div className="flex flex-col">
                  <span className="text-3xl font-serif text-deep-brown">{service.price}</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-50">{service.duration}</span>
                </div>
                <button 
                  onClick={() => {
                    onClose();
                    onOpenBooking();
                  }}
                  className="btn-luxury w-full sm:w-auto"
                >
                  Réserver cette séance
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Services = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const services: Service[] = [
    {
      id: "01",
      title: "Adultes",
      subtitle: "Libération & équilibre",
      desc: "Un accompagnement personnalisé pour libérer vos blocages et retrouver une harmonie globale dans votre vie quotidienne et professionnelle.",
      details: [
        "Gestion du stress, de l’anxiété et des émotions",
        "Amélioration de la confiance en soi",
        "Accompagnement lors de périodes de transition (burn-out, deuil, séparation)",
        "Douleurs physiques chroniques sans cause médicale identifiée",
        "Amélioration du sommeil et de la vitalité"
      ],
      price: "70€",
      duration: "Séance de 1h",
      img: "/images/Acupuncture — Living River.jpg"
    },
    {
      id: "02",
      title: "Enfants (jusqu’à 12 ans)",
      subtitle: "épanouissement & apprentissage",
      desc: "Une approche ludique et bienveillante pour aider les plus jeunes à mieux comprendre leurs émotions et surmonter leurs difficultés.",
      details: [
        "Troubles de l'apprentissage et concentration",
        "Gestion des peurs et cauchemars",
        "Amélioration du sommeil",
        "Hypersensibilité et émotivité",
        "Confiance en soi et socialisation"
      ],
      price: "55€",
      duration: "Séance de 45 min",
      img: "/images/Endobelly.jpg"
    }
  ];

  return (
    <section id="prestations" className="py-32 px-8 md:px-16 bg-nude-50">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <span className="micro-label">Mes Prestations</span>
            <h2 className="section-title !mb-0">Des séances <span className="italic">sur-mesure</span> pour tous.</h2>
          </div>
          <p className="text-xl text-deep-brown/60 max-w-sm font-light">
            Chaque séance est un voyage unique vers la compréhension de soi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {services.map((service, i) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              onClick={() => setSelectedService(service)}
              className="group relative h-[400px] overflow-hidden rounded-[3rem] cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <img 
                src={service.img} 
                alt={service.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              
              {/* Subtle overlay to darken the top part slightly */}
              <div className="absolute inset-0 bg-gradient-to-b from-deep-brown/40 via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-6xl font-serif text-nude-50 opacity-20">{service.id}</span>
                  <div className="w-14 h-14 glass-dark rounded-full flex items-center justify-center text-nude-50 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-4 group-hover:translate-y-0">
                    <ArrowUpRight size={24} />
                  </div>
                </div>
                
                {/* Modern Glassmorphism Content Area */}
                <div className="glass-dark backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 transform transition-all duration-500 group-hover:translate-y-[-8px] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-1 rounded-full bg-accent" />
                    <span className="micro-label !text-accent !mb-0">{service.subtitle}</span>
                  </div>
                  <h3 className="text-3xl font-serif text-nude-50 mb-2">{service.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-serif text-nude-50">{service.price}</span>
                      <div className="h-px w-6 bg-nude-50/30" />
                      <span className="text-[10px] uppercase tracking-widest text-nude-50/60">Séance</span>
                    </div>
                    <div className="flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                      <span className="text-[10px] uppercase tracking-widest font-bold">Détails</span>
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ServiceModal 
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        onOpenBooking={onOpenBooking}
      />
    </section>
  );
};

const Benefits = () => {
  const benefits = [
    { title: "Sérénité", icon: <Sparkles /> },
    { title: "Vitalité", icon: <Leaf /> },
    { title: "Confiance", icon: <User /> },
    { title: "Harmonie", icon: <Heart /> }
  ];

  return (
    <section id="bénéfices" className="py-32 px-8 md:px-16 bg-deep-brown text-nude-50 overflow-hidden relative">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <span className="micro-label !text-accent">pourquoi choisir la kinésiologie ?</span>
          <h2 className="section-title !text-nude-50">Libérez votre <br /><span className="italic text-accent">potentiel</span> naturel.</h2>
          <p className="text-xl text-nude-50/60 mb-12 font-light leading-relaxed max-w-xl">
            La kinésiologie permet de lever les barrières invisibles qui vous empêchent d'avancer. À Porto-Vecchio, nous créons un espace sécurisé pour votre transformation.
          </p>
          <div className="grid grid-cols-2 gap-8">
            {benefits.map((b, i) => (
              <div key={b.title} className="flex items-center gap-4 group">
                <div className="w-12 h-12 glass-dark rounded-full flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-deep-brown transition-all duration-500">
                  {b.icon}
                </div>
                <span className="text-lg font-serif tracking-wide">{b.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative group">
            <div className="aspect-[4/5] w-full max-w-md rounded-[4rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
              <img 
                src="/images/-28.jpg" 
                alt="Nature Corse" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Decorative floating element - Redesigned as a refined seal */}
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className="absolute -bottom-6 -left-12 w-40 h-40 glass backdrop-blur-xl rounded-full flex items-center justify-center text-deep-brown shadow-xl border border-white/20 z-10"
            >
              <div className="text-center">
                <span className="block text-4xl font-serif mb-1">100%</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">personnalisée</span>
              </div>
              
              {/* Circular text or border decoration could go here if needed, but keeping it clean */}
              <div className="absolute inset-2 border border-dashed border-deep-brown/20 rounded-full" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
  return (
    <section id="contact" className="py-32 px-8 md:px-16 bg-nude-100">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-24 items-center">
          <div className="lg:col-span-5">
            <span className="micro-label">Contact</span>
            <h2 className="section-title">Commençons <br /><span className="italic">ensemble</span>.</h2>
            <p className="text-xl text-deep-brown/60 mb-12 font-light leading-relaxed">
              Situé au cœur de Porto-Vecchio, le cabinet vous accueille sur rendez-vous pour une parenthèse de bien-être.
            </p>
            
            <div className="space-y-12">
              <div className="group cursor-pointer">
                <span className="micro-label !mb-2 opacity-50">Où me trouver</span>
                <p className="text-2xl font-serif group-hover:text-terracotta transition-colors">41 rue Maréchal Juin (Immeuble Traiteur TORNERÓ)</p>
                <p className="text-2xl font-serif group-hover:text-terracotta transition-colors">20137 Porto-Vecchio</p>
              </div>
              <div className="group cursor-pointer">
                <span className="micro-label !mb-2 opacity-50">Me contacter</span>
                <p className="text-2xl font-serif group-hover:text-terracotta transition-colors">06 83 57 17 84</p>
              </div>
              <div className="group cursor-pointer">
                <span className="micro-label !mb-2 opacity-50">Réseaux</span>
                <div className="flex gap-6 mt-4">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Instagram className="hover:text-terracotta transition-colors" />
                  </a>
                  <a href="https://share.google/B5UulQr99RYjUFRgt" target="_blank" rel="noopener noreferrer">
                    <Search className="hover:text-terracotta transition-colors" />
                  </a>
                  <a href="https://wa.me/33683571784" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="hover:text-terracotta transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass p-10 md:p-16 rounded-[3.5rem] text-center flex flex-col items-center justify-center space-y-6">
              <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center text-terracotta mb-2">
                <Calendar size={32} />
              </div>
              <h3 className="text-3xl font-serif text-deep-brown">Prêt pour votre séance ?</h3>
              <p className="text-lg text-deep-brown/60 font-light max-w-md mx-auto">
                Réservez votre créneau directement en ligne en quelques clics. Simple, rapide et disponible 24h/24.
              </p>
              <button 
                onClick={onOpenBooking}
                className="btn-luxury px-8 py-3 text-sm flex items-center gap-3 group"
              >
                Réserver maintenant en ligne
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              <p className="text-xs uppercase tracking-widest opacity-40">Aucun paiement requis lors de la réservation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 px-8 md:px-16 bg-nude-50 border-t border-sand/30">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div>
            <span className="font-serif text-4xl tracking-tighter">Ines Mallaroni</span>
            <p className="micro-label !mt-2">Kinésiologue Porto-Vecchio</p>
          </div>
          
          <div className="flex flex-wrap gap-12">
            {[
              { name: "À Propos", url: "/a-propos", isInternal: true },
              { name: "Le Journal", url: "/blog", isInternal: true },
              { name: "Instagram", url: "#", isInternal: false },
              { name: "Google", url: "https://share.google/B5UulQr99RYjUFRgt", isInternal: false }
            ].map(social => (
              social.isInternal ? (
                <Link key={social.name} to={social.url} className="text-[10px] uppercase tracking-[0.3em] font-bold hover:text-terracotta transition-colors">{social.name}</Link>
              ) : (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.3em] font-bold hover:text-terracotta transition-colors">{social.name}</a>
              )
            ))}
          </div>
        </div>
        
        <div className="mt-20 pt-12 border-t border-sand/20 flex flex-col md:flex-row justify-between gap-8 text-[10px] uppercase tracking-[0.2em] text-deep-brown/40">
          <p>© {new Date().getFullYear()} Ines Mallaroni. Tous droits réservés.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-deep-brown transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-deep-brown transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const BookingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-white"
        >
          <div className="absolute top-6 right-6 z-[110]">
            <button
              onClick={onClose}
              className="p-4 bg-deep-brown text-nude-50 rounded-full hover:scale-110 transition-transform shadow-2xl flex items-center justify-center"
            >
              <X size={32} />
            </button>
          </div>
          <iframe
            src="https://bookingfast.pro/booking/bd1f360d-fa34-4604-a48c-6017f41eb6ef"
            className="w-full h-full border-none"
            title="Réservation"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <div className="relative">
        <Navbar onOpenBooking={() => setIsBookingOpen(true)} />
        <main>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <>
                <Hero onOpenBooking={() => setIsBookingOpen(true)} />
                <Presentation />
                <Services onOpenBooking={() => setIsBookingOpen(true)} />
                <Benefits />
                <Contact onOpenBooking={() => setIsBookingOpen(true)} />
              </>
            } />
            <Route path="/a-propos" element={<About />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </main>
        <Footer />
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        
        {/* Floating WhatsApp Button */}
        <motion.a 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          href="https://wa.me/33683571784" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-12 right-12 z-40 w-16 h-16 bg-deep-brown text-nude-50 rounded-full flex items-center justify-center shadow-2xl"
        >
          <MessageCircle className="w-8 h-8" />
        </motion.a>
      </div>
    </Router>
  );
}
