import React, { useState, useEffect } from 'react';
import { productsAPI, type Product } from '../../lib/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Package, Search, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { motion } from 'framer-motion';

// Quick preset image shortcuts for staff
const PRESET_IMAGES = [
  {
    label: 'Wheat Aata Sack',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Golden Wheat Grains',
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Pure Desi Ghee',
    url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Cold-Pressed Oil',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Farm Pulses / Dal',
    url: 'https://images.unsplash.com/photo-1585994192701-f1a505c817ea?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Fragrant Rice',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
  },
];

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    category: 'Aata & Flours',
    unit: '10 kg Pack',
    inStock: true,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(products);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, products]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      imageUrl: '',
      category: 'Aata & Flours',
      unit: '10 kg Pack',
      inStock: true,
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category || 'Aata & Flours',
      unit: product.unit || '10 kg Pack',
      inStock: product.inStock ?? true,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      toast.error('Please enter product name and price');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        imageUrl:
          formData.imageUrl.trim() ||
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        category: formData.category,
        unit: formData.unit,
        inStock: formData.inStock,
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, payload);
        toast.success(`Updated "${formData.name}"`);
      } else {
        await productsAPI.create(payload);
        toast.success(`Added "${formData.name}" to store catalog`);
      }

      setDialogOpen(false);
      resetForm();
      await loadProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await productsAPI.delete(deleteTarget.id);
      toast.success(`Deleted "${deleteTarget.name}"`);
      await loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6" data-testid="product-management">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: 'Playfair Display' }}>
            Product Catalog ({products.length})
          </h2>
          <p className="text-xs text-stone-500">
            Your staff can add, edit, or delete store products in real-time
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button
                className="bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold rounded-2xl text-xs h-9 px-4 shrink-0 shadow-sm cursor-pointer"
                data-testid="add-product-button"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle style={{ fontFamily: 'Playfair Display' }}>
                  {editingProduct ? 'Edit Product Details' : 'Add New Product (Staff)'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
                <div>
                  <Label htmlFor="prod-name">Product Name *</Label>
                  <Input
                    id="prod-name"
                    required
                    placeholder="e.g. Chakki Fresh Sharbati Aata (10kg)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 text-xs"
                    data-testid="product-name-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="prod-price">Price (₹ INR) *</Label>
                    <Input
                      id="prod-price"
                      type="number"
                      step="1"
                      required
                      placeholder="e.g. 480"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="mt-1 text-xs"
                      data-testid="product-price-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="prod-unit">Unit / Packaging</Label>
                    <Input
                      id="prod-unit"
                      placeholder="e.g. 10 kg Pack, 1 Litre, 1 kg"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="prod-category">Category</Label>
                  <select
                    id="prod-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="flex h-10 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1F7A4C] mt-1"
                  >
                    <option value="Aata & Flours">Aata & Flours</option>
                    <option value="Cold-Pressed Oils & Ghee">Cold-Pressed Oils & Ghee</option>
                    <option value="Dals & Pulses">Dals & Pulses</option>
                    <option value="Rice & Grains">Rice & Grains</option>
                    <option value="Daily Essentials">Daily Essentials</option>
                    <option value="Spices & Masalas">Spices & Masalas</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="prod-desc">Product Description & Benefits</Label>
                  <Textarea
                    id="prod-desc"
                    rows={3}
                    placeholder="e.g. Stone-ground slowly from pure MP Sharbati wheat. Retains natural wheat germ fiber for extra soft rotis."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 text-xs"
                    data-testid="product-description-input"
                  />
                </div>

                {/* Image URL & Preset Shortcuts */}
                <div>
                  <Label htmlFor="prod-img">Product Image URL</Label>
                  <Input
                    id="prod-img"
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="mt-1 text-xs"
                    data-testid="product-image-input"
                  />

                  {/* Preset Quick Select for Staff */}
                  <div className="mt-2">
                    <span className="text-[11px] text-stone-500 font-semibold block mb-1">
                      Or click a high-res photo preset:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_IMAGES.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                          className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            formData.imageUrl === preset.url
                              ? 'bg-[#1F7A4C] text-white border-[#1F7A4C]'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.imageUrl && (
                    <div className="mt-2.5 flex items-center gap-3 p-2 bg-[#FAF6F0] rounded-xl border border-stone-200">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="h-12 w-12 object-cover rounded-lg border border-stone-200"
                        onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                      />
                      <span className="text-[11px] text-[#1F7A4C] font-semibold">
                        Image preview loaded successfully
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold rounded-xl py-2.5 text-sm"
                    data-testid="save-product-button"
                  >
                    {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Publish Product to Store'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid or Empty State */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#1F7A4C] border-t-transparent" />
          <p className="mt-2 text-xs text-stone-500">Loading catalog...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3" data-testid="no-products">
          <div className="h-16 w-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Package className="h-8 w-8" />
          </div>
          <p className="text-base font-bold text-stone-800">Your store catalog is currently empty</p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Click the "Add Product" button above to list your stone-ground flours, oils, and grocery items.
          </p>
          <Button
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
            className="bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold rounded-2xl text-xs py-2 px-5 mt-2"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add First Product Now
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((prod) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              data-testid={`admin-product-${prod.id}`}
            >
              <div>
                <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                  <img
                    src={prod.imageUrl || '/logo.png'}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-[#2B090F]/90 text-[#F3E5AB] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                    {prod.category || 'Farm Staples'}
                  </span>
                  <span className="absolute top-2 right-2 bg-white/90 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {prod.unit || 'Pack'}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-sm text-stone-900 line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                    {prod.description}
                  </p>
                  <div className="text-lg font-black text-[#1F7A4C] mt-2">
                    ₹{prod.price}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="flex gap-2 pt-3 border-t border-stone-100">
                  <Button
                    onClick={() => handleEdit(prod)}
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl text-xs h-8 border-stone-200 hover:bg-stone-50 font-semibold"
                    data-testid={`edit-product-${prod.id}`}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => setDeleteTarget(prod)}
                    variant="destructive"
                    size="sm"
                    className="flex-1 rounded-xl text-xs h-8 font-semibold"
                    data-testid={`delete-product-${prod.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent data-testid="delete-product-confirm-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this item from the store? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="cancel-delete-product">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              data-testid="confirm-delete-product"
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
