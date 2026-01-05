import { format, subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear, subQuarters, startOfQuarter, endOfQuarter } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Get start and end dates for a given period
 * @param {string} period 'month', 'quarter', 'year'
 * @returns {Object} { start: Date, end: Date }
 */
export const getPeriodDates = (period) => {
    const now = new Date();
    let start, end;

    switch (period) {
        case 'month':
            start = startOfMonth(now);
            end = endOfMonth(now);
            break;
        case 'quarter':
            start = startOfQuarter(now);
            end = endOfQuarter(now);
            break;
        case 'year':
            start = startOfYear(now);
            end = endOfYear(now);
            break;
        case 'last_month':
            start = startOfMonth(subMonths(now, 1));
            end = endOfMonth(subMonths(now, 1));
            break;
        default:
            start = startOfMonth(now);
            end = endOfMonth(now);
    }

    return { start, end };
};

/**
 * Format date for display
 * @param {Date|string} date 
 * @param {string} formatStr 
 * @returns {string} Formatted date string
 */
export const formatDateForDisplay = (date, formatStr = 'dd MMM yyyy') => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr, { locale: fr });
};

/**
 * Get labels for the last N months
 * @param {number} count Number of months
 * @returns {Array} Array of month names
 */
export const getMonthLabels = (count = 6) => {
    const labels = [];
    const now = new Date();

    for (let i = count - 1; i >= 0; i--) {
        const date = subMonths(now, i);
        labels.push(format(date, 'MMM', { locale: fr }));
    }

    return labels;
};
