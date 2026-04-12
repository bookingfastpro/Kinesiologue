import { motion } from "motion/react";
import { Sparkles, Heart, Zap, Brain, Target, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-nude-50 min-h-screen pt-32 pb-20 px-8 md:px-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="micro-label">Faisons connaissance</span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-brown mb-8 leading-tight">
            Bonjour, je suis <br />
            <span className="italic text-terracotta">Inès Mallaroni</span>
          </h1>
          <p className="text-2xl md:text-3xl text-deep-brown/80 font-light mb-16 leading-relaxed">
            Kinésiologue certifiée et alliée de votre équilibre.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-16 items-start">
          <div className="md:col-span-12 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-xl prose-stone max-w-none text-deep-brown/70 font-light leading-relaxed space-y-8"
            >
              <p>
                Depuis aussi loin que je m’en souvienne, j’ai toujours ressenti l’appel d’accompagner les autres. Pourtant, le chemin vers le soin n’a pas été immédiat. J'ai d'abord exploré le monde de la communication : un univers créatif, dynamique et riche en échanges humains.
              </p>
              <p>
                Ces années m'ont permis de mûrir, d'affiner mon écoute et de confirmer une certitude : ma place est auprès de vous, dans l'accompagnement profond et personnalisé.
              </p>
              <p>
                La kinésiologie s’est alors imposée à moi comme une évidence. Ce n’était pas une découverte, mais une retrouvaille, car c’est la toute première pratique de bien-être que j'ai testée à l’adolescence. Aujourd’hui, la boucle est bouclée, et c’est avec cette conviction que je vous accueille au sein de mon cabinet.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3rem] p-12 shadow-xl border border-sand/30"
            >
              <h2 className="text-3xl font-serif text-deep-brown mb-10">Pourquoi la Kinésiologie ?</h2>
              <p className="text-lg text-deep-brown/60 mb-12">
                La kinésiologie est une pratique complète qui s'appuie sur la mémoire du corps pour agir sur trois piliers fondamentaux :
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: "Le corps physique", desc: "Pour libérer les tensions et retrouver du mouvement.", icon: <Heart className="text-terracotta" /> },
                  { title: "Le mental", desc: "Pour apaiser les pensées envahissantes et changer de perspective.", icon: <Brain className="text-terracotta" /> },
                  { title: "L’énergétique", desc: "Pour relancer votre vitalité et votre élan intérieur.", icon: <Zap className="text-terracotta" /> }
                ].map((item, i) => (
                  <div key={i} className="space-y-4">
                    <div className="w-12 h-12 bg-nude-100 rounded-2xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <h3 className="font-serif text-xl text-deep-brown">{item.title}</h3>
                    <p className="text-sm text-deep-brown/60 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <h2 className="text-3xl font-serif text-deep-brown">Un accompagnement pour avancer sereinement</h2>
              <p className="text-xl text-deep-brown/70 font-light leading-relaxed">
                Grâce au test musculaire (l'outil de base du kinésiologue), nous identifions ensemble l’origine de vos blocages. Mon rôle est de vous aider à libérer ce qui vous empêche d’avancer sereinement. Que ce soit pour :
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  "La gestion du stress et de l’anxiété.",
                  "Le dépassement de phobies ou de traumatismes émotionnels.",
                  "L’amélioration de la confiance en soi et de l'estime de soi.",
                  "Les troubles du sommeil ou la fatigue chronique.",
                  "Les difficultés d’apprentissage ou de concentration."
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-6 bg-sand/10 rounded-2xl border border-sand/20">
                    <CheckCircle2 className="text-terracotta shrink-0" size={20} />
                    <span className="text-deep-brown/80 font-light">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="py-16 border-t border-sand/30"
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-serif text-deep-brown">Mon approche : <span className="whitespace-nowrap">Bienveillance et Énergie</span></h2>
                  <p className="text-lg text-deep-brown/70 font-light leading-relaxed">
                    Jeune praticienne, je suis animée par une réelle envie de vous transmettre les outils nécessaires à votre épanouissement. Je vous accueille avec simplicité, écoute et une dose d'optimisme, pour faire de chaque séance un moment constructif.
                  </p>
                  <p className="text-lg text-deep-brown/70 font-light leading-relaxed">
                    Peu importe l'étape de vie que vous traversez, je m'engage à vous accompagner avec une bienveillance sincère pour vous aider à retrouver votre plein potentiel.
                  </p>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                    <img 
                      src="/images/-29.jpg" 
                      alt="Inès Mallaroni" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 glass rounded-full flex items-center justify-center text-center p-4 shadow-xl">
                    <span className="micro-label !mb-0 !text-[8px] font-bold whitespace-nowrap">Bienveillance & Énergie</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-deep-brown text-nude-50 rounded-[3rem] p-12 md:p-20 text-center space-y-8"
            >
              <Sparkles className="mx-auto text-accent" size={48} />
              <h2 className="text-4xl md:text-5xl font-serif">Prêt(e) à retrouver votre équilibre ?</h2>
              <p className="text-xl text-nude-50/60 font-light max-w-xl mx-auto">
                Rencontrons-nous pour débuter votre voyage vers le <span className="whitespace-nowrap">mieux-être.</span>
              </p>
              <Link 
                to="/#contact" 
                className="btn-luxury !bg-white !text-deep-brown inline-block px-12 py-4 text-lg"
              >
                Prendre rendez-vous
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
