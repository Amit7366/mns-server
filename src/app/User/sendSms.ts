import axios from 'axios';

export const sendOtpSms = async (phone: string, otp: string) => {
    try {
        const response = await axios.post(
            'https://api.sms.net.bd/sendsms',
            {
                api_key: process.env.SMS_API_KEY,
                msg: `OTP: ${otp}

আপনার পাসওয়ার্ড রিসেট করার জন্য এই কোডটি ব্যবহার করুন।
কোডটি ১০ মিনিট পর্যন্ত বৈধ।

ধন্যবাদ`,
                to: `88${phone}`,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;

    } catch (error: any) {
        console.error('SMS Send Error:', error?.response?.data || error.message);
        throw new Error('Failed to send OTP SMS');
    }
};
