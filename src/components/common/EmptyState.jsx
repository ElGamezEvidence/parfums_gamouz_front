import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title,
  subtitle,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-14 bg-brand-cream-dark/40 border border-brand-black/5 ${className}`}>
      <div className="w-16 h-16 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold mb-6">
        <Icon className="w-8 h-8" />
      </div>
      {title && (
        <h3 className="font-serif text-xl md:text-2xl text-brand-black mb-2">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-sm text-brand-muted max-w-md font-light leading-relaxed mb-6">
          {subtitle}
        </p>
      )}
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionText}
        </Button>
      )}
    </div>
  );
};

