import Logo from '@/components/atoms/Logo';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-cream-50">
      <div className="mb-6 flex flex-col items-center">
        <Logo className="scale-110 mb-2" />
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
          Al Nader Customer Portal
        </span>
      </div>

      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/85 shadow-lg animate-scale-in">
        {children}
      </div>
    </div>
  );
}
