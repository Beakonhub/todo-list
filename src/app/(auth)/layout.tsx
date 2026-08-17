export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-panel-muted px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center text-2xl font-bold">
          <span className="text-coral-500">Dash</span>board
        </div>
        <div className="rounded-2xl bg-panel p-8 shadow-sm">{children}</div>
      </div>
    </div>
  );
}
