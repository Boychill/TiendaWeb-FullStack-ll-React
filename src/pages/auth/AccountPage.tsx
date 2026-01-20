import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Package, User as UserIcon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AccountPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
            const allOrders = JSON.parse(storedOrders);
            // Filter by user ID if we have multi-user support, otherwise show all for simplified MVP or just this user's
            // Context says data is local, so 'orders' likely contains all orders from this browser.
            // If we want to filter by user:
            if (user) {
                const userOrders = allOrders.filter((o: any) => o.userId === user.id);
                setOrders(userOrders);
            }
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    }

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mi Cuenta</h1>
                        <p className="text-gray-500">Bienvenido, {user.name}</p>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut size={16} className="mr-2" /> Cerrar Sesión
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* User Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-primary-100 text-primary-700 rounded-full">
                                    <UserIcon size={24} />
                                </div>
                                <h3 className="font-bold text-lg">Perfil</h3>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                            <div className="space-y-2 mt-4">
                                <p className="text-sm text-gray-500">Rol</p>
                                <Badge variant="secondary" className="uppercase">{user.role}</Badge>
                            </div>
                        </div>
                    </div>

                    {/* Orders */}
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Package size={20} /> Historial de Pedidos
                        </h2>

                        {orders.length === 0 ? (
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
                                <p className="text-gray-500">No tienes pedidos recientes.</p>
                                <Button variant="link" onClick={() => navigate('/shop')} className="mt-2">
                                    Ir a comprar
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="font-bold text-gray-900">Pedido #{order.id.slice(0, 8)}</p>
                                                <p className="text-gray-500 text-sm">{new Date(order.date).toLocaleDateString()}</p>
                                            </div>
                                            <Badge variant={order.status === 'delivered' ? 'success' : 'default'} className="capitalize">
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center text-sm border-t pt-4">
                                            <span className="text-gray-600">{order.items.length} productos</span>
                                            <span className="font-bold text-lg">${order.total.toLocaleString('es-CL')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
