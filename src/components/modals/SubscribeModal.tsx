import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { API_BASE_URL } from '@/lib/config';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    profession: '',
    email: '',
    confirmEmail: '',
    phone: '',
    style: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.email !== formData.confirmEmail) {
      setError(t.modal.confirmEmail);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/request-evaluation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          profession: formData.profession,
          style: formData.style,
          email: formData.email,
          phone: formData.phone,
          status: 'pending',
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError('Error submitting request');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: '',
        profession: '',
        email: '',
        confirmEmail: '',
        phone: '',
        style: '',
      });
      setError('');
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full z-50 overflow-y-auto"
          >
            <div className="luxury-card p-8 md:p-10">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {submitted ? (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl mb-4 text-primary">
                    {t.modal.successTitle}
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    {t.modal.successMessage}
                  </p>
                  <Button variant="luxury" onClick={handleClose}>
                    OK
                  </Button>
                </motion.div>
              ) : (
                /* Form */
                <>
                  <div className="text-center mb-8">
                    <p className="text-xs tracking-widest text-primary/60 uppercase mb-2">
                      {t.modal.brand}
                    </p>
                    <h2 className="font-display text-2xl md:text-3xl tracking-wide text-primary mb-4">
                      {t.modal.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t.modal.description}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm text-muted-foreground">
                        {t.modal.fullName}
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="bg-background/50 border-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profession" className="text-sm text-muted-foreground">
                        {t.modal.profession}
                      </Label>
                      <Input
                        id="profession"
                        name="profession"
                        value={formData.profession}
                        onChange={handleChange}
                        required
                        className="bg-background/50 border-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm text-muted-foreground">
                          {t.modal.email}
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="bg-background/50 border-primary/20 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmEmail" className="text-sm text-muted-foreground">
                          {t.modal.confirmEmail}
                        </Label>
                        <Input
                          id="confirmEmail"
                          name="confirmEmail"
                          type="email"
                          value={formData.confirmEmail}
                          onChange={handleChange}
                          required
                          className="bg-background/50 border-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm text-muted-foreground">
                        {t.modal.phone}
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="bg-background/50 border-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="style" className="text-sm text-muted-foreground">
                        {t.modal.styleDescription}
                      </Label>
                      <Textarea
                        id="style"
                        name="style"
                        value={formData.style}
                        onChange={handleChange}
                        rows={4}
                        required
                        className="bg-background/50 border-primary/20 focus:border-primary resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-destructive text-sm text-center">{error}</p>
                    )}

                    <Button
                      type="submit"
                      variant="luxury"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading...
                        </>
                      ) : (
                        t.modal.submit
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
