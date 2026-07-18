import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CarFront, Eye, EyeOff, Loader2, ArrowRight, User } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ─── Schemas ────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

// ─── Component ──────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPass, setShowPass] = useState(false);
  const { login, register: registerFn } = useAuth();
  const [, setLocation] = useLocation();

  // ── Login form
  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  async function onLogin(values: LoginForm) {
    try {
      await login(values.email, values.password);
      toast.success('Bem-vindo de volta! 👋');
      setLocation('/dashboard');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao entrar');
    }
  }

  async function onRegister(values: RegisterForm) {
    try {
      await registerFn(values.name, values.email, values.password);
      toast.success('Conta criada com sucesso! 🎉');
      setLocation('/dashboard');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao criar conta');
    }
  }

  const isLoginLoading = loginForm.formState.isSubmitting;
  const isRegisterLoading = registerForm.formState.isSubmitting;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* ── Background glow ─────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* ── Logo ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="w-16 h-16 rounded-3xl bg-primary/15 flex items-center justify-center mb-4 rotate-3 hover:rotate-0 transition-transform">
            <CarFront className="w-9 h-9 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-foreground">RumoCarta</h1>
          <p className="text-muted-foreground mt-1 text-center">
            A tua carta começa aqui. Guarda o teu progresso.
          </p>
        </motion.div>

        {/* ── Card ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/80 backdrop-blur-xl border border-border/60 rounded-3xl shadow-2xl shadow-black/10 p-8"
        >
          {/* Tabs */}
          <div className="flex bg-muted rounded-2xl p-1 mb-8">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  tab === t
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'login' ? 'Entrar' : 'Criar Conta'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'login' ? (
              /* ── Login Form ─────────────────────────────────── */
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="o.teu@email.com"
                    className="h-12 rounded-xl"
                    {...loginForm.register('email')}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-xs text-destructive">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Palavra-passe</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="h-12 rounded-xl pr-12"
                      {...loginForm.register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                  disabled={isLoginLoading}
                >
                  {isLoginLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Entrar <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Ainda não tens conta?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('register')}
                    className="text-primary font-bold hover:underline"
                  >
                    Cria uma agora
                  </button>
                </p>
              </motion.form>
            ) : (
              /* ── Register Form ──────────────────────────────── */
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={registerForm.handleSubmit(onRegister)}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Nome</Label>
                  <div className="relative">
                    <Input
                      id="reg-name"
                      placeholder="O teu nome"
                      className="h-12 rounded-xl pl-12"
                      {...registerForm.register('name')}
                    />
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                  {registerForm.formState.errors.name && (
                    <p className="text-xs text-destructive">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="o.teu@email.com"
                    className="h-12 rounded-xl"
                    {...registerForm.register('email')}
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-xs text-destructive">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password">Palavra-passe</Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPass ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      className="h-12 rounded-xl pr-12"
                      {...registerForm.register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-xs text-destructive">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                  disabled={isRegisterLoading}
                >
                  {isRegisterLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Criar Conta <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Já tens conta?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="text-primary font-bold hover:underline"
                  >
                    Entrar
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Skip login ──────────────────────────────────────── */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Preferes continuar sem conta?{' '}
          <a href="/" className="text-primary font-bold hover:underline">
            Aceder como convidado
          </a>
        </p>
      </div>
    </div>
  );
}
