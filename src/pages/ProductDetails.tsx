import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/config';
import { Loader2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  price: number;
  image: string;
  image_hover?: string;
  gallery?: string[];
  collection: string;
  gender: string;
}

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const { addToCart } = useCart();
  const { language } = useLanguage();

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      // In a real app, you would have a specific endpoint for fetching a single product
      // For now, we'll fetch all and find the one we need, or use a specific endpoint if available
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (response.ok) {
        const allProducts: Product[] = await response.json();
        const foundProduct = allProducts.find(p => p.id === Number(id));
        
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedImage(foundProduct.image);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-20 flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-display mb-4">Produto não encontrado</h1>
          <Button asChild>
            <Link to="/collections">Voltar para Coleções</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const name = language === 'pt' ? product.name : product.name_en;
  const description = language === 'pt' ? product.description : product.description_en;

  // Create an array of images for the gallery
  const images = [product.image];
  if (product.image_hover) {
    images.push(product.image_hover);
  }

  return (
    <Layout>
      <div className="container py-20">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/collections" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {language === 'pt' ? 'Voltar para Coleções' : 'Back to Collections'}
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-[3/4] overflow-hidden bg-gray-100 rounded-sm relative"
            >
              <img 
                src={selectedImage} 
                alt={name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-24 h-32 flex-shrink-0 overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-primary' : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-2 text-sm uppercase tracking-widest text-muted-foreground">
                {product.collection}
              </div>
              <h1 className="text-4xl md:text-5xl font-display text-primary mb-6">
                {name}
              </h1>
              
              <div className="text-2xl font-light mb-8">
                {(product.price / 100).toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </div>

              <div className="prose prose-invert max-w-none mb-10 text-muted-foreground">
                <p className="whitespace-pre-line text-lg leading-relaxed">
                  {description}
                </p>
              </div>

              <Button 
                size="lg" 
                className="w-full md:w-auto min-w-[200px] text-lg h-14"
                onClick={() => addToCart({
                  id: product.id,
                  name: language === 'pt' ? product.name : product.name_en,
                  price: product.price,
                  image: product.image,
                  quantity: 1
                })}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {language === 'pt' ? 'Adicionar ao Carrinho' : 'Add to Cart'}
              </Button>

              {/* Additional Info / Specs could go here */}
              <div className="mt-12 border-t pt-8 space-y-4">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-muted-foreground">{language === 'pt' ? 'Gênero' : 'Gender'}</span>
                  <span className="capitalize">
                    {product.gender === 'men' ? (language === 'pt' ? 'Masculino' : 'Men') : 
                     product.gender === 'women' ? (language === 'pt' ? 'Feminino' : 'Women') : 
                     (language === 'pt' ? 'Unissex' : 'Unisex')}
                  </span>
                </div>
                {/* Add more specs as needed */}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}