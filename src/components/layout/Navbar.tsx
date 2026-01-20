import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { itemCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cerrar menú al cambiar de ruta
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    const navLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Catálogo', path: '/shop' },
    ];

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-white shadow-sm py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">

                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center space-x-2 group">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                                <span className="text-white font-bold text-xl">T</span>
                            </div>
                            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Tienda<span className="text-primary-600">Web</span></span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:ml-10 md:flex md:space-x-8">
                            {navLinks.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${location.pathname === link.path
                                        ? 'border-primary-600 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:text-primary-600 hover:border-primary-200'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Search Placeholder */}
                        <div className="relative hidden lg:block">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="bg-gray-100 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary-500 w-48 transition-all focus:w-64"
                            />
                            <Search className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                        </div>

                        <div className="h-6 w-px bg-gray-200"></div>

                        {/* Cart link - Keeping /cart if distinct page or modal. We haven't built /cart page but Requirements imply Checkout is the flow. 
                           However usually there is a Cart Review page. 
                           I'll assume /cart -> /checkout step 3 or let's just make it go to /checkout directly for MVP 
                           OR keep existing Cart page if it was good. 
                           The existing Cart.tsx was 7KB, likely good.
                           But I'll point to /checkout for now as "Proceso de Compra" 
                           Actually, standard is /cart view then checkout.
                           I'll check if I should keep /cart. User has Cart.tsx.
                           I'll leave /cart link as is for now, but update auth links.
                        */}
                        <Link to="/checkout" className="relative group p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <ShoppingCart className="h-6 w-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 text-xs font-bold leading-none text-white bg-red-500 rounded-full shadow-sm ring-2 ring-white animate-bounce">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="relative flex items-center space-x-4">
                                <Link
                                    to="/auth/account"
                                    className="flex items-center space-x-2 py-2 px-3 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center border border-primary-200">
                                        <UserIcon className="h-4 w-4 text-primary-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{user?.name}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-full hover:bg-red-50"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/auth/login" className="text-gray-600 hover:text-primary-600 font-medium transition-colors text-sm">
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to="/auth/register"
                                    className="bg-primary-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden gap-4">
                        <Link to="/checkout" className="relative p-1">
                            <ShoppingCart className="h-6 w-6 text-gray-600" />
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center h-5 w-5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 animate-slide-up">
                    <div className="pt-2 pb-6 space-y-1 px-4">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`block pl-3 pr-4 py-3 border-l-4 text-base font-medium rounded-r-md ${location.pathname === link.path
                                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="border-t border-gray-100 my-4 pt-4">
                            {!isAuthenticated && (
                                <div className="space-y-3">
                                    <Link to="/auth/login" className="block w-full text-center px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50">Iniciar Sesión</Link>
                                    <Link to="/auth/register" className="block w-full text-center px-4 py-3 bg-primary-600 rounded-xl text-white font-medium hover:bg-primary-700">Registrarse</Link>
                                </div>
                            )}
                            {isAuthenticated && (
                                <>
                                    <Link to="/auth/account" className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-50 text-gray-700">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                        <span>Mi Perfil ({user?.name})</span>
                                    </Link>
                                    <button onClick={handleLogout} className="w-full text-left flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-red-50 text-red-600">
                                        <LogOut className="h-5 w-5" />
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
