import { LoginForm } from "../components/LoginForm";
export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-end justify-center p-6 md:p-10 bg-[url('/assets/login-screen.webp')] bg-cover bg-center overflow-hidden">
      {/* Vintage overlay layers */}
      <div className="absolute inset-0 bg-[#d9c3a5]/30 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.4)_100%)]" />

      {/* Optional subtle grain effect */}
      <div className="absolute inset-0 opacity-[0.1] bg-[url('/assets/noise-texture.png')] bg-repeat mix-blend-overlay pointer-events-none" />

      {/* Content */}
      <div className="relative w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
