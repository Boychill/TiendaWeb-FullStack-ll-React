import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Minus, Plus, ShoppingCart, Truck, ShieldCheck } from 'lucide-react';

export function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getProductById } = useProducts();
    const { addToCart } = useCart();

    // Check if ID is defined before using it
    // In real scenario, handle fetch/loading
    const product = id ? getProductById(id) : undefined;

    const [selectedImage, setSelectedImage] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<{ size?: string; color?: string }>({});

    useEffect(() => {
        if (product) {
            setSelectedImage(product.images[0]);
            // Initialize variants selection if applicable
            if (product.variants) {
                const initialOpts: any = {};
                if (product.variants.color) initialOpts.color = product.variants.color; // Simplified: assumes single option for now or map
                // Actually our variants structure in Product type is simple key-value for ONE variant
                // If we want multiple choices we need a different structure. 
                // The prompt/plan said 'variants (metadata like { color: "Red", size: "M" })'.
                // If it represents AVAILABLE options, it should be arrays. 
                // But the current JSON has single values, implying each ID is a specific variant or it's just metadata.
                // For MVP, lets assume these are the Defaults/Only options for this specific SKU.
                setSelectedOptions(product.variants);
            }
        }
    }, [product]);

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
                <Button onClick={() => navigate('/shop')}>Volver al Catálogo</Button>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedOptions);
        // Maybe show toast
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" className="mb-8" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} className="mr-2" /> Volver
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply p-8"
                        />
                    </div>
                    {product.images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-20 h-20 rounded-xl border-2 flex-shrink-0 overflow-hidden ${selectedImage === img ? 'border-gray-900' : 'border-transparent'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="uppercase tracking-wide">{product.category}</Badge>
                            {product.stock > 0 ? (
                                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" /> Stock Disponible
                                </span>
                            ) : (
                                <span className="text-red-600 text-sm font-medium">Agotado</span>
                            )}
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                        <p className="text-gray-500 text-lg leading-relaxed">{product.description}</p>
                    </div>

                    <div className="text-3xl font-bold text-gray-900">
                        ${product.price.toLocaleString('es-CL')}
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Quantity & Actions */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-200 rounded-xl">
                                <button
                                    className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="w-12 text-center font-bold">{quantity}</span>
                                <button
                                    className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    onClick={() => setQuantity(q => q + 1)}
                                    disabled={quantity >= product.stock}
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            <Button
                                size="lg"
                                className="flex-1 text-lg h-14"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                <ShoppingCart className="mr-2" /> Agregar al Carro
                            </Button>
                        </div>
                    </div>

                    {/* Features / Trust */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                            <Truck className="text-gray-900 mt-1" />
                            <div>
                                <h4 className="font-bold text-sm">Despacho Rápido</h4>
                                <p className="text-xs text-gray-500 mt-1">Envíos a todo Chile asegurados.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                            <ShieldCheck className="text-gray-900 mt-1" />
                            <div>
                                <h4 className="font-bold text-sm">Garantía Total</h4>
                                <p className="text-xs text-gray-500 mt-1">3 meses de garantía por fallas.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
