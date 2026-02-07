import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, User, Check, X, Edit2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth, User as UserType } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/lib/config';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cpf: user?.cpf || '',
    description: user?.description || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser as UserType);
        toast({
          title: t.profile.updateSuccess,
        });
        setIsEditing(false);
      } else {
        throw new Error();
      }
    } catch (error) {
      toast({
        title: t.profile.updateError,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      cpf: user?.cpf || '',
      description: user?.description || '',
    });
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="pt-24 md:pt-32 pb-16">
        <div className="luxury-container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-6">
                <User className="h-12 w-12 text-primary" />
              </div>
              <h1 className="font-display text-3xl text-primary tracking-wide mb-2">
                {t.profile.title}
              </h1>
              <p className="text-muted-foreground">{t.profile.subtitle}</p>
            </div>

            {/* Profile Card */}
            <div className="luxury-card p-8">
              {/* Header with Edit Button */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-xl text-foreground">
                  {t.profile.personalInfo}
                </h2>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    {t.profile.edit}
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    {t.profile.nameLabel}
                  </Label>
                  {isEditing ? (
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.profile.namePlaceholder}
                      className="bg-background/50 border-primary/20"
                    />
                  ) : (
                    <p className="text-foreground py-2">{user?.name || t.profile.notProvided}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    {t.profile.emailLabel}
                  </Label>
                  <p className="text-foreground py-2">{user?.email}</p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    {t.profile.phoneLabel}
                  </Label>
                  {isEditing ? (
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t.profile.phonePlaceholder}
                      className="bg-background/50 border-primary/20"
                    />
                  ) : (
                    <p className="text-foreground py-2">
                      {user?.phone || t.profile.notProvided}
                    </p>
                  )}
                </div>

                {/* CPF */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    {t.profile.cpfLabel}
                  </Label>
                  {isEditing ? (
                    <Input
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      placeholder={t.profile.cpfPlaceholder}
                      className="bg-background/50 border-primary/20"
                    />
                  ) : (
                    <p className="text-foreground py-2">
                      {user?.cpf || t.profile.notProvided}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    {t.profile.descriptionLabel}
                  </Label>
                  {isEditing ? (
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder={t.profile.descriptionPlaceholder}
                      rows={4}
                      className="bg-background/50 border-primary/20 resize-none"
                    />
                  ) : (
                    <p className="text-foreground py-2">
                      {user?.description || t.profile.descriptionNone}
                    </p>
                  )}
                </div>

                {/* Edit Actions */}
                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      {t.profile.cancel}
                    </Button>
                    <Button
                      variant="luxury"
                      onClick={handleSave}
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          {t.profile.saving}
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          {t.profile.save}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Account Status */}
            <div className="luxury-card p-8 mt-8">
              <h2 className="font-display text-xl text-foreground mb-6">
                {t.profile.accountSettings}
              </h2>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t.profile.accountStatus}</span>
                <span className={`flex items-center gap-2 ${user?.isApproved ? 'text-green-500' : 'text-yellow-500'}`}>
                  {user?.isApproved ? (
                    <>
                      <Check className="h-4 w-4" />
                      {t.profile.approved}
                    </>
                  ) : (
                    <>
                      <span className="animate-pulse">●</span>
                      {t.profile.pending}
                    </>
                  )}
                </span>
              </div>

              <div className="gold-divider my-6" />

              <Button
                variant="outline"
                onClick={logout}
                className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                {t.nav.logout}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
