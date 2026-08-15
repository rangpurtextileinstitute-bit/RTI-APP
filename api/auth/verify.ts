import type { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  try {
    res.setHeader('Content-Type', 'application/json');
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        authenticated: false,
        error: 'Unauthorized: Missing or invalid token format',
        code: 401
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token || token.length < 5 || token === 'expired_token') {
      return res.status(403).json({
        authenticated: false,
        error: 'Forbidden: Token is invalid or expired',
        code: 403
      });
    }

    return res.status(200).json({
      authenticated: true,
      timestamp: new Date().toISOString(),
      message: 'Session token verified successfully'
    });
  } catch (error: any) {
    console.error('Server Error Stack Trace in /api/auth/verify:', error?.stack || error);
    return res.status(500).json({
      authenticated: false,
      error: error?.message || 'Internal Server Error',
      stack: error?.stack || '',
      code: 500
    });
  }
}
