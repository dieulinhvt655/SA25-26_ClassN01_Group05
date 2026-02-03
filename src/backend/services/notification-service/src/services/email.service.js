/**
 * Email Service (simulation)
 * 
 * Chịu trách nhiệm:
 * - Gửi email notifications
 * - Trong môi trường development, chỉ simulate việc gửi
 * - Production sẽ tích hợp với SMTP/SendGrid/SES
 * 
 * TẠI SAO CẦN SERVICE RIÊNG?
 * - Tách biệt logic gửi email ra khỏi business logic
 * - Dễ dàng thay đổi provider (SendGrid, SES, SMTP, etc.)
 * - Dễ mock trong testing
 */

class EmailService {
    /**
     * Gửi email notification
     * @param {string} to - Email người nhận
     * @param {Object} payload - { subject, content, html }
     * @returns {Promise<{success: boolean, messageId?: string}>}
     */
    async send(to, payload) {
        const { subject, content, html } = payload;

        // Simulation: Log ra console thay vì gửi thật
        console.log('📧 [EMAIL SIMULATION] Sending email:');
        console.log(`   To: ${to}`);
        console.log(`   Subject: ${subject}`);
        console.log(`   Content: ${content ? content.substring(0, 100) : '(HTML only)'}...`);

        // Simulate network delay
        await this._simulateDelay();

        // 98% success rate simulation
        if (Math.random() > 0.02) {
            const messageId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            console.log(`   ✅ Email sent successfully! MessageId: ${messageId}`);
            return { success: true, messageId };
        } else {
            console.log(`   ❌ Failed to send email (simulated failure)`);
            return { success: false, error: 'Simulated email failure' };
        }
    }

    /**
     * Gửi email đến nhiều người
     * @param {string[]} recipients - Mảng email addresses
     * @param {Object} payload - { subject, content, html }
     * @returns {Promise<{successCount, failureCount}>}
     */
    async sendBulk(recipients, payload) {
        console.log(`📧 [EMAIL SIMULATION] Sending to ${recipients.length} recipients...`);

        let successCount = 0;
        let failureCount = 0;

        for (const email of recipients) {
            const result = await this.send(email, payload);
            if (result.success) {
                successCount++;
            } else {
                failureCount++;
            }
        }

        console.log(`📧 [EMAIL SIMULATION] Complete: ${successCount} success, ${failureCount} failed`);
        return { successCount, failureCount };
    }

    /**
     * Simulate network delay
     * @private
     */
    async _simulateDelay() {
        const delay = Math.random() * 300 + 100;  // 100-400ms
        return new Promise(resolve => setTimeout(resolve, delay));
    }
}

module.exports = new EmailService();
