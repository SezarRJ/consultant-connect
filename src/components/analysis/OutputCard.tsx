import React from "react";

interface OutputCardProps {
  title: string;
  icon?: React.ReactNode;
  variant?: "default" | "amber" | "green" | "red" | "blue";
  children: React.ReactNode;
  className?: string;
}

export function OutputCard({ title, icon, variant = "default", children, className = "" }: OutputCardProps) {
  const variantClass = {
    default: "output-section",
    amber: "output-section-amber",
    green: "output-section-green",
    red: "output-section-red",
    blue: "output-section-blue",
  }[variant];

  const titleColor = {
    default: "hsl(210 40% 85%)",
    amber: "hsl(38 95% 60%)",
    green: "hsl(158 64% 55%)",
    red: "hsl(0 72% 68%)",
    blue: "hsl(217 91% 70%)",
  }[variant];

  return (
    <div className={`${variantClass} ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        {icon && <span style={{ color: titleColor }}>{icon}</span>}
        <h3 className="text-sm font-semibold font-display" style={{ color: titleColor }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

interface DataRowProps {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}

export function DataRow({ label, value, highlight }: DataRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b last:border-0" style={{ borderColor: "hsl(var(--border))" }}>
      <span className="text-xs font-medium shrink-0" style={{ color: "hsl(215 25% 55%)" }}>{label}</span>
      <span className={`text-sm text-right ${highlight ? "font-semibold" : "font-medium"}`}
        style={{ color: highlight ? "hsl(38 95% 60%)" : "hsl(210 40% 85%)" }}>
        {value}
      </span>
    </div>
  );
}

interface TagListProps {
  items: string[];
  variant?: "amber" | "green" | "red" | "blue" | "muted";
}

export function TagList({ items, variant = "muted" }: TagListProps) {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span key={i} className={`data-pill-${variant}`}>{item}</span>
      ))}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function SectionHeader({ title, subtitle, badge }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6 pb-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
      <div>
        <h2 className="text-lg font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>{title}</h2>
        {subtitle && <p className="text-sm mt-1" style={{ color: "hsl(215 25% 55%)" }}>{subtitle}</p>}
      </div>
      {badge && (
        <span className="data-pill-amber">{badge}</span>
      )}
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Generating Iraq market intelligence analysis..." }: LoadingStateProps) {
  return (
    <div className="rounded-xl p-8 text-center ai-thinking" style={{ border: "1px solid hsl(38 95% 52% / 0.2)" }}>
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="h-2 w-2 rounded-full animate-bounce" style={{ background: "hsl(38 95% 52%)", animationDelay: "0ms" }} />
        <div className="h-2 w-2 rounded-full animate-bounce" style={{ background: "hsl(38 95% 52%)", animationDelay: "150ms" }} />
        <div className="h-2 w-2 rounded-full animate-bounce" style={{ background: "hsl(38 95% 52%)", animationDelay: "300ms" }} />
      </div>
      <p className="text-sm font-medium" style={{ color: "hsl(38 95% 60%)" }}>{message}</p>
      <p className="text-xs mt-1" style={{ color: "hsl(215 25% 50%)" }}>Powered by AI · Iraq Market Database</p>
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl p-12 text-center" style={{ background: "hsl(var(--card))", border: "1px dashed hsl(var(--border))" }}>
      <div className="flex justify-center mb-4" style={{ color: "hsl(215 25% 45%)" }}>{icon}</div>
      <h3 className="text-base font-semibold font-display mb-1" style={{ color: "hsl(210 40% 75%)" }}>{title}</h3>
      <p className="text-sm" style={{ color: "hsl(215 25% 50%)" }}>{description}</p>
    </div>
  );
}
