import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import MpesaPayment from '../../components/MpesaPayment';
import { API_BASE_URL } from '../../config/api';

const Confirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  
  // Extract booking details from state
  const bookingData = state?.bookingData || {};
  const bookingType = state?.bookingType || 'vehicle';
  const totalAmount = bookingType === 'adventure' 
    ? bookingData.adventurePrice 
    : bookingData.vehiclePrice;
  
  const displayName = bookingType === 'adventure'
    ? bookingData.adventureTitle
    : `${bookingData.vehicleMake} ${bookingData.vehicleModel}` || bookingData.vehicleName;
  
  const accountReference = `BOOKING_${bookingData._id || Date.now()}`;

  const handlePaymentSuccess = async (paymentData) => {
    // Payment successful - update booking status
    try {
      const endpoint = bookingType === 'adventure' 
        ? `${API_BASE_URL}/adventure-bookings/${bookingData._id}`
        : `${API_BASE_URL}/bookings/${bookingData._id}`;
      
      await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentReference: paymentData.checkoutRequestId,
          paymentDate: new Date().toISOString()
        })
      });
      
      alert('🎉 Payment successful! Your booking is confirmed.');
      navigate('/booking-success', { 
        state: { 
          bookingId: bookingData._id,
          amount: totalAmount 
        }
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Payment received but booking update failed. Please contact support.');
    }
  };

  const waNumber = '254759477359';
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi, I want to confirm my booking for ${displayName} worth KES ${totalAmount}.`)}`;
  const telUrl = 'tel:+254759477359';
  
  const formatPrice = (price) => {
    return `KES ${Number(price || 0).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white shadow-sm rounded-xl p-8 space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900">🎉 Booking Created Successfully!</h1>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">Your booking has been created and is pending payment.</p>
          </div>

          <div className="space-y-3 text-gray-700">
            <h2 className="text-lg font-semibold">Booking Details:</h2>
            <p><span className="font-medium">{bookingType === 'adventure' ? 'Adventure:' : 'Vehicle:'}</span> {displayName}</p>
            <p><span className="font-medium">Amount:</span> {formatPrice(totalAmount)}</p>
            <p><span className="font-medium">Customer:</span> {bookingData.firstName} {bookingData.lastName}</p>
            <p><span className="font-medium">Phone:</span> {bookingData.phoneNumber}</p>
            <p><span className="font-medium">Email:</span> {bookingData.email}</p>
            <p><span className="font-medium">Status:</span> <span className="text-yellow-600 font-semibold">Pending Payment</span></p>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h2 className="text-lg font-semibold">Complete Your Payment:</h2>
            
            <Button 
              variant="default" 
              onClick={() => setShowPayment(true)} 
              className="w-full bg-green-600 hover:bg-green-700 text-lg py-4"
            >
              📱 Pay Now with M-Pesa - {formatPrice(totalAmount)}
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              <p>or contact us directly:</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a href={waUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" fullWidth>💬 WhatsApp Us</Button>
              </a>
              <a href={telUrl}>
                <Button variant="outline" fullWidth>📞 Call Us</Button>
              </a>
            </div>
          </div>

          <div className="pt-6">
            <Link to="/fleet-discovery">
              <Button variant="ghost">← Back to Fleet</Button>
            </Link>
          </div>
        </div>
      </main>
      
      {/* M-Pesa Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <MpesaPayment
            amount={totalAmount}
            accountReference={accountReference}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPayment(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Confirmation;

