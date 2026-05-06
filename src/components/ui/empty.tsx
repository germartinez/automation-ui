'use client';

type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-6 text-(--text-sec)">
      <div className="text-6xl mb-3 opacity-40">{icon}</div>
      <div className="font-medium text-(--text) mb-1.5">{title}</div>
      <div className="text-md">{description}</div>
    </div>
  );
}

export default EmptyState;
