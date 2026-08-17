export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-board px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center font-display text-2xl font-bold uppercase tracking-wide text-strip">
          <span className="text-teal-500">Dash</span>board
        </div>
        <div className="rounded border border-board-line bg-board-raised p-8">{children}</div>
      </div>
    </div>
  );
}
