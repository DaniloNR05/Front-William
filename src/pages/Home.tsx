import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { SubscribeModal } from '@/components/modals/SubscribeModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

// Hero images
const heroDesktop = '/images/hero-desktop.jpg';
const heroMobile = '/images/hero-mobile.jpg';

export default function Home() {
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const scrollToFeatured = () => {
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout showFooter={true}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-end">
        {/* Background Image */}
        <div className="absolute inset-0">
          <picture>
            <source media="(min-width: 768px)" srcSet={heroDesktop} />
            <img 
              src={heroMobile} 
              alt="Background" 
              className="w-full h-full object-cover object-top md:object-center"
              loading="eager"
            />
          </picture>
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 luxury-container pb-24 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-sm tracking-widest text-primary/80 uppercase mb-4"
            >
              {t.hero.subtitle}
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wider text-primary mb-6"
            >
              {t.hero.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg"
            >
              {t.hero.description}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Button 
                variant="luxury" 
                size="lg"
                onClick={() => navigate('/collections')}
              >
                {t.hero.viewCollection}
              </Button>
              
              {!isAuthenticated && (
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => setIsSubscribeModalOpen(true)}
                  className="border-primary/30 text-foreground hover:bg-primary/10"
                >
                  {t.footer.subscribe}
                </Button>
              )}
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            onClick={scrollToFeatured}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary/50 hover:text-primary transition-colors animate-float"
          >
            <ArrowDown className="h-6 w-6" />
          </motion.button>
        </div>
      </section>

      {/* Featured Section */}
      <section id="featured" className="py-24 md:py-32">
        <div className="luxury-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
              {t.featured.title}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t.featured.subtitle}
            </p>
          </motion.div>

          {/* Featured Image with Parallax Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-[16/9] md:aspect-[21/9] rounded-lg overflow-hidden group"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ 
                backgroundImage: `url(https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1920&q=80)` 
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            
            {/* CTA Overlay */}
            <div className="absolute inset-0 flex items-end justify-center pb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button 
                  variant="luxury" 
                  size="lg"
                  onClick={() => setIsSubscribeModalOpen(true)}
                >
                  {t.footer.subscribe}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subscribe Modal */}
      <SubscribeModal 
        isOpen={isSubscribeModalOpen} 
        onClose={() => setIsSubscribeModalOpen(false)} 
      />
    </Layout>
  );
}
