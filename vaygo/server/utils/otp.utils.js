const axios = require('axios');

// ── Generate 6-digit OTP ──────────────────────────────────────────
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// ── Send OTP via Fast2SMS ─────────────────────────────────────────
const sendOTP = async (phone, otp) => {
    try {
        const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
            params: {
                authorization: process.env.FAST2SMS_API_KEY,
                variables_values: otp,
                route: 'otp',
                numbers: phone,
            },
            headers: {
                'cache-control': 'no-cache',
            },
        });

        if (response.data.return === true) {
            console.log(`OTP sent to ${phone}`);
            return { success: true };
        } else {
            console.error('Fast2SMS error:', response.data);
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        console.error('OTP send failed:', error.message);
        return { success: false, message: 'Failed to send OTP' };
    }
};

// ── Store OTP in memory (use Redis in production) ─────────────────
// Simple in-memory store for development
const otpStore = new Map();

const storeOTP = (phone, otp) => {
    const expiry = Date.now() + (parseInt(process.env.OTP_EXPIRE_MINUTES) || 2) * 60 * 1000;
    otpStore.set(phone, { otp, expiry, attempts: 0 });
    console.log(`OTP stored for ${phone}: ${otp} (expires in ${process.env.OTP_EXPIRE_MINUTES || 2} min)`);
};

const verifyOTP = (phone, enteredOTP) => {
    const record = otpStore.get(phone);

    // No OTP found
    if (!record) {
        return { success: false, message: 'OTP not found. Please request a new one.' };
    }

    // Expired
    if (Date.now() > record.expiry) {
        otpStore.delete(phone);
        return { success: false, message: 'OTP expired. Please request a new one.' };
    }

    // Too many wrong attempts (max 3)
    if (record.attempts >= 3) {
        otpStore.delete(phone);
        return { success: false, message: 'Too many wrong attempts. Please request a new OTP.' };
    }

    // Wrong OTP
    if (record.otp !== enteredOTP) {
        record.attempts += 1;
        otpStore.set(phone, record);
        return {
            success: false,
            message: `Wrong OTP. ${3 - record.attempts} attempts remaining.`,
        };
    }

    // Correct — delete from store
    otpStore.delete(phone);
    return { success: true, message: 'OTP verified successfully.' };
};

const deleteOTP = (phone) => {
    otpStore.delete(phone);
};

module.exports = { generateOTP, sendOTP, storeOTP, verifyOTP, deleteOTP };