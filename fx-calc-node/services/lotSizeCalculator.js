/**
 * Calculates the recommended lot size based on risk parameters
 * @param {Object} params - Calculation parameters
 * @returns {Object} Recommended lot size and pips at risk
 */
function calculateLotSize({ entryPrice, stopLossPrice, accountBalance, riskPercentageUWantToRisk, goldOrJPYPair }) {
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopLossPrice);
    const balance = parseFloat(accountBalance);
    const riskPct = parseFloat(riskPercentageUWantToRisk);
    const isGoldOrJPY = goldOrJPYPair === 'on' || goldOrJPYPair === true || goldOrJPYPair === 'true';

    // Calculate pips at risk based on pair type
    const pipsLose = calculatePipDifference(entry, stop, isGoldOrJPY);

    // Standard pip value for 1 standard lot (100,000 units)
    const pipValuePerStandardLot = 10.0;

    // Calculate risk amount in account currency
    const riskAmount = balance * (riskPct / 100);

    // Calculate recommended lot size
    let recommendedLotSize = 0.0;
    if (pipsLose > 0) {
        recommendedLotSize = riskAmount / (pipsLose * pipValuePerStandardLot);
        recommendedLotSize = roundToBrokerLot(recommendedLotSize);
    }

    return {
        recommendedLotSize: recommendedLotSize.toFixed(2),
        pipsIfLoose: pipsLose.toFixed(2)
    };
}

/**
 * Calculates pip difference between entry and stop loss
 * @param {number} entry - Entry price
 * @param {number} stop - Stop loss price
 * @param {boolean} isGoldOrJPY - Whether pair is Gold/JPY (2 decimals) or EUR pairs (4 decimals)
 * @returns {number} Pip difference
 */
function calculatePipDifference(entry, stop, isGoldOrJPY) {
    if (isGoldOrJPY) {
        // Gold/JPY pairs: 2 decimal places (e.g., 4444.44)
        // 1 pip = 0.01 price movement
        // Example: 4444.44 - 4444.43 = 1 pip
        return Math.round(Math.abs((entry - stop) * 100));
    } else {
        // EUR and other major pairs: 4 decimal places (e.g., 1.1234)
        // 1 pip = 0.0001 price movement
        // Example: 1.1234 - 1.1233 = 1 pip
        return Math.round(Math.abs((entry - stop) * 10000));
    }
}

/**
 * Rounds lot size to broker's minimum increment (0.01)
 * @param {number} value - Raw lot size value
 * @returns {number} Rounded lot size (minimum 0.01)
 */
function roundToBrokerLot(value) {
    const lot = Number(value);
    // Minimum lot size is 0.01
    if (lot <= 0) return 0.0;
    if (lot < 0.01) return 0.01;
    // Round to 2 decimal places (broker standard)
    return Math.round(lot * 100) / 100;
}

module.exports = { calculateLotSize };
