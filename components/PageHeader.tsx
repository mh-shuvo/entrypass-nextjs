export default function PageHeader({ pageName, feature, children }: { pageName: string; feature?: string, children?: React.ReactNode }) {
  const featureText = feature ? feature : `${pageName} management`;
    return (
    <div className="flex flex-col gap-5 border-b border-zinc-200 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">
            {featureText}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">{pageName}</h1>
        </div>
        {
            children && (
                <div className="flex flex-col gap-3 sm:flex-row">
                    {children}
                </div>
            )
        }
        
      </div>
  );
}