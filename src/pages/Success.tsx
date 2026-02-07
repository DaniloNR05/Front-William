import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Success() {
  const { t } = useLanguage();
  const payment = t.payment.success;

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-4"
        >
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          
          <h1 className="font-display text-3xl text-primary tracking-wide mb-4">
            {payment.title}
          </h1>
          
          <p className="text-muted-foreground mb-8">
            {payment.message}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="luxury">{payment.backHome}</Button>
            </Link>
            <Link to="/collections">
              <Button variant="outline">{payment.viewCollections}</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
