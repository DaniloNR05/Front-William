import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const aboutImage = 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1200&q=80';

export default function About() {
  const { t, language } = useLanguage();

  return (
    <Layout>
      <div className="pt-24 md:pt-32">
        {/* Hero Section */}
        <section className="luxury-container py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[3/4] rounded-lg overflow-hidden"
            >
              <img
                src={aboutImage}
                alt="William Pignatti Atelier"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <div>
                <p className="text-sm tracking-widest text-primary/60 uppercase mb-4">
                  {t.nav.about}
                </p>
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-primary tracking-wide mb-6">
                  William Pignatti
                </h1>
              </div>

              <div className="gold-divider" />

              <p className="text-lg leading-relaxed text-foreground">
                {t.about.impact}
              </p>

              {t.about.description.map((paragraph, index) => (
                <p key={index} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-card/30 py-20">
          <div className="luxury-container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-12"
            >
              {[
                {
                  title: 'Craftsmanship',
                  titlePt: 'Artesanato',
                  description: 'Every stitch tells a story of mastery.',
                  descriptionPt: 'Cada ponto conta uma história de maestria.',
                },
                {
                  title: 'Exclusivity',
                  titlePt: 'Exclusividade',
                  description: 'Pieces made for the few who understand.',
                  descriptionPt: 'Peças feitas para os poucos que entendem.',
                },
                {
                  title: 'Legacy',
                  titlePt: 'Legado',
                  description: 'Designed to be worn for generations.',
                  descriptionPt: 'Projetado para ser usado por gerações.',
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <h3 className="font-display text-xl text-primary mb-4 tracking-wide">
                    {language === 'pt' ? value.titlePt : value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'pt' ? value.descriptionPt : value.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
