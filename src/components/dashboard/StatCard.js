import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StatCard = ({ title, value, icon, color = '#4F46E5', subtitle, trend }) => {
    return (
        <View style={[styles.container, { borderLeftColor: color }]}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                    <MaterialCommunityIcons name={icon} size={24} color={color} />
                </View>
                {trend !== undefined && trend !== null && (
                    <View style={[styles.trendContainer, { backgroundColor: trend >= 0 ? '#DCFCE7' : '#FEE2E2' }]}>
                        <MaterialCommunityIcons
                            name={trend >= 0 ? 'arrow-up' : 'arrow-down'}
                            size={16}
                            color={trend >= 0 ? '#166534' : '#991B1B'}
                        />
                        <Text style={[styles.trendText, { color: trend >= 0 ? '#166534' : '#991B1B' }]}>
                            {Math.abs(trend)}%
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.value}>{value}</Text>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderLeftWidth: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
        flex: 1,
        minWidth: '45%'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12
    },
    iconContainer: {
        padding: 8,
        borderRadius: 8,
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
    },
    trendText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 2
    },
    content: {
        justifyContent: 'flex-end'
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    subtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4
    }
});

export default StatCard;
