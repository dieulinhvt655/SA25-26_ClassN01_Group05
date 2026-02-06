/**
 * ===========================================
 * OTP SERVICE - XỬ LÝ MÃ XÁC THỰC
 * ===========================================
 */

const OTP = require('../models/otp.model');

const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 5;

/**
 * Tạo và lưu OTP mới
 */
async function generateOTP(email, purpose) {
    // Tạo mã 6 số ngẫu nhiên
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Xóa các OTP cũ chưa dùng
    await OTP.destroy({
        where: { email, purpose, verified: false }
    });

    // Tạo OTP mới
    await OTP.create({
        email,
        code,
        purpose,
        expires_at: expiresAt
    });

    console.log(`📧 OTP cho ${email}: ${code} (hết hạn sau ${OTP_EXPIRY_MINUTES} phút)`);

    // TODO: Tích hợp gửi email thực tế
    // await sendEmail(email, 'Mã xác thực OTP', `Mã OTP của bạn: ${code}`);

    return code;
}

/**
 * Xác thực OTP
 */
async function verifyOTP(email, code, purpose) {
    const otp = await OTP.findOne({
        where: { email, purpose, verified: false },
        order: [['created_at', 'DESC']]
    });

    if (!otp) {
        throw new Error('Không tìm thấy mã OTP. Vui lòng yêu cầu mã mới.');
    }

    // Kiểm tra số lần thử
    if (otp.attempts >= MAX_ATTEMPTS) {
        await otp.destroy();
        throw new Error('Đã nhập sai quá nhiều lần. Vui lòng yêu cầu mã mới.');
    }

    // Kiểm tra hết hạn
    if (new Date() > otp.expires_at) {
        await otp.destroy();
        throw new Error('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.');
    }

    // Kiểm tra mã
    if (otp.code !== code) {
        await otp.update({ attempts: otp.attempts + 1 });
        throw new Error(`Mã OTP không đúng. Còn ${MAX_ATTEMPTS - otp.attempts - 1} lần thử.`);
    }

    // Đánh dấu đã xác thực
    await otp.update({ verified: true });
    return true;
}

module.exports = { generateOTP, verifyOTP };
