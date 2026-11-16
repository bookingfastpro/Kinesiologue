import { motion } from "motion/react";
import { Sparkles, Heart, Zap, Brain, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "../seo";
import { PAGES } from "../site";
import { useBooking } from "../components/booking";
import { Picture, IMAGES } from "../components/ui";
import Breadcrumbs from "../components/Breadcrumbs";

const PILLARS = [
  { title: "Le corps physique", desc: "Pour libérer les tensions et retrouver du mouvement.", icon: Heart },
  { title: "Le mental", desc: "Pour apaiser les pensées envahissantes et changer de perspective.", icon: Brain },
  { title: "L’énergétique", desc: "Pour relancer votre vitalité et votre élan intérieur.", icon: Zap },
];

const NEEDS = [
  "La gestion du stress et de l’anxiété.",
  "Le dépassement de phobies ou de traumatismes émotionnels.",
  "L’amélioration de la confiance en soi et de l'estime de soi.",
  "Les troubles du sommeil ou la fatigue chronique.",
  "Les difficultés d’apprentissage ou de concentration.",
];

const About = () => {
  const { open: openBooking } = useBooking();
  return (
    <div className="bg-nude-50 min-h-screen pt-32 md:pt-40 pb-20 px-5 sm:px-8 md:px-16">
      <Seo meta={PAGES.about} />
      <article className="max-w-4xl mx-auto">
        <Breadcrumbs items={[{ name: "Accueil", path: "/" }, { name: "À propos" }]} />
        <motion.header initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="micro-label">Faisons connaissance</span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-brown mb-8 leading-tight">
            Bonjour, je suis <br />
            <span className="italic text-terracotta">Inès Mallaroni</span>
          </h1>
          <p className="text-2xl md:text-3xl text-deep-brown/85 font-light mb-16 leading-relaxed">
            Kinésiologue certifiée à Porto-Vecchio et alliée de votre équilibre.
          </p>
        </motion.header>

        <div className="space-y-16 md:space-y-20">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            aria-label="Mon parcours"
            className="text-lg md:text-xl text-deep-brown/80 font-light leading-relaxed space-y-6 md:space-y-8"
          >
            <p>
              Depuis aussi loin que je m’en souvienne, j’ai toujours ressenti l’appel d’accompagner les autres. Pourtant,
              le chemin vers le soin n’a pas été immédiat. J'ai d'abord exploré le monde de la communication : un univers
              créatif, dynamique et riche en échanges humains.
            </p>
            <p>
              Ces années m'ont permis de mûrir, d'affiner mon écoute et de confirmer une certitude : ma place est auprès de
              vous, dans l'accompagnement profond et personnalisé.
            </p>
            <p>
              La kinésiologie s’est alors imposée à moi comme une évidence. Ce n’était pas une découverte, mais une
              retrouvaille, car c’est la toute première pratique de bien-être que j'ai testée à l’adolescence.
              Aujourd’hui, la boucle est bouclée, et c’est avec cette conviction que je vous accueille au sein de mon
              cabinet de Porto-Vecchio.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            aria-labelledby="why-title"
            className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 shadow-xl border border-sand/40"
          >
            <h2 id="why-title" className="text-3xl md:text-4xl font-serif text-deep-brown mb-6 md:mb-10">
              Pourquoi la kinésiologie ?
            </h2>
            <p className="text-lg text-deep-brown/80 mb-10 md:mb-12">
              La kinésiologie est une pratique complète qui s'appuie sur la mémoire du corps pour agir sur trois piliers
              fondamentaux :
            </p>
            <ul className="grid md:grid-cols-3 gap-8">
              {PILLARS.map(({ title, desc, icon: Icon }) => (
                <li key={title} className="space-y-4">
                  <span className="w-12 h-12 bg-nude-100 rounded-2xl flex items-center justify-center">
                    <Icon className="text-terracotta" aria-hidden="true" />
                  </span>
                  <h3 className="font-serif text-2xl text-deep-brown">{title}</h3>
                  <p className="text-base text-deep-brown/80 leading-relaxed">{desc}</p>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            aria-labelledby="support-title"
            className="space-y-8 md:space-y-10"
          >
            <h2 id="support-title" className="text-3xl md:text-4xl font-serif text-deep-brown">
              Un accompagnement pour avancer sereinement
            </h2>
            <p className="text-lg md:text-xl text-deep-brown/80 font-light leading-relaxed">
              Grâce au test musculaire (l'outil de base du kinésiologue), nous identifions ensemble l’origine de vos
              blocages. Mon rôle est de vous aider à libérer ce qui vous empêche d’avancer sereinement. Que ce soit pour :
            </p>
            <ul className="grid sm:grid-cols-2 gap-4 md:gap-6">
              {NEEDS.map((item) => (
                <li key={item} className="flex items-center gap-4 p-5 md:p-6 bg-sand/15 rounded-2xl border border-sand/40">
                  <CheckCircle2 className="text-terracotta shrink-0" size={20} aria-hidden="true" />
                  <span className="text-deep-brown/90">{item}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            aria-labelledby="approach-title"
            className="py-12 md:py-16 border-t border-sand/50"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 id="approach-title" className="text-3xl md:text-4xl font-serif text-deep-brown">
                  Mon approche : <span className="italic">bienveillance et énergie</span>
                </h2>
                <p className="text-lg text-deep-brown/80 font-light leading-relaxed">
                  Jeune praticienne, je suis animée par une réelle envie de vous transmettre les outils nécessaires à votre
                  épanouissement. Je vous accueille avec simplicité, écoute et une dose d'optimisme, pour faire de chaque
                  séance un moment constructif.
                </p>
                <p className="text-lg text-deep-brown/80 font-light leading-relaxed">
                  Peu importe l'étape de vie que vous traversez, je m'engage à vous accompagner avec une bienveillance
                  sincère pour vous aider à retrouver votre plein potentiel.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                  <Picture
                    {...IMAGES.testMusculaire}
                    alt="Test musculaire réalisé par la kinésiologue pendant une séance"
                    sizes="(min-width: 768px) 420px, 90vw"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute -bottom-6 -right-2 sm:-right-6 w-32 h-32 glass rounded-full flex items-center justify-center text-center p-4 shadow-xl"
                >
                  <span className="font-serif italic text-lg leading-tight text-deep-brown">Bienveillance & énergie</span>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            aria-labelledby="cta-title"
            className="bg-deep-brown text-nude-50 rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-20 text-center space-y-8"
          >
            <Sparkles className="mx-auto text-accent" size={48} aria-hidden="true" />
            <h2 id="cta-title" className="text-4xl md:text-5xl font-serif">
              Prêt(e) à retrouver votre équilibre ?
            </h2>
            <p className="text-xl text-nude-50/80 font-light max-w-xl mx-auto">
              Rencontrons-nous pour débuter votre voyage vers le <span className="whitespace-nowrap">mieux-être.</span>
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button type="button" onClick={openBooking} className="btn-luxury !bg-white !text-deep-brown">
                Prendre rendez-vous
              </button>
              <Link
                to="/#prestations"
                className="btn-luxury-outline !border-nude-50/60 !text-nude-50 hover:!bg-nude-50 hover:!text-deep-brown"
              >
                Voir les tarifs
              </Link>
            </div>
          </motion.section>
        </div>
      </article>
    </div>
  );
};

export default About;
