import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'start',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium uppercase text-xs tracking-luxury transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-brand-black text-brand-cream border border-brand-charcoal hover:border-brand-gold hover:bg-brand-dark shadow-sm hover:shadow-gold-glow',
    gold: 'bg-brand-gold text-brand-black border border-brand-gold-dark hover:bg-brand-gold-light font-semibold shadow-md',
    outline: 'bg-transparent text-brand-black border border-brand-black/30 hover:border-brand-black hover:bg-brand-black/5',
    'outline-gold': 'bg-transparent text-brand-gold border border-brand-gold/60 hover:border-brand-gold hover:bg-brand-gold/10',
    ghost: 'bg-transparent text-brand-black hover:bg-brand-black/5',
    whatsapp: 'bg-[#25D366] text-white hover:bg-[#1EBE5D] shadow-md hover:shadow-lg',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3.5 text-xs',
    lg: 'px-8 py-4 text-xs tracking-widest',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin me-2" />
      ) : Icon && iconPosition === 'start' ? (
        <Icon className="w-4 h-4 me-2.5 shrink-0" />
      ) : null}

      <span>{children}</span>

      {!isLoading && Icon && iconPosition === 'end' ? (
        <Icon className="w-4 h-4 ms-2.5 shrink-0" />
      ) : null}
    </button>
  );
};

