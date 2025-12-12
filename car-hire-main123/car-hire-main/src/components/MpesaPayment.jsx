import React from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';

/**
 * Payments are intentionally disabled in-app. This component now only
 * shows guidance so that any legacy entry points still render safely.
 */
const MpesaPayment = ({ amount, onCancel }) => {
  const formattedAmount = amount ? Number(amount).toLocaleString() : null;
  const waNumber = '254759477359';
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hi, I'd like to complete my booking. Amount due: KES ${formattedAmount || 'N/A'}.`
  )}`;
  const telUrl = 'tel:+254759477359';

  return (
    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
      <div className="flex items-center justify-center mb-4">
        <div className="w-16 h-16 bg-cosmic-silver/20 rounded-full flex items-center justify-center">
          <Icon name="AlertCircle" className="w-8 h-8 text-cosmic-depth" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-2">In-App Payments Disabled</h2>
      <p className="text-gray-600 text-center mb-4">
        Please finalize payment directly with our team. We will confirm your booking once payment is received.
      </p>

      {formattedAmount && (
        <div className="bg-cosmic-silver/10 border border-cosmic-silver/40 rounded-lg p-4 text-center mb-4">
          <p className="text-sm text-gray-600 mb-1">Amount Due</p>
          <p className="text-3xl font-bold text-cosmic-depth">KES {formattedAmount}</p>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <a href={waUrl} target="_blank" rel="noreferrer">
          <Button variant="default" className="w-full bg-green-600 hover:bg-green-700">
            <Icon name="MessageCircle" className="w-5 h-5 mr-2" />
            Chat on WhatsApp
          </Button>
        </a>
        <a href={telUrl}>
          <Button variant="outline" className="w-full">
            <Icon name="Phone" className="w-5 h-5 mr-2" />
            Call Us
          </Button>
        </a>
      </div>

      <Button variant="ghost" className="w-full" onClick={onCancel}>
        Close
      </Button>
    </div>
  );
};

export default MpesaPayment;
