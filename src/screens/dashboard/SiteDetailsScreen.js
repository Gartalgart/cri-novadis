import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import PieChart from '../../components/dashboard/PieChart';
import StatCard from '../../components/dashboard/StatCard';
import { dashboardService } from '../../services/dashboard/dashboardService';

const SiteDetailsScreen = ({ route, navigation }) => {
    const { siteId, siteName } = route.params;
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState(null);

    useEffect(() => {
        loadSiteDetails();
    }, [siteId]);

    const loadSiteDetails = async () => {
        try {
            const data = await dashboardService.fetchSiteDetails(siteId);
            setDetails(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', 'Impossible de charger les détails du site');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    if (!details) {
        return (
            <View style={styles.container}>
                <Text>Aucune donnée disponible</Text>
            </View>
        );
    }

    const { site, recentInterventions, stats } = details;

    // Pie Chart Data
    const pieData = stats.types.map((t, i) => ({
        name: t.name.replace('_', ' '),
        population: t.value,
        color: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][i % 5],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12
    }));

    return (
        <ScrollView style={styles.container}>
            {/* Header Info */}
            <View style={styles.header}>
                <Text style={styles.siteTitle}>{site?.name || siteName}</Text>
                <Text style={styles.siteAddress}>
                    {site?.address}, {site?.postal_code} {site?.city}
                </Text>
                <View style={styles.contactRow}>
                    <MaterialCommunityIcons name="account" size={16} color="#6B7280" />
                    <Text style={styles.contactText}>{site?.contact_name || 'N/C'}</Text>
                </View>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsRow}>
                <StatCard
                    title="Total Interventions"
                    value={stats.total}
                    icon="clipboard-list"
                    color="#4F46E5"
                />
                <StatCard
                    title="Types Uniques"
                    value={stats.types.length}
                    icon="shape"
                    color="#10B981"
                />
            </View>

            {/* Type Distribution */}
            <PieChart data={pieData} title="Répartition par Type" />

            {/* Recent Activity */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interventions Récentes</Text>
                {recentInterventions.map((intervention) => (
                    <TouchableOpacity
                        key={intervention.id}
                        style={styles.interventionItem}
                        onPress={() => Alert.alert('Détail', intervention.title)} // Navigate to details if implemented
                    >
                        <View style={styles.interventionHeader}>
                            <Text style={styles.interventionDate}>
                                {format(new Date(intervention.start_date), 'dd MMM yyyy', { locale: fr })}
                            </Text>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: intervention.status === 'terminee' ? '#DCFCE7' : '#FEF3C7' }
                            ]}>
                                <Text style={[
                                    styles.statusText,
                                    { color: intervention.status === 'terminee' ? '#166534' : '#92400E' }
                                ]}>
                                    {intervention.status === 'terminee' ? 'Terminée' : 'En cours'}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.interventionTitle}>{intervention.title}</Text>
                        <Text style={styles.interventionType}>
                            {intervention.intervention_type?.replace('_', ' ')}
                        </Text>
                        <View style={styles.techRow}>
                            <MaterialCommunityIcons name="account-wrench" size={14} color="#9CA3AF" />
                            <Text style={styles.techName}>{intervention.technician_name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginBottom: 16,
    },
    siteTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    siteAddress: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactText: {
        marginLeft: 6,
        color: '#4B5563',
        fontSize: 14,
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    section: {
        padding: 16,
        paddingTop: 0,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    interventionItem: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    interventionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    interventionDate: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
    },
    interventionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
        marginBottom: 4,
    },
    interventionType: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
        textTransform: 'capitalize',
    },
    techRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    techName: {
        fontSize: 12,
        color: '#9CA3AF',
        marginLeft: 4,
    }
});

export default SiteDetailsScreen;
