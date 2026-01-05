import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart as RNPieChart } from 'react-native-chart-kit';
import { calculateChartDimensions } from '../../utils/chartHelpers';

const PieChart = ({ data, title }) => {
    const { width } = calculateChartDimensions(32);

    if (!data || data.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <RNPieChart
                data={data}
                width={width}
                height={220}
                chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor={"value"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                absolute
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
        marginBottom: 8,
    }
});

export default PieChart;
