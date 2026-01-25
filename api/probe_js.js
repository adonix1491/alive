module.exports = (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'JS Probe Successful',
        timestamp: new Date().toISOString()
    });
};
