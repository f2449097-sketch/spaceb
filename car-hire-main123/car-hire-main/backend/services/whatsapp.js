const twilio = require('twilio');

/**
 * Sends a WhatsApp message using Twilio
 * @param {string} body - The message content
 * @returns {Promise<any>} - Twilio response
 */
const sendWhatsApp = async (body) => {
    // Initialize variables from environment inside the function
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'
    const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER; // e.g., 'whatsapp:+254724440293'

    try {
        if (!accountSid || !authToken || !fromNumber || !adminNumber) {
            console.warn('WhatsApp service credentials missing. Skipping notification.');
            console.log('Missing fields:', {
                accountSid: !!accountSid,
                authToken: !!authToken,
                fromNumber: !!fromNumber,
                adminNumber: !!adminNumber
            });
            return null;
        }

        const client = twilio(accountSid, authToken);
        
        const message = await client.messages.create({
            body,
            from: fromNumber,
            to: adminNumber
        });

        console.log('WhatsApp notification sent successfully:', message.sid);
        return message;
    } catch (error) {
        console.error('Failed to send WhatsApp notification:', error.message);
        // We don't throw here to avoid breaking the main booking flow
        return null;
    }
};

/**
 * Formats and sends a car booking notification
 * @param {object} booking - Booking data
 */
const notifyNewCarBooking = async (booking) => {
    const message = `🚗 *New Car Booking Alert!*

👤 *Customer:* ${booking.firstName} ${booking.lastName}
📱 *Phone:* ${booking.phoneNumber}
📧 *Email:* ${booking.email}

🚙 *Vehicle:* ${booking.vehicleName || 'Not specified'}
💰 *Price:* KES ${Number(booking.vehiclePrice || 0).toLocaleString()}

📅 *Status:* ${booking.status.toUpperCase()}
🕒 *Time:* ${new Date().toLocaleString('en-KE')}

SpaceBorne Car Hire Admin`;
    
    return sendWhatsApp(message);
};

/**
 * Formats and sends an adventure booking notification
 * @param {object} booking - Adventure booking data
 */
const notifyNewAdventureBooking = async (booking) => {
    const message = `🌍 *New Adventure Booking Alert!*

👤 *Customer:* ${booking.firstName} ${booking.lastName}
📱 *Phone:* ${booking.phoneNumber}
📧 *Email:* ${booking.email}

✨ *Adventure:* ${booking.adventureTitle || 'Not specified'}
👥 *Participants:* ${booking.numberOfParticipants || 1}
💰 *Total Price:* KES ${Number(booking.adventurePrice || 0).toLocaleString()}

📅 *Status:* ${booking.status.toUpperCase()}
🕒 *Time:* ${new Date().toLocaleString('en-KE')}

SpaceBorne Car Hire Admin`;
    
    return sendWhatsApp(message);
};

module.exports = {
    sendWhatsApp,
    notifyNewCarBooking,
    notifyNewAdventureBooking
};
