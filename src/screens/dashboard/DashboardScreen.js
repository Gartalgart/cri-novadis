import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Components
import StatCard from '../../components/dashboard/StatCard';
import LineChart from '../../components/dashboard/LineChart';
import BarChart from '../../components/dashboard/BarChart';
import TopSitesList from '../../components/dashboard/TopSitesList';
import FilterBar from '../../components/dashboard/FilterBar';
import LoadingStats from '../../components/dashboard/LoadingStats';

// Services & Utils
import { dashboardService } from '../../services/dashboard/dashboardService';
import { getPeriodDates, formatDateForDisplay } from '../../utils/dateHelpers';
import { formatChartData } from '../../utils/chartHelpers';

const DashboardScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [period, setPeriod] = useState('month');

    // Data State
    const [globalStats, setGlobalStats] = useState(null);
    const [topSites, setTopSites] = useState([]);
    const [typeStats, setTypeStats] = useState([]);
    const [monthlyData, setMonthlyData] = useState({ labels: [], datasets: [] });

    const loadDashboardData = useCallback(async (selectedPeriod = period) => {
        try {
            const { start, end } = getPeriodDates(selectedPeriod);

            // Execute all requests in parallel
            const [stats, sites, types, history] = await Promise.all([
                dashboardService.fetchGlobalStats(start, end),
                dashboardService.fetchTopSites(start, end, 5),
                dashboardService.fetchTypeStats(start, end),
                dashboardService.fetchMonthlyData(6) // Always show last 6 months trend
            ]);

            setGlobalStats(stats);
            setTopSites(sites);

            // Format type stats for BarChart
            const formattedTypes = types.map((t, i) => ({
                label: t.intervention_type.replace('_', ' '),
                value: parseInt(t.total_interventions),
                // Generate colors or use a palette
                color: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][i % 5]
            }));
            setTypeStats(formattedTypes);

            // Format monthly data for LineChart
            // history is [{ month: '2023-01...', count: 10 }]
            const chartData = {
                labels: history.map(h => format(new Date(h.month), 'MMM', { locale: fr })),
                datasets: [{
                    data: history.map(h => parseInt(h.count))
                }]
            };
            setMonthlyData(chartData);

        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', 'Impossible de charger les données du tableau de bord');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [period]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadDashboardData();
    }, [loadDashboardData]);

    const handlePeriodChange = (newPeriod) => {
        setLoading(true);
        setPeriod(newPeriod);
    };

    const handleSitePress = (site) => {
        navigation.navigate('SiteDetailsScreen', {
            siteId: site.site_id,
            siteName: site.site_name
        });
    };

    if (loading && !refreshing && !globalStats) {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Tableau de Bord</Text>
                    <Text style={styles.headerDate}>{formatDateForDisplay(new Date())}</Text>
                </View>
                <LoadingStats />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.mainContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />
            }
        >
            {/* Header Section */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Tableau de Bord</Text>
                    <Text style={styles.headerDate}>{formatDateForDisplay(new Date())}</Text>
                </View>
                <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
                    <Text style={styles.refreshBtnText}>Actualiser</Text>
                </TouchableOpacity>
            </View>

            {/* Filter Section */}
            <FilterBar selectedPeriod={period} onPeriodChange={handlePeriodChange} />

            {/* Key Metrics Grid */}
            <View style={styles.statsGrid}>
                <View style={styles.statsRow}>
                    <StatCard
                        title="Interventions"
                        value={globalStats?.totalInterventions || 0}
                        icon="wrench"
                        color="#4F46E5"
                        subtitle="Total sur la période"
                    />
                    <StatCard
                        title="Sites Actifs"
                        value={globalStats?.activeSites || 0}
                        icon="domain"
                        color="#10B981"
                    />
                </View>
                <View style={styles.statsRow}>
                    <StatCard
                        title="Durée Moyenne"
                        value={`${globalStats?.avgDuration || 0} min`}
                        icon="clock-outline"
                        color="#F59E0B"
                        subtitle="Par intervention"
                    />
                    <StatCard
                        title="Taux Complétion"
                        value={`${globalStats?.completionRate || 0}%`}
                        icon="check-circle-outline"
                        color="#EF4444"
                        trend={globalStats?.completionRate > 80 ? 5 : -2} // Mock trend for demo
                    />
                </View>
            </View>

            {/* Monthly Trend Chart */}
            <LineChart
                data={monthlyData}
                title="Évolution des 6 derniers mois"
            />

            {/* Top Sites */}
            <TopSitesList
                sites={topSites}
                onSitePress={handleSitePress}
            />

            {/* Intervention Types Distribution */}
            <BarChart
                data={typeStats}
                title="Distribution par Type (Top 5)"
            />

            <View style={styles.footer}>
                <Text style={styles.footerText}>Données mises à jour en temps réel</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    headerDate: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    refreshBtn: {
        padding: 8,
    },
    refreshBtnText: {
        color: '#4F46E5',
        fontWeight: '600'
    },
    statsGrid: {
        padding: 16,
        paddingBottom: 0,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footer: {
        padding: 20,
        alignItems: 'center',
        marginBottom: 20
    },
    footerText: {
        color: '#9CA3AF',
        fontSize: 12
    }
});

export default DashboardScreen;

