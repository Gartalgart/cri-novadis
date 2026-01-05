// Utility functions for calculating dashboard statistics
/**
 * Calculate percentage change between two values
 * @param {number} currentValue 
 * @param {number} previousValue 
 * @returns {number} Percentage change (e.g., 15.5 for +15.5%, -5.2 for -5.2%)
 */
export const calculateTrend = (currentValue, previousValue) => {
    if (!previousValue || previousValue === 0) return 0;
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return Number(change.toFixed(1));
};

/**
 * Calculate completion rate percentage
 * @param {number} completedCount 
 * @param {number} totalCount 
 * @returns {number} Completion percentage (0-100)
 */
export const calculateCompletionRate = (completedCount, totalCount) => {
    if (!totalCount || totalCount === 0) return 0;
    const rate = (completedCount / totalCount) * 100;
    return Math.round(rate);
};

/**
 * Calculate average duration in hours from interventions array
 * @param {Array} interventions 
 * @returns {string} Formatted duration string (e.g. "2h 30m")
 */
export const calculateAverageDuration = (interventions) => {
    if (!interventions || interventions.length === 0) return 0;

    const totalMinutes = interventions.reduce((acc, curr) => {
        return acc + (curr.duration_minutes || 0);
    }, 0);

    const avgMinutes = totalMinutes / interventions.length;
    return Number((avgMinutes / 60).toFixed(1)); // Return hours with 1 decimal
};

/**
 * Group interventions by period
 * @param {Array} interventions 
 * @param {string} period 'month', 'status', 'type'
 * @returns {Object} Grouped data
 */
export const groupByKey = (interventions, key) => {
    return interventions.reduce((acc, curr) => {
        const groupKey = curr[key] || 'unknown';
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(curr);
        return acc;
    }, {});
};
