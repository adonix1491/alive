export default function handler(req: any, res: any) {
    res.status(200).json({
        message: 'Probe successful',
        timestamp: new Date().toISOString(),
        query: req.query,
        body: req.body,
        method: req.method
    });
}
