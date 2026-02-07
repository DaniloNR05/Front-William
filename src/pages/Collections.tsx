import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { API_BASE_URL } from '@/lib/config';

interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  gender: string;
}

// Fallback collections for demo
const fallbackCollections: Collection[] = [
  {
    id: '1',
    slug: 'formal-suits',
    name: 'Ternos Formais',
    description: 'Elegância clássica para toda ocasião',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    gender: 'Homem',
  },
  {
    id: '2',
    slug: 'evening-wear',
    name: 'Roupa de Gala',
    description: 'Peças sofisticadas para momentos especiais',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    gender: 'Mulher',
  },
  {
    id: '3',
    slug: 'business-attire',
    name: 'Roupa Social',
    description: 'Excelência profissional em cada ponto',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    gender: 'Homem',
  },
  {
    id: '4',
    slug: 'custom-tailoring',
    name: 'Alfaiataria Sob Medida',
    description: 'Peças sob medida feitas exclusivamente',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80',
    gender: 'Homem',
  },
  {
    id: '5',
    slug: 'accessories',
    name: 'Acessórios',
    description: 'Toques finais perfeitos',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    gender: 'Unissex',
  },
  {
    id: '6',
    slug: 'limited-edition',
    name: 'Edição Limitada',
    description: 'Peças exclusivas para conhecedores',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    gender: 'Mulher',
  },
];

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>(fallbackCollections);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/collections`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setCollections(data);
        }
      }
    } catch (error) {
      console.log('Using fallback collections');
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionClick = (slug: string) => {
    navigate(`/collection/${slug}`);
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
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => handleCollectionClick(collection.slug)}
                >
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-6">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    
                    {/* Gender Tag */}
                    <span className="absolute top-4 left-4 px-3 py-1 bg-background/80 backdrop-blur-sm rounded text-xs tracking-widest uppercase text-primary">
                      {collection.gender}
                    </span>
                    
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
                      {collection.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {collection.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
