const router = require('express').Router();
const { generateOTP, sendOTP, storeOTP, verifyOTP } = require('../utils/otp.utils');

// ── POST /api/otp/send ────────────────────────────────────────────
// Called when user registers or requests OTP
router.post('/send', async (req, res) => {
    try {
        const { phone } = req.body;

        // Validate phone
        if (!phone) {
            return res.status(400).json({ success: false, message: 'Phone number is required.' });
        }

        // Remove +91 if present, keep only 10 digits
        const cleanPhone = phone.replace(/^\+91/, '').replace(/\s/g, '');

        if (!/^\d{10}$/.test(cleanPhone)) {
            return res.status(400).json({ success: false, message: 'Enter a valid 10-digit Indian phone number.' });
        }

        // Generate OTP
        const otp = generateOTP();

        // Store OTP
        storeOTP(cleanPhone, otp);

        // Send OTP via Fast2SMS (non-fatal — OTP is stored regardless)
        const result = await sendOTP(cleanPhone, otp);

        if (!result.success) {
            console.warn(`SMS delivery failed for ${cleanPhone}: ${result.message}`);
            // In dev mode: return 200 with OTP hint so flow is not blocked
            if (process.env.NODE_ENV === 'development') {
                return res.status(200).json({
                    success: true,
                    message: `OTP generated (SMS failed in dev). Check server logs.`,
                    otp,       // dev hint shown in browser
                    smsError: result.message,
                });
            }
            // In production, surface the error
            return res.status(500).json({ success: false, message: result.message || 'Failed to send OTP.' });
        }

        return res.status(200).json({
            success: true,
            message: `OTP sent to +91 ${cleanPhone}`,
            // Only expose OTP in development for testing
            ...(process.env.NODE_ENV === 'development' && { otp }),
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// ── POST /api/otp/verify ──────────────────────────────────────────
// Called when user enters OTP on verification screen
router.post('/verify', async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({ success: false, message: 'Phone and OTP are required.' });
        }

        const cleanPhone = phone.replace(/^\+91/, '').replace(/\s/g, '');

        const result = verifyOTP(cleanPhone, otp.toString().trim());

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }

        return res.status(200).json({ success: true, message: result.message });

    } catch (error) {
        console.error('Verify OTP error:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// ── POST /api/otp/resend ──────────────────────────────────────────
router.post('/resend', async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ success: false, message: 'Phone number is required.' });
        }

        const cleanPhone = phone.replace(/^\+91/, '').replace(/\s/g, '');

        const otp = generateOTP();
        storeOTP(cleanPhone, otp);
        const result = await sendOTP(cleanPhone, otp);

        if (!result.success) {
            console.warn(`SMS resend failed for ${cleanPhone}: ${result.message}`);
            if (process.env.NODE_ENV === 'development') {
                return res.status(200).json({
                    success: true,
                    message: `New OTP generated (SMS failed in dev). Check server logs.`,
                    otp,
                    smsError: result.message,
                });
            }
            return res.status(500).json({ success: false, message: 'Failed to resend OTP.' });
        }

        return res.status(200).json({
            success: true,
            message: `New OTP sent to +91 ${cleanPhone}`,
            ...(process.env.NODE_ENV === 'development' && { otp }),
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;