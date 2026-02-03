/**
 * Push Service (Firebase Cloud Messaging simulation)
 * 
 * Chịu trách nhiệm:
 * - Gửi push notifications đến mobile devices
 * - Trong môi trường development, chỉ simulate việc gửi
 * - Production sẽ tích hợp Firebase Admin SDK
 * 
 * TẠI SAO CẦN SERVICE RIÊNG?
 * - Tách biệt logic gửi push ra khỏi business logic
 * - Dễ dàng thay đổi provider (Firebase, OneSignal, etc.)
 * - Dễ mock trong testing
 */

class PushService {
    /**
     * Gửi push notification đến một device
     * @param {string} token - FCM/APNs token
     * @param {Object} payload - { title, content, data }
     * @returns {Promise<{success: boolean, messageId?: string}>}
     */
    async sendToDevice(token, payload) {
        const { title, content, data } = payload;

        // Simulation: Log ra console thay vì gửi thật
        console.log('📱 [PUSH SIMULATION] Sending to device:');
        console.log(`   Token: ${token.substring(0, 20)}...`);
        console.log(`   Title: ${title}`);
        console.log(`   Content: ${content}`);
        console.log(`   Data: ${JSON.stringify(data || {})}`);

        // Simulate network delay và success/failure
        await this._simulateDelay();

        // 95% success rate simulation
        if (Math.random() > 0.05) {
            const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            console.log(`   ✅ Sent successfully! MessageId: ${messageId}`);
            return { success: true, messageId };
        } else {
            console.log(`   ❌ Failed to send (simulated failure)`);
            return { success: false, error: 'Simulated push failure' };
        }
    }

    /**
     * Gửi push notification đến nhiều devices
     * @param {string[]} tokens - Mảng FCM/APNs tokens
     * @param {Object} payload - { title, content, data }
     * @returns {Promise<{successCount, failureCount}>}
     */
    async sendToMultipleDevices(tokens, payload) {
        console.log(`📱 [PUSH SIMULATION] Sending to ${tokens.length} devices...`);

        let successCount = 0;
        let failureCount = 0;

        for (const token of tokens) {
            const result = await this.sendToDevice(token, payload);
            if (result.success) {
                successCount++;
            } else {
                failureCount++;
            }
        }

        console.log(`📱 [PUSH SIMULATION] Complete: ${successCount} success, ${failureCount} failed`);
        return { successCount, failureCount };
    }

    /**
     * Simulate network delay
     * @private
     */
    async _simulateDelay() {
        const delay = Math.random() * 200 + 50;  // 50-250ms
        return new Promise(resolve => setTimeout(resolve, delay));
    }
}

module.exports = new PushService();
