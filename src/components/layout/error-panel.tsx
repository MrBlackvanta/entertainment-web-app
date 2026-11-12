interface ErrorPanelProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ErrorPanel({
  title,
  description,
  children,
}: ErrorPanelProps) {
  return (
    <div className="m-auto w-full max-w-100 rounded-card bg-surface p-6 md:rounded-card-lg md:p-8">
      <h1 className="text-heading-lg">{title}</h1>
      <p className="mt-6 mb-10 text-body text-ink/75">{description}</p>
      {children}
    </div>
  );
}
