/**
 * API Middleware
 * 提供 JWT 驗證、錯誤處理等中間件功�?
 */
import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from './auth';

export interface AuthenticatedRequest extends VercelRequest {
    userId?: number;
}

/**
 * 統一錯誤回應
 */
export const sendError = (
    res: VercelResponse,
    statusCode: number,
    code: string,
    message: string,
    details?: any
) => {
    return res.status(statusCode).json({
        error: {
            code,
            message,
            ...(process.env.NODE_ENV === 'development' && details ? { details } : {}),
        },
    });
};

/**
 * 統一成功回應
 */
export const sendSuccess = (res: VercelResponse, data: any, statusCode: number = 200) => {
    return res.status(statusCode).json(data);
};

/**
 * JWT 認證 Middleware
 * 驗證 Authorization header 中的 token
 */
export const requireAuth = (handler: (req: AuthenticatedRequest, res: VercelResponse) => Promise<any>) => {
    return async (req: AuthenticatedRequest, res: VercelResponse) => {
        try {
            // 取得 Authorization header
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return sendError(res, 401, 'UNAUTHORIZED', '缺少認證 token');
            }

            // 提取 token
            const token = authHeader.substring(7); // 移除 "Bearer "

            // 驗證 token
            const payload = verifyToken(token);

            if (!payload) {
                return sendError(res, 401, 'INVALID_TOKEN', 'Token 無效或已過期');
            }

            // �?userId 附加�?request
            req.userId = payload.userId;

            // 執行原本�?handler
            return await handler(req, res);

        } catch (error) {
            console.error('Auth middleware error:', error);
            return sendError(res, 500, 'INTERNAL_ERROR', '認證過程發生錯誤');
        }
    };
};

/**
 * CORS Middleware
 * 處理跨域請求
 */
export const enableCORS = (res: VercelResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*'); // 生產環境應該設定特定 origin
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );
};

/**
 * 處理 OPTIONS 請求（preflight�?
 */
export const handleOptions = (req: VercelRequest, res: VercelResponse) => {
    if (req.method === 'OPTIONS') {
        enableCORS(res);
        res.status(200).end();
        return true;
    }
    return false;
};
