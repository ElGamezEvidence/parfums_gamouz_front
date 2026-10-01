import React from 'react';

export const SectionTitle = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
  titleClassName = '',
}) => {
  const alignments = {
    center: 'text-center items-center',
    start: 'text-start items-start',
    end: 'text-end items-end',
  };

  return (
    <div className={`flex flex-col ${alignments[align] || alignments.center} mb-12 md:mb-16 ${className}`}>
      {badge && (
        <span className="text-[11px] font-semibold tracking-luxury uppercase text-brand-gold mb-3">
          {badge}
        </span>
      )}
      {title && (
        <h2 className={`font-serif text-3xl md:text-4xl lg:text-5xl text-brand-black tracking-tight leading-tight ${titleClassName}`}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-4 text-sm md:text-base text-brand-muted max-w-2xl font-light leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={`w-12 h-[1.5px] bg-brand-gold/60 mt-6 ${align === 'center' ? 'mx-auto' : ''}`} />
    </div>
  );
};

