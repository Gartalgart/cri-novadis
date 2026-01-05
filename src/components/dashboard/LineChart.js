import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-chart-kit';
import { chartConfig, calculateChartDimensions } from '../../utils/chartHelpers';

const LineChart = ({ data, title }) => {
    if (!data || !data.datasets || data.datasets.length === 0 || !data.datasets[0].data.length) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Pas de données disponibles</Text>
                </View>
            </View>
        );
    }

    const { width } = calculateChartDimensions(48); // account for container padding

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <RNLineChart
                data={data}
                width={width}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
            />
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
    chart: {
        marginVertical: 8,
        borderRadius: 16,
        marginLeft: -16 // Offset for chart padding
    },
    emptyContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        color: '#9CA3AF'
    }
});

export default LineChart;
