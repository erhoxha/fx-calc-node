const { calculateLotSize } = require('../services/lotSizeCalculator');

// GET handler
function getCalculateLotSize(req, res) {
    res.render('calculateLotSize', { request: {}, response: null });
}

// POST handler
function postCalculateLotSize(req, res) {
    const result = calculateLotSize(req.body);
    res.render('calculateLotSize', {
        request: req.body,
        response: result
    });
}

module.exports = {
    getCalculateLotSize,
    postCalculateLotSize
};

