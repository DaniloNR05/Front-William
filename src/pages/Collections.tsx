import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { API_BASE_URL } from '@/lib/config';

interface Collection {
  id: number;
  slug: string;
  name_pt: string;
  name_en: string;
  description_pt: string;
  description_en: string;
  image: string;
}

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/collections`);
      if (response.ok) {
        const data = await response.json();
        setCollections(data);
      }
    } catch (error) {
      console.error('Failed to fetch collections', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionClick = (slug: string) => {
    navigate(`/collections/${slug}`);
  };

  return (
    <Layout>
      <div className="pt-24 md:pt-32">
        {/* Header */}
        <section className="luxury-container py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl md:text-5xl text-primary tracking-wide mb-6">
              {t.collections.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t.collections.description}
            </p>
          </motion.div>
        </section>

        {/* Collections Grid */}
        <section className="luxury-container pb-24">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection, index) => {
                const name = language === 'pt' ? collection.name_pt : collection.name_en;
                const description = language === 'pt' ? collection.description_pt : collection.description_en;

                return (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => handleCollectionClick(collection.slug)}
                  >
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-6 bg-muted">
                      {collection.image ? (
                        <img
                          src={collection.image}
                          alt={name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
                          Sem Imagem
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      
                      {/* Explore Button */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <Button
                          variant="luxury"
                          className="w-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0"
                        >
                          {t.collections.explore}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
                        {name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
