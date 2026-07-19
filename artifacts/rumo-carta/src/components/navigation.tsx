import { Link, useLocation } from 'wouter';
import { useTheme } from 'next-themes';
import { 
  Home, 
  BookOpen, 
  Play, 
  LayoutGrid, 
  ChartBar, 
  Sun, 
  Moon, 
  CarFront, 
  User as UserIcon, 
  LogOut, 
  History 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, getInitials } from '@/contexts/auth';

export function Navigation({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/aprender', label: 'Aprender', icon: BookOpen },
    { href: '/simulado', label: 'Simulado', icon: Play, primary: true },
    { href: '/categorias', label: 'Categorias', icon: LayoutGrid },
    { href: '/historico', label: 'Histórico', icon: History },
    { href: '/dashboard', label: 'Dashboard', icon: ChartBar },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20 pb-20 md:pb-0 md:pt-16">
      {/* Desktop Top Navbar */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-6xl flex items-center justify-between px-4 h-full">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl transition-opacity hover:opacity-80" data-testid="link-home">
            <CarFront className="h-6 w-6" />
            <span>RumoCarta</span>
          </Link>
          
          <nav className="flex items-center gap-1 relative">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href) && item.href !== '/simulado');
              
              if (item.primary) {
                return (
                  <Link key={item.href} href={item.href} className="ml-2">
                    <Button className="gap-2 font-bold shadow-md shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              }

              return (
                <Link key={item.href} href={item.href}>
                  <Button variant={isActive ? "secondary" : "ghost"} className={`gap-2 ${isActive ? 'font-bold' : 'text-muted-foreground hover:text-foreground'}`}>
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}

            {/* Profile Avatar / Login Button */}
            {user ? (
              <div className="relative ml-2">
                <Button 
                  variant="ghost" 
                  className="gap-2 font-bold rounded-xl"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/25 text-primary flex items-center justify-center text-xs font-black border border-primary/20 shrink-0">
                    {getInitials(user.name)}
                  </div>
                  <span className="max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                </Button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-card border border-border/80 rounded-2xl p-2 shadow-xl z-50 space-y-1"
                      >
                        <div className="px-3 py-2 border-b border-border/40 mb-1">
                          <p className="font-bold text-sm truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl gap-2 h-10 font-bold"
                          onClick={() => {
                            logout();
                            setShowProfileMenu(false);
                            setLocation('/');
                          }}
                        >
                          <LogOut className="w-4 h-4" /> Sair
                        </Button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="ml-2">
                <Button variant="outline" className="gap-2 font-bold rounded-xl border-primary/30 hover:border-primary/60">
                  <UserIcon className="w-4 h-4" /> Entrar
                </Button>
              </Link>
            )}

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-10 h-10 ml-2 bg-muted/50 hover:bg-muted"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                data-testid="button-theme-toggle"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border/50 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));

            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-16 h-full gap-1" data-testid={`tab-${item.label}`}>
                <div className={`relative p-1 rounded-xl transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {isActive && (
                    <motion.div 
                      layoutId="mobile-active-tab"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-6 h-6 relative z-10" />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          
          {/* Mobile Login / User Profile icon tab */}
          <Link href={user ? "/dashboard" : "/login"} className="flex flex-col items-center justify-center w-16 h-full gap-1">
            <div className={`relative p-1.5 rounded-full transition-colors flex items-center justify-center ${location === '/login' ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}>
              {user ? (
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black border border-primary/25">
                  {getInitials(user.name)}
                </div>
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">
              {user ? "Perfil" : "Entrar"}
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
