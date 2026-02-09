import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/config';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface Product {
  id: number;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  price: number;
  image: string;
  collection: string;
  gender: string;
}

interface CollectionData {
  id: number;
  name_pt: string;
  name_en: string;
  slug: string;
  description_pt: string;
  description_en: string;
}

export default function Collection() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { language } = useLanguage();

  useEffect(() => {
    fetchCollectionData();
  }, [slug]);

  const fetchCollectionData = async () => {
    setLoading(true);
    try {
      // Fetch collection details
      let currentCollection: CollectionData | null = null;
      const collectionsRes = await fetch(`${API_BASE_URL}/api/collections`);
      if (collectionsRes.ok) {
        const collections: CollectionData[] = await collectionsRes.json();
        
        // Try exact match
        currentCollection = collections.find(c => c.slug === slug) || null;
        
        // Try case-insensitive match
        if (!currentCollection && slug) {
          currentCollection = collections.find(c => c.slug.toLowerCase() === slug.toLowerCase()) || null;
        }

        // Try matching by name (replacing hyphens with spaces) as fallback
        if (!currentCollection && slug) {
           const slugSpace = slug.replace(/-/g, ' ').toLowerCase();
           currentCollection = collections.find(c => 
               c.name_pt.toLowerCase() === slugSpace || 
               c.name_en.toLowerCase() === slugSpace
           ) || null;
        }

        setCollection(currentCollection);
      }

      // Fetch products
      const productsRes = await fetch(`${API_BASE_URL}/api/products`);
      if (productsRes.ok) {
        const allProducts: Product[] = await productsRes.json();
        
        if (currentCollection) {
             const filtered = allProducts.filter(p => {
                const productCollection = p.collection.toLowerCase().trim();
                const collectionNameEn = currentCollection!.name_en.toLowerCase().trim();
                const collectionNamePt = currentCollection!.name_pt.toLowerCase().trim();
                const slugName = slug?.replace(/-/g, ' ').toLowerCase().trim() || '';

                return productCollection === collectionNameEn || 
                       productCollection === collectionNamePt ||
                       productCollection === slugName;
             });
            setProducts(filtered);
        } else {
             // Fallback filtering if collection object isn't found but slug is
            const filtered = allProducts.filter(p => 
                p.collection.toLowerCase() === slug?.replace(/-/g, ' ')
            );
            setProducts(filtered);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

  if (!collection && products.length === 0) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-display mb-4">Coleção não encontrada</h1>
          <Button asChild>
            <Link to="/collections">Voltar para Coleções</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const name = language === 'pt' ? collection?.name_pt : collection?.name_en;
  const description = language === 'pt' ? collection?.description_pt : collection?.description_en;
  const displayName = name || slug?.replace(/-/g, ' ');

  return (
    <Layout>
      <div className="container py-20">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/collections" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {language === 'pt' ? 'Voltar para Coleções' : 'Back to Collections'}
          </Link>
        </Button>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display text-primary mb-4 capitalize">
            {displayName}
          </h1>
          {description && (
            <p className="text-muted-foreground max-w-2xl text-lg">
              {description}
            </p>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">
              {language === 'pt' 
                ? 'Nenhum produto encontrado nesta coleção.' 
                : 'No products found in this collection.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-4 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <Button 
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => addToCart({
                      id: product.id,
                      name: language === 'pt' ? product.name : product.name_en,
                      price: product.price,
                      image: product.image,
                      quantity: 1
                    })}
                  >
                    {language === 'pt' ? 'Adicionar' : 'Add to Cart'}
                  </Button>
                </div>
                <h3 className="font-display text-lg mb-1">
                  {language === 'pt' ? product.name : product.name_en}
                </h3>
                <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
                   {language === 'pt' ? product.description : product.description_en}
                </p>
                <p className="font-medium">
                  {(product.price / 100).toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
