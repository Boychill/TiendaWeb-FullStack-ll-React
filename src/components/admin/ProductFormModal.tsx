import { useState, useEffect } from 'react';
import { Product } from '../../types/product';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: Product) => void;
    initialData?: Product | null;
}

export function ProductFormModal({ isOpen, onClose, onSubmit, initialData }: ProductFormModalProps) {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        price: 0,
        category: '',
        description: '',
        stock: 0,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1598&ixlib=rb-4.0.3']
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                price: 0,
                category: '',
                description: '',
                stock: 0,
                // Default placeholder image
                images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1598&ixlib=rb-4.0.3']
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!formData.name || !formData.price || !formData.category) return;

        const productSubmission = {
            id: initialData?.id || crypto.randomUUID(),
            name: formData.name,
            price: Number(formData.price),
            category: formData.category,
            description: formData.description || '',
            stock: Number(formData.stock),
            images: formData.images || [],
            slug: formData.name.toLowerCase().replace(/ /g, '-'),
            parentId: formData.parentId // If dealing with variants
        } as Product;

        onSubmit(productSubmission);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in slide-in-from-bottom-8">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <Input
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej: Camiseta Oversize"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio (CLP)</label>
                            <Input
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                placeholder="9990"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <Input
                                type="number"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                                placeholder="10"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría (slug)</label>
                        <Input
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            placeholder="tecnologia, ropa, accesorios..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-all focus:ring-2 focus:ring-primary-100 focus:border-primary-400 min-h-[100px] p-3 text-sm"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detalle del producto..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL Imagen</label>
                        <Input
                            value={formData.images?.[0] || ''}
                            onChange={e => setFormData({ ...formData, images: [e.target.value] })}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">{initialData ? 'Guardar Cambios' : 'Crear Producto'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
