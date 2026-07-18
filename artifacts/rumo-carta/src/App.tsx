import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/auth';

import Home from '@/pages/home';
import Simulado from '@/pages/simulado';
import Dashboard from '@/pages/dashboard';
import Categorias from '@/pages/categorias';
import Historico from '@/pages/historico';
import LoginPage from '@/pages/login';

import AprenderIndex from '@/pages/aprender/index';
import AprenderSinais from '@/pages/aprender/sinais';
import AprenderCodigo from '@/pages/aprender/codigo';
import AprenderSocorros from '@/pages/aprender/primeiros-socorros';
import AprenderMecanica from '@/pages/aprender/mecanica';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginPage} />
      <Route path="/historico" component={Historico} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/categorias" component={Categorias} />
      <Route path="/simulado" component={Simulado} />
      
      <Route path="/aprender" component={AprenderIndex} />
      <Route path="/aprender/sinais" component={AprenderSinais} />
      <Route path="/aprender/codigo" component={AprenderCodigo} />
      <Route path="/aprender/primeiros-socorros" component={AprenderSocorros} />
      <Route path="/aprender/mecanica" component={AprenderMecanica} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <AuthProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
            <Toaster position="top-center" richColors closeButton />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
