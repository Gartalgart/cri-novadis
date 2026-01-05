import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const FilterBar = ({ selectedPeriod, onPeriodChange }) => {
    const periods = [
        { id: 'month', label: 'Ce mois' },
        { id: 'quarter', label: 'Trimestre' },
        { id: 'year', label: 'Année' },
        { id: 'last_month', label: 'Mois dernier' }
    ];

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {periods.map((period) => (
                    <TouchableOpacity
                        key={period.id}
                        style={[
                            styles.periodButton,
                            selectedPeriod === period.id && styles.activeButton
                        ]}
                        onPress={() => onPeriodChange(period.id)}
                    >
                        <Text
                            style={[
                                styles.periodText,
                                selectedPeriod === period.id && styles.activeText
                            ]}
                        >
                            {period.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        paddingVertical: 12,
    },
    scrollContent: {
        paddingHorizontal: 4,
    },
    periodButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    activeButton: {
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
    },
    periodText: {
        color: '#6B7280',
        fontWeight: '500',
        fontSize: 14,
    },
    activeText: {
        color: '#FFFFFF',
        fontWeight: '600',
    }
});

export default FilterBar;
