import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TopSitesList = ({ sites, onSitePress }) => {
    if (!sites || sites.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Aucun site à afficher</Text>
            </View>
        );
    }

    const maxCount = Math.max(...sites.map(s => parseInt(s.total_interventions)));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Top 5 Sites</Text>
            {sites.map((site, index) => {
                const count = parseInt(site.total_interventions);
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                return (
                    <TouchableOpacity
                        key={site.site_id || index}
                        style={styles.itemContainer}
                        onPress={() => onSitePress && onSitePress(site)}
                        disabled={!onSitePress}
                    >
                        <View style={styles.rankBadge}>
                            <Text style={styles.rankText}>{index + 1}</Text>
                        </View>

                        <View style={styles.contentContainer}>
                            <View style={styles.row}>
                                <Text style={styles.siteName} numberOfLines={1}>{site.site_name}</Text>
                                <Text style={styles.countText}>{count} inter.</Text>
                            </View>

                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
                            </View>
                        </View>

                        <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
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
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 16,
    },
    emptyContainer: {
        padding: 16,
        alignItems: 'center',
    },
    emptyText: {
        color: '#9CA3AF',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    rankBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rankText: {
        color: '#4F46E5',
        fontSize: 12,
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        marginRight: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    siteName: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
        flex: 1,
        marginRight: 8,
    },
    countText: {
        fontSize: 12,
        color: '#6B7280',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 3,
    },
    progressBarFill: {
        height: 6,
        backgroundColor: '#4F46E5',
        borderRadius: 3,
    },
});

export default TopSitesList;

