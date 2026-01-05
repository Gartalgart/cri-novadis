import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BarChart = ({ data, title }) => {
    if (!data || data.length === 0) return null;

    // Assuming data is [{ label: string, value: number, color: string }]
    const maxVal = Math.max(...data.map(d => d.value));

    return (
        <View style={styles.container}>
            {title && <Text style={styles.title}>{title}</Text>}

            {data.map((item, index) => {
                const percentage = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
                const displayPercentage = maxVal > 0 ? Math.round((item.value / data.reduce((a, b) => a + b.value, 0)) * 100) : 0;

                return (
                    <View key={index} style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
                        </View>

                        <View style={styles.barContainer}>
                            <View style={styles.barBackground}>
                                <View
                                    style={[
                                        styles.barFill,
                                        {
                                            width: `${percentage}%`,
                                            backgroundColor: item.color || '#4F46E5'
                                        }
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.valueContainer}>
                            <Text style={styles.value}>{item.value}</Text>
                            <Text style={styles.percentage}>{displayPercentage}%</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 16
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    labelContainer: {
        width: 100,
        marginRight: 8,
    },
    label: {
        fontSize: 12,
        color: '#4B5563',
    },
    barContainer: {
        flex: 1,
        marginRight: 8,
    },
    barBackground: {
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
    },
    barFill: {
        height: 8,
        borderRadius: 4,
    },
    valueContainer: {
        width: 50,
        alignItems: 'flex-end',
    },
    value: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1F2937',
    },
    percentage: {
        fontSize: 10,
        color: '#9CA3AF',
    }
});

export default BarChart;
