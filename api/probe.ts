import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.status(200).json({
        message: 'Probe is working!',
        time: new Date().toISOString(),
        query: req.query,
        env: process.env.NODE_ENV,
        headers: req.headers
    });
}
