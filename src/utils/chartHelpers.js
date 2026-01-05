import { Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Transform raw data into chart-compatible format
 * @param {Array} rawData 
 * @param {string} type 'line', 'bar', 'pie'
 * @returns {Object} Chart data
 */
export const formatChartData = (rawData, type) => {
    if (!rawData) return null;

    if (type === 'line') {
        // Expects rawData to be array of current monthly counts
        // labels should be handled separately or passed in
        return {
            labels: rawData.map(d => d.label),
            datasets: [{
                data: rawData.map(d => d.value)
            }]
        };
    }

    return rawData;
};

/**
 * Generate distinct colors for chart segments
 * @param {number} count 
 * @returns {Array} Array of color strings
 */
export const generateChartColors = (count) => {
    const baseColors = [
        '#4F46E5', // Indigo
        '#10B981', // Emerald
        '#F59E0B', // Amber
        '#EF4444', // Red
        '#8B5CF6', // Violet
        '#EC4899', // Pink
        '#06B6D4', // Cyan
        '#84CC16', // Lime
    ];

    // Return requested number of colors, cycling if needed
    return Array(count).fill(0).map((_, i) => baseColors[i % baseColors.length]);
};

/**
 * Get responsive chart dimensions
 * @returns {Object} { width, height }
 */
export const calculateChartDimensions = (padding = 32) => {
    return {
        width: SCREEN_WIDTH - padding,
        height: 220
    };
};

export const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`, // Primary color
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
};
