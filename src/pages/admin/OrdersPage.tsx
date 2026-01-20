import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Check } from 'lucide-react';

export function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const loadOrders = () => {
            const stored = localStorage.getItem('orders');
            if (stored) {
                setOrders(JSON.parse(stored).reverse()); // Newest first
            }
        };
        loadOrders();
        window.addEventListener('storage', loadOrders); // Listen for changes ideally
        return () => window.removeEventListener('storage', loadOrders);
    }, []);

    const updateStatus = (orderId: string, newStatus: string) => {
        const updatedOrders = orders.map((o: any) => o.id === orderId ? { ...o, status: newStatus } : o);
        setOrders(updatedOrders);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
                <p className="text-gray-500">Gestiona los pedidos de los clientes.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">ID Pedido</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Cliente (ID)</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No hay pedidos registrados
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                                        <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-xs font-mono">{order.userId}</td>
                                        <td className="px-6 py-4 font-bold">${order.total.toLocaleString('es-CL')}</td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant={
                                                    order.status === 'delivered' ? 'success' :
                                                        order.status === 'shipped' ? 'secondary' :
                                                            order.status === 'cancelled' ? 'destructive' : 'default'
                                                }
                                                className="capitalize"
                                            >
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {order.status === 'pending' && (
                                                    <Button size="sm" onClick={() => updateStatus(order.id, 'shipped')} className="h-8 text-xs">
                                                        Marcar Enviado
                                                    </Button>
                                                )}
                                                {order.status === 'shipped' && (
                                                    <Button size="sm" variant="outline" onClick={() => updateStatus(order.id, 'delivered')} className="h-8 text-xs">
                                                        <Check size={12} className="mr-1" /> Entregado
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
