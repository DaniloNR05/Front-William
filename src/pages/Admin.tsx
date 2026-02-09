import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { API_BASE_URL } from '@/lib/config';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';

interface Request {
  id: number;
  fullName: string;
  email: string;
  profession: string;
  phone: string;
  style: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

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

interface Collection {
  id: number;
  name_pt: string;
  name_en: string;
  slug: string;
  description_pt: string;
  description_en: string;
  image: string;
}

export default function Admin() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<string>('all');
  
  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    name_en: '',
    description: '',
    description_en: '',
    price: '',
    image: '',
    collection: '',
    gender: 'unisex'
  });

  // Collection Form State
  const [collectionForm, setCollectionForm] = useState({
    name_pt: '',
    name_en: '',
    slug: '',
    description_pt: '',
    description_en: '',
    image: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchRequests(), fetchProducts(), fetchCollections()]);
    setLoading(false);
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/evaluation-requests`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Failed to fetch requests', error);
      toast.error('Erro ao carregar solicitações');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
      toast.error('Erro ao carregar produtos');
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/collections`);
      if (response.ok) {
        const data = await response.json();
        setCollections(data);
      }
    } catch (error) {
      console.error('Failed to fetch collections', error);
      toast.error('Erro ao carregar coleções');
    }
  };

  // Request Handlers
  const handleApprove = async (id: number, email: string, fullName: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/approve-request/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName }),
      });

      if (response.ok) {
        toast.success('Solicitação aprovada com sucesso');
        fetchRequests();
      } else {
        toast.error('Erro ao aprovar solicitação');
      }
    } catch (error) {
      console.error('Error approving request', error);
      toast.error('Erro ao aprovar solicitação');
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reject-request/${id}`, { method: 'POST' });
      if (response.ok) {
        toast.success('Solicitação rejeitada');
        fetchRequests();
      } else {
        toast.error('Erro ao rejeitar solicitação');
      }
    } catch (error) {
      console.error('Error rejecting request', error);
      toast.error('Erro ao rejeitar solicitação');
    }
  };

  // Product Handlers
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct 
        ? `${API_BASE_URL}/api/products/${editingProduct.id}`
        : `${API_BASE_URL}/api/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        toast.success(editingProduct ? 'Produto atualizado!' : 'Produto criado!');
        setIsProductModalOpen(false);
        setEditingProduct(null);
        setProductForm({
          name: '', name_en: '', description: '', description_en: '',
          price: '', image: '', collection: '', gender: 'unisex'
        });
        fetchProducts();
      } else {
        toast.error('Erro ao salvar produto');
      }
    } catch (error) {
      console.error('Error saving product', error);
      toast.error('Erro ao salvar produto');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Produto excluído');
        fetchProducts();
      } else {
        toast.error('Erro ao excluir produto');
      }
    } catch (error) {
      console.error('Error deleting product', error);
      toast.error('Erro ao excluir produto');
    }
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        name_en: product.name_en,
        description: product.description,
        description_en: product.description_en,
        price: product.price.toString(),
        image: product.image,
        collection: product.collection,
        gender: product.gender
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '', name_en: '', description: '', description_en: '',
        price: '', image: '', collection: '', gender: 'unisex'
      });
    }
    setIsProductModalOpen(true);
  };

  // Collection Handlers
  const handleCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCollection 
        ? `${API_BASE_URL}/api/collections/${editingCollection.id}`
        : `${API_BASE_URL}/api/collections`;
      
      const method = editingCollection ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectionForm),
      });

      if (response.ok) {
        toast.success(editingCollection ? 'Coleção atualizada!' : 'Coleção criada!');
        setIsCollectionModalOpen(false);
        setEditingCollection(null);
        setCollectionForm({
          name_pt: '', name_en: '', slug: '', description_pt: '', description_en: '', image: ''
        });
        fetchCollections();
      } else {
        toast.error('Erro ao salvar coleção');
      }
    } catch (error) {
      console.error('Error saving collection', error);
      toast.error('Erro ao salvar coleção');
    }
  };

  const handleDeleteCollection = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta coleção?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/collections/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Coleção excluída');
        fetchCollections();
      } else {
        toast.error('Erro ao excluir coleção');
      }
    } catch (error) {
      console.error('Error deleting collection', error);
      toast.error('Erro ao excluir coleção');
    }
  };

  const openCollectionModal = (collection?: Collection) => {
    if (collection) {
      setEditingCollection(collection);
      setCollectionForm({
        name_pt: collection.name_pt,
        name_en: collection.name_en,
        slug: collection.slug,
        description_pt: collection.description_pt,
        description_en: collection.description_en,
        image: collection.image || ''
      });
    } else {
      setEditingCollection(null);
      setCollectionForm({
        name_pt: '', name_en: '', slug: '', description_pt: '', description_en: '', image: ''
      });
    }
    setIsCollectionModalOpen(true);
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

  return (
    <Layout>
      <div className="container py-20">
        <div className="mb-8">
          <h1 className="text-3xl font-display text-primary mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie solicitações, produtos e coleções.</p>
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="mb-8 w-full justify-start bg-transparent border-b rounded-none p-0 h-auto">
            <TabsTrigger 
              value="requests"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Solicitações
            </TabsTrigger>
            <TabsTrigger 
              value="products"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Produtos
            </TabsTrigger>
            <TabsTrigger 
              value="collections"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Coleções
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <div className="bg-card border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Profissão</TableHead>
                    <TableHead className="w-[200px]">Motivo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Nenhuma solicitação encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>{new Date(req.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{req.fullName}</TableCell>
                        <TableCell>{req.email}</TableCell>
                        <TableCell>{req.phone}</TableCell>
                        <TableCell>{req.profession}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={req.style}>{req.style}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            req.status === 'approved' ? 'bg-green-100 text-green-800' :
                            req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {req.status === 'approved' ? 'Aprovado' :
                             req.status === 'rejected' ? 'Rejeitado' :
                             'Pendente'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {req.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="default"
                                className="bg-green-600 hover:bg-green-700 h-8 px-2"
                                onClick={() => handleApprove(req.id, req.email, req.fullName)}
                              >
                                Aprovar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                className="h-8 px-2"
                                onClick={() => handleReject(req.id)}
                              >
                                Rejeitar
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold">Gerenciar Produtos</h2>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Select 
                  value={selectedCollectionFilter} 
                  onValueChange={setSelectedCollectionFilter}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por Coleção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Coleções</SelectItem>
                    {collections.map(c => (
                      <SelectItem key={c.id} value={c.name_en}>{c.name_pt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => openProductModal()} className="gap-2 whitespace-nowrap">
                  <Plus className="h-4 w-4" /> Novo Produto
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter(p => selectedCollectionFilter === 'all' || p.collection === selectedCollectionFilter)
                .map((product) => (
                <div key={product.id} className="bg-card border rounded-lg overflow-hidden flex flex-col">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {product.collection}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold line-clamp-1" title={product.name}>{product.name}</h3>
                      <span className="font-mono text-sm">
                        {(product.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {product.description}
                    </p>
                    <div className="flex justify-end gap-2 pt-2 border-t mt-auto">
                      <Button variant="outline" size="sm" onClick={() => openProductModal(product)}>
                        <Pencil className="h-4 w-4 mr-1" /> Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="collections">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gerenciar Coleções</h2>
              <Button onClick={() => openCollectionModal()} className="gap-2">
                <Plus className="h-4 w-4" /> Nova Coleção
              </Button>
            </div>

            <div className="bg-card border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome (PT)</TableHead>
                    <TableHead>Nome (EN)</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="w-[300px]">Descrição (PT)</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell className="font-medium">{collection.name_pt}</TableCell>
                      <TableCell>{collection.name_en}</TableCell>
                      <TableCell className="font-mono text-xs">{collection.slug}</TableCell>
                      <TableCell className="max-w-[300px] truncate" title={collection.description_pt}>
                        {collection.description_pt}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-8 px-2"
                          onClick={() => openCollectionModal(collection)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="h-8 px-2"
                          onClick={() => handleDeleteCollection(collection.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Product Modal */}
        <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome (PT)</Label>
                  <Input 
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome (EN)</Label>
                  <Input 
                    value={productForm.name_en}
                    onChange={(e) => setProductForm({...productForm, name_en: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preço (centavos)</Label>
                  <Input 
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Ex: 10000 = R$ 100,00</p>
                </div>
                <div className="space-y-2">
                  <Label>Imagem URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={productForm.image}
                      onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                      required
                      placeholder="https://... ou upload"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        id="product-image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const formData = new FormData();
                          formData.append('file', file);

                          try {
                            const promise = fetch(`${API_BASE_URL}/api/upload`, {
                              method: 'POST',
                              body: formData,
                            }).then(async res => {
                              if (!res.ok) throw new Error('Upload falhou');
                              const data = await res.json();
                              setProductForm(prev => ({ ...prev, image: data.url }));
                              return data;
                            });

                            toast.promise(promise, {
                              loading: 'Enviando imagem...',
                              success: 'Imagem enviada com sucesso!',
                              error: 'Erro ao enviar imagem'
                            });
                          } catch (error) {
                            console.error('Upload error:', error);
                            toast.error('Erro ao fazer upload');
                          }
                          
                          e.target.value = '';
                        }}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        className="w-10 px-0"
                        onClick={() => document.getElementById('product-image-upload')?.click()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Coleção</Label>
                  <Select 
                    value={productForm.collection} 
                    onValueChange={(val) => setProductForm({...productForm, collection: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {collections.map(c => (
                        <SelectItem key={c.id} value={c.name_en}>{c.name_pt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gênero</Label>
                  <Select 
                    value={productForm.gender} 
                    onValueChange={(val) => setProductForm({...productForm, gender: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="men">Masculino</SelectItem>
                      <SelectItem value="women">Feminino</SelectItem>
                      <SelectItem value="unisex">Unissex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição (PT)</Label>
                <Textarea 
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição (EN)</Label>
                <Textarea 
                  value={productForm.description_en}
                  onChange={(e) => setProductForm({...productForm, description_en: e.target.value})}
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="submit">{editingProduct ? 'Salvar Alterações' : 'Criar Produto'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Collection Modal */}
        <Dialog open={isCollectionModalOpen} onOpenChange={setIsCollectionModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCollection ? 'Editar Coleção' : 'Nova Coleção'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCollectionSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome (PT)</Label>
                  <Input 
                    value={collectionForm.name_pt}
                    onChange={(e) => setCollectionForm({...collectionForm, name_pt: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome (EN)</Label>
                  <Input 
                    value={collectionForm.name_en}
                    onChange={(e) => setCollectionForm({...collectionForm, name_en: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Slug (URL amigável)</Label>
                <Input 
                  value={collectionForm.slug}
                  onChange={(e) => setCollectionForm({...collectionForm, slug: e.target.value})}
                  required
                  placeholder="ex: ternos-formais"
                />
              </div>

              <div className="space-y-2">
                <Label>Imagem URL (Capa)</Label>
                <div className="flex gap-2">
                  <Input 
                    value={collectionForm.image}
                    onChange={(e) => setCollectionForm({...collectionForm, image: e.target.value})}
                    placeholder="https://... ou faça upload"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      id="collection-image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const formData = new FormData();
                        formData.append('file', file);

                        try {
                          const promise = fetch(`${API_BASE_URL}/api/upload`, {
                            method: 'POST',
                            body: formData,
                          }).then(async res => {
                            if (!res.ok) throw new Error('Upload falhou');
                            const data = await res.json();
                            setCollectionForm(prev => ({ ...prev, image: data.url }));
                            return data;
                          });

                          toast.promise(promise, {
                            loading: 'Enviando imagem...',
                            success: 'Imagem enviada com sucesso!',
                            error: 'Erro ao enviar imagem'
                          });
                        } catch (error) {
                          console.error('Upload error:', error);
                          toast.error('Erro ao fazer upload');
                        }
                        
                        // Reset input
                        e.target.value = '';
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('collection-image-upload')?.click()}
                    >
                      Upload
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Cole uma URL externa ou faça upload de uma imagem do seu computador.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Descrição (PT)</Label>
                <Textarea 
                  value={collectionForm.description_pt}
                  onChange={(e) => setCollectionForm({...collectionForm, description_pt: e.target.value})}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição (EN)</Label>
                <Textarea 
                  value={collectionForm.description_en}
                  onChange={(e) => setCollectionForm({...collectionForm, description_en: e.target.value})}
                  rows={2}
                />
              </div>

              <DialogFooter>
                <Button type="submit">{editingCollection ? 'Salvar Alterações' : 'Criar Coleção'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
