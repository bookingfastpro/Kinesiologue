/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence, MotionConfig } from "motion/react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  Leaf,
  Calendar,
  User,
  Heart,
  Sparkles,
  Instagram,
  MessageCircle,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Phone,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPostPage from "./pages/BlogPost";
import Admin from "./pages/Admin";
import { LegalNotice, Privacy } from "./pages/Legal";
import NotFound from "./pages/NotFound";
import { BookingProvider, useBooking } from "./components/booking";
import { useDialog, Picture, IMAGES } from "./components/ui";
import { Seo } from "./seo";
import { SITE, SERVICES, FAQ, PAGES, type Service } from "./site";

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                 */
/* -------------------------------------------------------------------------- */

const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    // Laisse le temps à la page de s'afficher avant de défiler vers l'ancre.
    const t = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        el.focus({ preventScroll: true });
      }
    }, 60);
    return () => window.clearTimeout(t);
  }, [pathname, hash]);

  return null;
};

const NAV_ITEMS = [
  { name: "À propos", path: "/a-propos" },
  { name: "Prestations", path: "/#prestations" },
  { name: "Bienfaits", path: "/#bienfaits" },
  { name: "Questions", path: "/#faq" },
  { name: "Le Journal", path: "/blog" },
  { name: "Contact", path: "/#contact" },
];

const useIsActive = () => {
  const { pathname, hash } = useLocation();
  return (path: string) => {
    if (path.includes("#")) return pathname === "/" && hash === path.slice(1);
    if (path === "/") return pathname === "/" && !hash;
    return pathname === path || pathname.startsWith(`${path}/`);
  };
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { open: openBooking } = useBooking();
  const isActive = useIsActive();
  const location = useLocation();
  const menuRef = useDialog(isMobileMenuOpen, () => setIsMobileMenuOpen(false));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsMobileMenuOpen(false), [location.pathname, location.hash]);

  return (
    <header>
      <nav
        aria-label="Navigation principale"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled ? "py-3 glass" : "py-5 md:py-8 bg-transparent"
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-5 sm:px-8 md:px-16 flex justify-between items-center gap-6">
          <Link to="/" className="group rounded-lg" aria-label="Inès Mallaroni, kinésiologue à Porto-Vecchio – accueil">
            <span className="flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl tracking-tighter text-deep-brown group-hover:italic transition-all duration-500">
                Inès Mallaroni
              </span>
              <span className="micro-label !mb-0 !text-[10px] !tracking-[0.3em] whitespace-nowrap">Kinésiologue • Porto-Vecchio</span>
            </span>
          </Link>

          {/* Navigation bureau */}
          <ul className="hidden xl:flex items-center gap-7 2xl:gap-10 whitespace-nowrap">
            {NAV_ITEMS.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className="nav-link text-xs uppercase tracking-[0.2em] text-deep-brown/80 hover:text-deep-brown aria-[current=page]:text-deep-brown transition-colors duration-300 relative group py-2"
                >
                  {item.name}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 w-0 h-px bg-deep-brown transition-all duration-500 group-hover:w-full group-aria-[current=page]:w-full"
                  ></span>
                </Link>
              </li>
            ))}
            <li>
              <button type="button" onClick={openBooking} className="btn-luxury">
                Réserver
              </button>
            </li>
          </ul>

          {/* Bouton menu mobile */}
          <button
            type="button"
            className="xl:hidden text-deep-brown w-12 h-12 flex items-center justify-center rounded-full hover:bg-deep-brown/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Menu size={28} aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            tabIndex={-1}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white xl:hidden flex flex-col px-6 py-6 sm:p-12 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <span className="font-serif text-2xl">Menu</span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Fermer le menu"
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-deep-brown/5 transition-colors"
              >
                <X size={30} aria-hidden="true" />
              </button>
            </div>
            <ul className="flex flex-col gap-5">
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  key={item.name}
                >
                  <Link
                    to={item.path}
                    aria-current={isActive(item.path) ? "page" : undefined}
                    className="text-4xl sm:text-5xl font-serif text-deep-brown aria-[current=page]:italic aria-[current=page]:text-terracotta"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openBooking();
              }}
              className="btn-luxury w-full !text-sm py-5 mt-10"
            >
              Réserver une séance
            </button>
            <div className="mt-auto pt-10 border-t border-sand/50">
              <p className="micro-label">Porto-Vecchio, Corse</p>
              <a href={`tel:${SITE.phoneE164}`} className="text-xl font-serif">
                {SITE.phoneDisplay}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

/* -------------------------------------------------------------------------- */
/*  Accueil                                                                    */
/* -------------------------------------------------------------------------- */

const Hero = () => {
  const { open: openBooking } = useBooking();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <section
      id="accueil"
      aria-labelledby="hero-title"
      className="relative min-h-[100svh] lg:min-h-[105vh] flex items-center overflow-hidden bg-nude-100 pt-28 pb-16 lg:py-0"
    >
      <div className="max-w-[1800px] mx-auto px-5 sm:px-8 md:px-16 w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 lg:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 id="hero-title">
              <span className="micro-label">Kinésiologue à Porto-Vecchio</span>
              <span className="section-title block">
                Retrouvez votre <br className="hidden sm:block" />
                <span className="italic text-terracotta">équilibre</span> intérieur <br className="hidden sm:block" />
                en Corse-du-Sud
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-deep-brown/80 mb-10 md:mb-12 max-w-xl font-light leading-relaxed">
              Je vous accompagne, adultes et enfants, pour libérer vos blocages et retrouver votre équilibre grâce à la
              kinésiologie.
            </p>
            <div className="flex flex-wrap gap-6 sm:gap-8 items-center">
              <button type="button" onClick={openBooking} className="btn-luxury group flex items-center gap-4">
                Prendre rendez-vous
                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} aria-hidden="true" />
              </button>
              <a
                href="#presentation"
                className="text-xs uppercase tracking-[0.3em] font-bold flex items-center gap-3 group py-3 rounded"
              >
                Découvrir l'approche
                <span
                  aria-hidden="true"
                  className="w-10 h-px bg-deep-brown group-hover:w-16 transition-all duration-500"
                ></span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Image mobile / tablette */}
        <div className="lg:hidden max-w-sm w-full mx-auto">
          <Picture
            {...IMAGES.cabinet}
            alt="Le cabinet de kinésiologie d’Inès Mallaroni à Porto-Vecchio, lumineux et apaisant"
            sizes="(min-width: 640px) 384px, 90vw"
            className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-2xl"
          />
        </div>
      </div>

      {/* Image avec parallaxe (bureau) */}
      <motion.div
        style={{ y, opacity }}
        className="absolute top-40 right-[10%] w-[30%] max-w-[560px] aspect-[4/5] z-0 hidden lg:block"
      >
        <div className="relative w-full h-full">
          <Picture
            {...IMAGES.cabinet}
            alt="Le cabinet de kinésiologie d’Inès Mallaroni à Porto-Vecchio, lumineux et apaisant"
            sizes="30vw"
            priority
            className="w-full h-full object-cover rounded-[2rem] shadow-2xl"
          />
          <div aria-hidden="true" className="absolute inset-0 rounded-[2rem] ring-1 ring-white/20"></div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute -bottom-10 -left-20 glass p-8 rounded-2xl max-w-[280px]"
          >
            <Sparkles className="text-terracotta mb-4" aria-hidden="true" />
            <p className="font-serif text-lg leading-snug">
              Une approche douce et personnalisée pour chaque étape de votre vie.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Texte décoratif défilant */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full overflow-hidden whitespace-nowrap opacity-[0.04] pointer-events-none select-none py-4"
      >
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 marquee"
        >
          <span className="text-[18vw] md:text-[10vw] font-serif leading-none uppercase tracking-tighter">
            PORTO-VECCHIO • CORSE • BIEN-ÊTRE • PORTO-VECCHIO • CORSE • BIEN-ÊTRE •{" "}
          </span>
          <span className="text-[18vw] md:text-[10vw] font-serif leading-none uppercase tracking-tighter">
            PORTO-VECCHIO • CORSE • BIEN-ÊTRE • PORTO-VECCHIO • CORSE • BIEN-ÊTRE •{" "}
          </span>
        </motion.div>
      </div>
    </section>
  );
};

const Presentation = () => {
  return (
    <section
      id="presentation"
      tabIndex={-1}
      aria-labelledby="presentation-title"
      className="py-24 md:py-32 px-5 sm:px-8 md:px-16 bg-white overflow-hidden scroll-mt-24 outline-none"
    >
      <div className="max-w-[1800px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative order-2 lg:order-1 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 max-w-md w-full"
            >
              <Picture
                {...IMAGES.testMusculaire}
                alt="Test musculaire sur le bras, outil central d’une séance de kinésiologie"
                sizes="(min-width: 1024px) 448px, 90vw"
                className="w-full aspect-[3/4] object-cover rounded-[3rem] shadow-2xl"
              />
            </motion.div>
            <div aria-hidden="true" className="absolute -top-8 -left-8 w-48 h-48 bg-nude-200 rounded-full -z-10 blur-3xl opacity-50"></div>
            <div aria-hidden="true" className="absolute -bottom-8 -right-8 w-64 h-64 bg-sand rounded-full -z-10 blur-3xl opacity-30"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <span className="micro-label">L'approche d'Inès Mallaroni</span>
            <h2 id="presentation-title" className="section-title">
              Écouter le corps, <br />
              <span className="italic">libérer</span> l'esprit.
            </h2>
            <div className="space-y-6 md:space-y-8 text-lg md:text-xl text-deep-brown/80 font-light leading-relaxed">
              <p>
                Installée à <strong className="font-semibold">Porto-Vecchio</strong>, je pratique une kinésiologie moderne qui
                allie techniques ancestrales et compréhension contemporaine du stress.
              </p>
              <p>
                Mon rôle est de vous aider à identifier les racines de vos blocages — qu'ils soient émotionnels, physiques
                ou énergétiques — pour vous permettre de retrouver votre autonomie et votre joie de vivre.
              </p>
              <dl className="grid grid-cols-2 gap-8 md:gap-12 pt-6">
                <div className="flex flex-col-reverse">
                  <dt className="text-xs uppercase tracking-widest font-bold text-deep-brown/75">Personnalisé</dt>
                  <dd className="text-4xl font-serif text-terracotta mb-2">100%</dd>
                </div>
                <div className="flex flex-col-reverse">
                  <dt className="text-xs uppercase tracking-widest font-bold text-deep-brown/75">Porto-Vecchio</dt>
                  <dd className="text-4xl font-serif text-terracotta mb-2">Corse</dd>
                </div>
              </dl>
              <div className="pt-6">
                <Link
                  to="/a-propos"
                  className="group inline-flex items-center gap-4 text-deep-brown hover:text-terracotta transition-colors py-2 rounded"
                >
                  <span className="text-sm uppercase tracking-[0.2em] font-bold">En savoir plus sur mon parcours</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ServiceModal = ({ service, onClose }: { service: Service | null; onClose: () => void }) => {
  const { open: openBooking } = useBooking();
  const ref = useDialog(!!service, onClose);

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center md:p-8"
        >
          <div aria-hidden="true" className="absolute inset-0 bg-deep-brown/50 backdrop-blur-md" onClick={onClose} />

          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
            tabIndex={-1}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full h-full md:h-auto md:max-h-[90vh] max-w-4xl bg-nude-50 rounded-none md:rounded-[3rem] overflow-y-auto md:overflow-hidden shadow-2xl flex flex-col md:flex-row outline-none"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-12 h-12 glass rounded-full flex items-center justify-center text-deep-brown hover:bg-sand transition-colors"
            >
              <X size={24} aria-hidden="true" />
            </button>

            <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden shrink-0">
              <Picture
                base={service.img}
                width={736}
                height={1100}
                alt={service.imgAlt}
                sizes="(min-width: 768px) 450px, 100vw"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 md:overflow-y-auto">
              <span className="micro-label !mb-2">{service.subtitle}</span>
              <h3 id="service-modal-title" className="text-3xl md:text-4xl font-serif text-deep-brown mb-6">
                {service.title}
              </h3>

              <p className="text-lg text-deep-brown/80 mb-8 font-light leading-relaxed">{service.desc}</p>

              <div className="space-y-4 mb-10">
                <h4 className="font-sans text-xs uppercase tracking-widest font-bold text-deep-brown/75">Ce que nous travaillons :</h4>
                <ul className="space-y-3">
                  {service.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3 text-deep-brown/85">
                      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-terracotta mt-2.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-sand">
                <p className="flex flex-col">
                  <span className="text-3xl font-serif text-deep-brown">{service.price} €</span>
                  <span className="text-xs uppercase tracking-widest text-deep-brown/75 whitespace-nowrap">{service.duration}</span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openBooking();
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

const Services = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <section
      id="prestations"
      tabIndex={-1}
      aria-labelledby="prestations-title"
      className="py-24 md:py-32 px-5 sm:px-8 md:px-16 bg-nude-50 scroll-mt-20 outline-none"
    >
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <span className="micro-label">Mes prestations</span>
            <h2 id="prestations-title" className="section-title !mb-0">
              Des séances <span className="italic whitespace-nowrap">sur-mesure</span> pour tous.
            </h2>
          </div>
          <p className="text-lg md:text-xl text-deep-brown/80 max-w-sm font-light">
            Chaque séance est un voyage unique vers la compréhension de soi.
          </p>
        </div>

        <ul className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          {SERVICES.map((service, i) => (
            <motion.li
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative h-[420px] overflow-hidden rounded-[3rem] shadow-xl hover:shadow-2xl transition-shadow duration-500 focus-within:ring-4 focus-within:ring-terracotta/60"
            >
              <Picture
                base={service.img}
                width={736}
                height={1100}
                alt=""
                sizes="(min-width: 768px) 45vw, 100vw"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />

              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-deep-brown/40 via-transparent to-deep-brown/30"></div>

              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start" aria-hidden="true">
                  <span className="text-6xl font-serif text-nude-50/40">{service.number}</span>
                  <span className="w-14 h-14 glass-dark rounded-full flex items-center justify-center text-nude-50 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-4 group-hover:translate-y-0">
                    <ArrowUpRight size={24} />
                  </span>
                </div>

                <div className="glass-dark p-6 rounded-[2rem] transform transition-all duration-500 group-hover:-translate-y-2">
                  <p className="flex items-center gap-2 mb-1">
                    <span aria-hidden="true" className="w-1 h-1 rounded-full bg-accent" />
                    <span className="micro-label !text-accent !mb-0">{service.subtitle}</span>
                  </p>
                  <h3 className="text-3xl font-serif text-nude-50 mb-3">
                    {/* Le bouton couvre toute la carte : un seul élément cliquable, accessible au clavier */}
                    <button
                      type="button"
                      onClick={() => setSelectedService(service)}
                      className="text-left after:absolute after:inset-0 after:content-[''] focus:outline-none"
                      aria-haspopup="dialog"
                    >
                      {service.shortTitle}
                    </button>
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-3">
                      <span className="text-xl font-serif text-nude-50">{service.price} €</span>
                      <span aria-hidden="true" className="h-px w-6 bg-nude-50/40" />
                      <span className="text-xs uppercase tracking-widest text-nude-50/85">{service.duration}</span>
                    </p>
                    <span
                      aria-hidden="true"
                      className="flex items-center gap-2 text-accent transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 md:translate-x-4 md:group-hover:translate-x-0"
                    >
                      <span className="text-xs uppercase tracking-widest font-bold">Détails</span>
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
    </section>
  );
};

const Benefits = () => {
  const benefits = [
    { title: "Sérénité", icon: Sparkles },
    { title: "Vitalité", icon: Leaf },
    { title: "Confiance", icon: User },
    { title: "Harmonie", icon: Heart },
  ];

  return (
    <section
      id="bienfaits"
      tabIndex={-1}
      aria-labelledby="bienfaits-title"
      className="py-24 md:py-32 px-5 sm:px-8 md:px-16 bg-deep-brown text-nude-50 overflow-hidden relative scroll-mt-20 outline-none"
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="micro-label !text-accent">Pourquoi choisir la kinésiologie ?</span>
          <h2 id="bienfaits-title" className="section-title !text-nude-50">
            Libérez votre <br />
            <span className="italic text-accent">potentiel</span> naturel.
          </h2>
          <p className="text-lg md:text-xl text-nude-50/80 mb-12 font-light leading-relaxed max-w-xl">
            La kinésiologie permet de lever les barrières invisibles qui vous empêchent d'avancer. À Porto-Vecchio, nous
            créons un espace sécurisé pour votre transformation.
          </p>
          <ul className="grid grid-cols-2 gap-6 sm:gap-8">
            {benefits.map(({ title, icon: Icon }) => (
              <li key={title} className="flex items-center gap-4 group">
                <span className="w-12 h-12 glass-dark rounded-full flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-deep-brown transition-all duration-500 shrink-0">
                  <Icon aria-hidden="true" />
                </span>
                <span className="text-lg font-serif tracking-wide">{title}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative group w-full max-w-md">
            <div className="aspect-[4/5] w-full rounded-[4rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
              <Picture
                {...IMAGES.nature}
                alt="Main effleurant la surface de l’eau au coucher du soleil, symbole d’apaisement"
                sizes="(min-width: 1024px) 448px, 90vw"
                className="w-full h-full object-cover"
              />
            </div>

            <motion.div
              aria-hidden="true"
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className="absolute -bottom-6 left-0 sm:-left-12 w-36 h-36 sm:w-40 sm:h-40 bg-white/80 backdrop-blur-xl rounded-full flex items-center justify-center text-deep-brown shadow-xl z-10"
            >
              <span className="text-center">
                <span className="block text-4xl font-serif mb-1">100%</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">personnalisée</span>
              </span>
              <span className="absolute inset-2 border border-dashed border-deep-brown/30 rounded-full" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Faq = () => (
  <section
    id="faq"
    tabIndex={-1}
    aria-labelledby="faq-title"
    className="py-24 md:py-32 px-5 sm:px-8 md:px-16 bg-white scroll-mt-20 outline-none"
  >
    <div className="max-w-4xl mx-auto">
      <span className="micro-label">Questions fréquentes</span>
      <h2 id="faq-title" className="section-title">
        Tout savoir sur <span className="italic">la kinésiologie</span>.
      </h2>
      <div className="mt-12 divide-y divide-sand border-y border-sand">
        {FAQ.map((item) => (
          <details key={item.q} className="group py-2">
            <summary className="flex items-center justify-between gap-6 cursor-pointer list-none py-5 text-xl md:text-2xl font-serif text-deep-brown rounded-lg">
              <h3 className="font-serif">{item.q}</h3>
              <span
                aria-hidden="true"
                className="w-10 h-10 shrink-0 rounded-full border border-sand flex items-center justify-center transition-transform duration-300 group-open:rotate-45"
              >
                <Plus size={18} />
              </span>
            </summary>
            <p className="pb-6 pr-12 text-lg text-deep-brown/80 font-light leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const Contact = () => {
  const { open: openBooking } = useBooking();
  return (
    <section
      id="contact"
      tabIndex={-1}
      aria-labelledby="contact-title"
      className="py-24 md:py-32 px-5 sm:px-8 md:px-16 bg-nude-100 scroll-mt-20 outline-none"
    >
      <div className="max-w-[1800px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-5">
            <span className="micro-label">Contact</span>
            <h2 id="contact-title" className="section-title">
              Commençons <br />
              <span className="italic">ensemble</span>.
            </h2>
            <p className="text-lg md:text-xl text-deep-brown/80 mb-12 font-light leading-relaxed">
              Situé au cœur de Porto-Vecchio, le cabinet vous accueille sur rendez-vous pour une parenthèse de bien-être.
            </p>

            <address className="not-italic space-y-10">
              <div>
                <h3 className="micro-label !mb-2">Où me trouver</h3>
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex gap-3 text-xl sm:text-2xl font-serif hover:text-terracotta transition-colors rounded"
                >
                  <MapPin className="mt-1.5 shrink-0 text-terracotta" size={20} aria-hidden="true" />
                  <span>
                    {SITE.address.street} ({SITE.address.complement})
                    <br />
                    {SITE.address.postalCode} {SITE.address.city}
                    <span className="sr-only"> (ouvre Google Maps dans un nouvel onglet)</span>
                  </span>
                </a>
              </div>
              <div>
                <h3 className="micro-label !mb-2">Me contacter</h3>
                <a
                  href={`tel:${SITE.phoneE164}`}
                  className="inline-flex items-center gap-3 text-xl sm:text-2xl font-serif hover:text-terracotta transition-colors rounded"
                >
                  <Phone className="shrink-0 text-terracotta" size={20} aria-hidden="true" />
                  {SITE.phoneDisplay}
                </a>
              </div>
              <div>
                <h3 className="micro-label !mb-2">Réseaux</h3>
                <ul className="flex gap-3 mt-3">
                  {SITE.instagramUrl && (
                    <li>
                      <a
                        href={SITE.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram (nouvel onglet)"
                        className="w-12 h-12 rounded-full border border-sand flex items-center justify-center hover:text-terracotta hover:border-terracotta transition-colors"
                      >
                        <Instagram aria-hidden="true" />
                      </a>
                    </li>
                  )}
                  <li>
                    <a
                      href={SITE.googleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Fiche Google et avis (nouvel onglet)"
                      className="w-12 h-12 rounded-full border border-sand flex items-center justify-center hover:text-terracotta hover:border-terracotta transition-colors font-bold text-lg"
                    >
                      <span aria-hidden="true">G</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={SITE.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Écrire sur WhatsApp (nouvel onglet)"
                      className="w-12 h-12 rounded-full border border-sand flex items-center justify-center hover:text-terracotta hover:border-terracotta transition-colors"
                    >
                      <MessageCircle aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </div>
            </address>
          </div>

          <div className="lg:col-span-7">
            <div className="glass p-8 sm:p-10 md:p-16 rounded-[2.5rem] md:rounded-[3.5rem] text-center flex flex-col items-center justify-center space-y-6">
              <span className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center text-terracotta mb-2">
                <Calendar size={32} aria-hidden="true" />
              </span>
              <h3 className="text-3xl font-serif text-deep-brown">Prêt(e) pour votre séance ?</h3>
              <p className="text-lg text-deep-brown/80 font-light max-w-md mx-auto">
                Réservez votre créneau directement en ligne en quelques clics. Simple, rapide et disponible 24h/24.
              </p>
              <button type="button" onClick={openBooking} className="btn-luxury flex items-center gap-3 group">
                Réserver en ligne
                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} aria-hidden="true" />
              </button>
              <p className="text-xs uppercase tracking-widest text-deep-brown/75">
                Aucun paiement requis lors de la réservation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Home = () => (
  <>
    <Seo meta={PAGES.home} />
    <Hero />
    <Presentation />
    <Services />
    <Benefits />
    <Faq />
    <Contact />
  </>
);

/* -------------------------------------------------------------------------- */
/*  Pied de page                                                               */
/* -------------------------------------------------------------------------- */

const Footer = () => {
  const links = [
    { name: "À propos", url: "/a-propos" },
    { name: "Prestations", url: "/#prestations" },
    { name: "Questions fréquentes", url: "/#faq" },
    { name: "Le Journal", url: "/blog" },
  ];
  return (
    <footer className="py-16 md:py-20 px-5 sm:px-8 md:px-16 bg-nude-50 border-t border-sand/50">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div>
            <p className="font-serif text-4xl tracking-tighter">Inès Mallaroni</p>
            <p className="micro-label !mt-2 !mb-0">Kinésiologue à Porto-Vecchio, Corse-du-Sud</p>
            <p className="mt-4 text-sm text-deep-brown/80 leading-relaxed">
              {SITE.address.street}, {SITE.address.postalCode} {SITE.address.city}
              <br />
              <a href={`tel:${SITE.phoneE164}`} className="hover:text-terracotta underline-offset-4 hover:underline">
                {SITE.phoneDisplay}
              </a>
            </p>
          </div>

          <nav aria-label="Liens du pied de page">
            <ul className="flex flex-wrap gap-x-10 gap-y-4">
              {links.map((l) => (
                <li key={l.name}>
                  <Link to={l.url} className="text-xs uppercase tracking-[0.25em] font-bold hover:text-terracotta transition-colors py-2">
                    {l.name}
                  </Link>
                </li>
              ))}
              {SITE.instagramUrl && (
                <li>
                  <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.25em] font-bold hover:text-terracotta transition-colors py-2">
                    Instagram
                  </a>
                </li>
              )}
              <li>
                <a href={SITE.googleUrl} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.25em] font-bold hover:text-terracotta transition-colors py-2">
                  Avis Google
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <p className="mt-12 text-xs text-deep-brown/75 leading-relaxed max-w-3xl">
          La kinésiologie est une pratique de bien-être complémentaire. Elle ne pose pas de diagnostic et ne se substitue
          pas à un avis, un traitement ou un suivi médical.
        </p>

        <div className="mt-10 pt-10 border-t border-sand/50 flex flex-col md:flex-row justify-between gap-6 text-xs uppercase tracking-[0.2em] text-deep-brown/75">
          <p>© {new Date().getFullYear()} Inès Mallaroni. Tous droits réservés.</p>
          <ul className="flex gap-8">
            <li>
              <Link to="/mentions-legales" className="hover:text-deep-brown transition-colors">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link to="/confidentialite" className="hover:text-deep-brown transition-colors">
                Confidentialité
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

/* -------------------------------------------------------------------------- */
/*  Application                                                                */
/* -------------------------------------------------------------------------- */

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/a-propos" element={<About />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:slug" element={<BlogPostPage />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="/mentions-legales" element={<LegalNotice />} />
    <Route path="/confidentialite" element={<Privacy />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default function App() {
  const location = useLocation();
  return (
    <MotionConfig reducedMotion="user">
      <BookingProvider>
        <ScrollManager />
        <a href="#contenu" className="skip-link">
          Aller au contenu principal
        </a>
        <Navbar />
        <main id="contenu" tabIndex={-1} key={location.pathname} className="outline-none">
          <AppRoutes />
        </main>
        <Footer />

        {/* Bouton WhatsApp flottant */}
        <aside aria-label="Contact rapide">
        <a
          href={SITE.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Écrire à Inès sur WhatsApp (nouvel onglet)"
          className="fixed bottom-5 right-5 md:bottom-10 md:right-10 z-40 w-14 h-14 md:w-16 md:h-16 bg-deep-brown text-nude-50 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        >
          <MessageCircle className="w-7 h-7 md:w-8 md:h-8" aria-hidden="true" />
        </a>
        </aside>
      </BookingProvider>
    </MotionConfig>
  );
}
