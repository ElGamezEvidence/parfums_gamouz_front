import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Home, Package, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { orderService } from '../services/orderService';
import { getOrderFollowupWhatsAppUrl } from '../utils/whatsapp';
import { Button } from '../components/common/Button';
import { formatPrice } from '../utils/formatters';

export const OrderSuccess = () => {
  const { language, isRtl, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const orderIdParam = searchParams.get('orderId');

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderIdParam) {
        const found = await orderService.getOrderById(orderIdParam);
        if (found) setOrder(found);
      } else {
        const last = await orderService.getLastOrder();
        if (last) setOrder(last);
      }
    };
    fetchOrder();
  }, [orderIdParam]);

  const displayOrderId = order?.orderId || orderIdParam || 'GZ-2026-89412';
  const displayTotal = order?.total || 520;
  const whatsappUrl = getOrderFollowupWhatsAppUrl(displayOrderId, displayTotal, language);
  const DirectionalArrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
      {/* Celebration Check Icon */}
      <div className="w-20 h-20 rounded-full bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold-dark mx-auto mb-6 shadow-sm">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold">
        COMMANDE CONFIRMÉE
      </span>

      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-black mt-2 mb-4 tracking-tight">
        {t('orderSuccess.title')}
      </h1>

      <p className="text-sm sm:text-base text-brand-muted font-light max-w-lg mx-auto mb-8 leading-relaxed">
        {t('orderSuccess.subtitle')}
      </p>

      {/* Order Reference Box */}
      <div className="bg-brand-cream-dark/50 border border-brand-black/10 p-6 sm:p-8 max-w-md mx-auto mb-8 text-start space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-brand-black/10">
          <span className="text-xs text-brand-muted uppercase tracking-wider">
            {t('orderSuccess.orderNumberLabel')}
          </span>
          <span className="font-mono text-sm font-bold text-brand-black">
            {displayOrderId}
          </span>
        </div>

        {order && (
          <div className="space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Client :</span>
              <span className="font-medium text-brand-black">
                {order.customer.firstName} {order.customer.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Ville :</span>
              <span className="font-medium text-brand-black">{order.customer.city}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-brand-black/10 text-sm font-semibold text-brand-black">
              <span>Total :</span>
              <span>{formatPrice(order.total, language)}</span>
            </div>
          </div>
        )}

        <p className="text-[11px] text-stone-500 font-light pt-2 leading-relaxed">
          {t('orderSuccess.instructions')}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-luxury font-semibold shadow-md transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{t('orderSuccess.whatsAppButton')}</span>
        </a>

        <Link to="/" className="flex-1">
          <Button variant="outline" size="md" className="w-full">
            <span>{t('orderSuccess.continueShopping')}</span>
            <DirectionalArrow className="w-3.5 h-3.5 ms-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

