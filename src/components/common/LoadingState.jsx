import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Chargement en cours...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center min-h-[250px] ${className}`}>
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-brand-gold/20 animate-ping absolute inset-0" />
        <div className="w-12 h-12 rounded-full border-2 border-brand-gold border-t-transparent animate-spin flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-brand-gold" />
        </div>
      </div>
      <p className="text-xs uppercase tracking-luxury text-brand-muted mt-2 font-light">
        {message}
      </p>
    </div>
  );
};

