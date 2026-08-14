import type { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.1.0',
      message: 'RTI Management System API is operating normally.'
    });
  } catch (error: any) {
    console.error('API Error in /api/health:', error);
    res.status(200).json({
      status: 'error',
      message: error?.message || 'Internal server error handled gracefully',
      fallback: true
    });
  }
}
