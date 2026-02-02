/**
 * ===========================================
 * USER CONTROLLER - XỬ LÝ HTTP REQUESTS
 * ===========================================
 * 
 * Controller này nhận HTTP requests từ client và gọi service xử lý.
 * Nhiệm vụ:
 * - Nhận dữ liệu từ request body
 * - Gọi auth.service để xử lý logic
 * - Trả về response cho client
 * 
 * Endpoints:
 * - POST /register - Đăng ký tài khoản
 * - POST /login - Đăng nhập, nhận JWT token
 */

const authService = require('../services/auth.service');

/**
 * ĐĂNG KÝ TÀI KHOẢN MỚI
 * 
 * Endpoint: POST /api/auth/register
 * Body: { email, password, role, fullName }
 * 
 * Response thành công (201):
 * {
 *   message: "Đăng ký thành công!",
 *   user: { id, email, role, fullName, createdAt }
 * }
 */
exports.register = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { email, password, role, fullName } = req.body;

        // Validate dữ liệu đầu vào
        if (!email || !password || !fullName) {
            return res.status(400).json({
                error: 'Thiếu thông tin bắt buộc',
                details: 'Email, password và fullName là bắt buộc'
            });
        }

        // Gọi service để đăng ký
        const newUser = await authService.register(email, password, role, fullName);

        // Trả về kết quả thành công
        res.status(201).json({
            message: 'Đăng ký thành công!',
            user: newUser
        });

    } catch (error) {
        // Xử lý lỗi (email trùng, validation fail, ...)
        res.status(400).json({
            error: 'Đăng ký thất bại',
            details: error.message
        });
    }
};

/**
 * ĐĂNG NHẬP VÀ NHẬN JWT TOKEN
 * 
 * Endpoint: POST /api/auth/login
 * Body: { email, password }
 * 
 * Response thành công (200):
 * {
 *   message: "Đăng nhập thành công!",
 *   token: "eyJhbGciOiJIUzI1NiIs...",
 *   user: { id, email, role, fullName }
 * }
 * 
 * Lưu ý: Client cần lưu token này và gửi kèm trong header
 * Authorization: Bearer <token> cho các request sau
 */
exports.login = async (req, res) => {
    try {
        // Lấy email và password từ request body
        const { email, password } = req.body;

        // Validate dữ liệu đầu vào
        if (!email || !password) {
            return res.status(400).json({
                error: 'Thiếu thông tin đăng nhập',
                details: 'Email và password là bắt buộc'
            });
        }

        // Gọi service để đăng nhập
        const result = await authService.login(email, password);

        // Trả về token và thông tin user
        res.status(200).json({
            message: 'Đăng nhập thành công!',
            token: result.token,
            user: result.user
        });

    } catch (error) {
        // Xử lý lỗi (sai email/password, ...)
        res.status(401).json({
            error: 'Đăng nhập thất bại',
            details: error.message
        });
    }
};

/**
 * LẤY THÔNG TIN USER HIỆN TẠI (Protected route)
 * 
 * Endpoint: GET /api/auth/me
 * Header: Authorization: Bearer <token>
 * 
 * Cần middleware verifyToken để lấy req.user
 */
exports.getProfile = async (req, res) => {
    try {
        // req.user được set bởi middleware verifyToken
        const User = require('../models/user.model');
        const user = await User.findByPk(req.user.userId, {
            attributes: ['id', 'email', 'role', 'full_name', 'createdAt']
        });

        if (!user) {
            return res.status(404).json({
                error: 'User không tồn tại'
            });
        }

        res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                fullName: user.full_name,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        res.status(500).json({
            error: 'Lỗi server',
            details: error.message
        });
    }
};
