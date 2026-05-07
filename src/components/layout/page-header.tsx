type PageHeaderProps = {
  title: string;
  subtitle?: string | React.ReactNode;
  actions?: React.ReactNode;
};

function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-7">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
        <div className="min-w-0">
          <h1 className="text-[22px] font-semibold text-(--text)">{title}</h1>
          {subtitle && <p className="mt-1 text-(--text-sec) text-sm">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2 md:shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

export default PageHeader;
