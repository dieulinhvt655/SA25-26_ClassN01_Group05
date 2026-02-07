/**
 * Push Service (Firebase Cloud Messaging)
 * 
 * Chịu trách nhiệm:
 * - Gửi push notifications thực tế đến mobile devices qua FCM
 * - Yêu cầu file cấu hình firebase-adminsdk.json
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

class PushService {
    constructor() {
        this.initialized = false;
        this._initializeFirebase();
    }

    _initializeFirebase() {
        try {
            // Đường dẫn đến file service account
            // User cần tải file này từ Firebase Console -> Project Settings -> Service Accounts
            const serviceAccountPath = path.resolve(__dirname, '../../firebase-adminsdk.json');

            if (fs.existsSync(serviceAccountPath)) {
                const serviceAccount = require(serviceAccountPath);

                if (!admin.apps.length) {
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount)
                    });
                }
                this.initialized = true;
                console.log('Firebase Admin SDK initialized successfully');
            } else {
                console.warn('Firebase Admin SDK not initialized: Missing firebase-adminsdk.json');
                console.warn('Push notifications will be SIMULATED (Logged to console only)');
            }
        } catch (error) {
            console.error('Error initializing Firebase:', error.message);
        }
    }

    /**
     * Gửi push notification đến một device
     * @param {string} token - FCM Token
     * @param {Object} payload - { title, content, data }
     */
    async sendToDevice(token, payload) {
        // Nếu chưa init được Firebase hoặc không có credentials, fallback về simulation log
        if (!this.initialized) {
            return this._simulateSend(token, payload);
        }

        try {
            const message = {
                token: token,
                notification: {
                    title: payload.title,
                    body: payload.content
                },
                data: payload.data || {}
            };

            const messageId = await admin.messaging().send(message);
            console.log(`Push sent to ${token.substr(0, 10)}... | MsgId: ${messageId}`);
            return { success: true, messageId };

        } catch (error) {
            console.error(`Push failed to ${token.substr(0, 10)}...:`, error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Gửi push notification đến nhiều devices (Multicast)
     * @param {string[]} tokens - Mảng FCM Tokens
     * @param {Object} payload - { title, content, data }
     */
    async sendToMultipleDevices(tokens, payload) {
        if (!tokens || tokens.length === 0) return { successCount: 0, failureCount: 0 };

        if (!this.initialized) {
            console.log(`[PUSH FALLBACK] Firebase not init. Simulating send to ${tokens.length} devices.`);
            return { successCount: tokens.length, failureCount: 0 };
        }

        try {
            const message = {
                notification: {
                    title: payload.title,
                    body: payload.content
                },
                data: payload.data || {},
                tokens: tokens
            };

            const response = await admin.messaging().sendEachForMulticast(message);

            if (response.failureCount > 0) {
                console.log(`Push Partial Failure: ${response.failureCount}/${tokens.length} failed.`);
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        // Có thể xử lý xóa token lỗi tại đây nếu cần (ví dụ: error.code === 'messaging/registration-token-not-registered')
                        // console.log(`   Tokens[${idx}] failed: ${resp.error.message}`);
                    }
                });
            } else {
                console.log(`Push Multicast: ${response.successCount} sent successfully.`);
            }

            return {
                successCount: response.successCount,
                failureCount: response.failureCount
            };
        } catch (error) {
            console.error('Push Multicast Error:', error.message);
            return { successCount: 0, failureCount: tokens.length };
        }
    }

    // Fallback simulation khi không có credentials
    async _simulateSend(token, payload) {
        console.log(' [PUSH SIMULATED] (No Firebase Creds)');
        console.log(`   To: ${token.substr(0, 15)}...`);
        console.log(`   Title: ${payload.title}`);
        return { success: true, messageId: 'simulated_msg_id' };
    }
}

module.exports = new PushService();
