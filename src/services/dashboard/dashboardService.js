import { supabase } from '../../config/supabase';

// Service for fetching dashboard data
export const dashboardService = {

    /**
     * Fetch global dashboard statistics
     * @param {Date} dateFrom 
     * @param {Date} dateTo 
     */
    async fetchGlobalStats(dateFrom = null, dateTo = null) {
        console.log('🔄 [dashboardService] Fetching global stats...');
        try {
            // We can use get_stats_by_site to aggregate global data
            // This avoids fetching all rows or creating a new RPC
            const { data: siteStats, error } = await supabase
                .rpc('get_stats_by_site', {
                    date_from: dateFrom,
                    date_to: dateTo
                });

            if (error) {
                console.error('❌ [dashboardService] Error fetching site stats for global calc:', error);
                throw error;
            }

            console.log(`✅ [dashboardService] Raw site stats received: ${siteStats?.length || 0} records`);

            if (!siteStats || siteStats.length === 0) {
                return {
                    totalInterventions: 0,
                    activeSites: 0,
                    avgDuration: 0,
                    completionRate: 0,
                    completedCount: 0
                };
            }

            // Aggregate results
            const totalInterventions = siteStats.reduce((sum, site) => sum + parseInt(site.total_interventions), 0);
            const activeSites = siteStats.filter(s => parseInt(s.total_interventions) > 0).length;

            // Calculate weighted average duration
            const totalDurationMinutes = siteStats.reduce((sum, site) => {
                const duration = parseFloat(site.avg_duration || 0);
                // Ignore negative durations (bad data)
                const validDuration = Math.max(0, duration);
                return sum + (validDuration * parseInt(site.total_interventions));
            }, 0);
            const avgDuration = totalInterventions > 0 ? totalDurationMinutes / totalInterventions : 0;

            const completedCount = siteStats.reduce((sum, site) => sum + parseInt(site.completed_count), 0);
            const completionRate = totalInterventions > 0 ? Math.round((completedCount / totalInterventions) * 100) : 0;

            const result = {
                totalInterventions,
                activeSites,
                avgDuration: Math.round(avgDuration), // Keep in minutes for display formatting
                completionRate,
                completedCount
            };

            console.log('✅ [dashboardService] Global stats calculated:', result);
            return result;

        } catch (error) {
            console.error('❌ [dashboardService] Exception in fetchGlobalStats:', error);
            return null;
        }
    },

    /**
     * Fetch statistics grouped by site
     * @param {Date} dateFrom 
     * @param {Date} dateTo 
     * @param {number} limit 
     */
    async fetchTopSites(dateFrom = null, dateTo = null, limit = 5) {
        console.log(`🔄 [dashboardService] Fetching top ${limit} sites...`);
        try {
            const { data, error } = await supabase
                .rpc('get_stats_by_site', {
                    date_from: dateFrom,
                    date_to: dateTo
                });

            if (error) {
                console.error('❌ [dashboardService] Error fetching top sites:', error);
                throw error;
            }

            // Sort and limit in JS since RPC sorts by total descending already
            const result = data.slice(0, limit);
            console.log(`✅ [dashboardService] Top sites fetched: ${result.length}`);
            return result;
        } catch (error) {
            console.error('❌ [dashboardService] Exception in fetchTopSites:', error);
            return [];
        }
    },

    /**
     * Fetch statistics grouped by intervention type
     * @param {Date} dateFrom 
     * @param {Date} dateTo 
     */
    async fetchTypeStats(dateFrom = null, dateTo = null) {
        console.log('🔄 [dashboardService] Fetching type stats...');
        try {
            const { data, error } = await supabase
                .rpc('get_stats_by_type', {
                    date_from: dateFrom,
                    date_to: dateTo
                });

            if (error) {
                console.error('❌ [dashboardService] Error fetching type stats:', error);
                throw error;
            }

            console.log(`✅ [dashboardService] Type stats fetched: ${data?.length || 0} types`);
            return data;
        } catch (error) {
            console.error('❌ [dashboardService] Exception in fetchTypeStats:', error);
            return [];
        }
    },

    /**
     * Fetch monthly intervention data for chart
     * @param {number} months Number of months to look back
     */
    async fetchMonthlyData(months = 6) {
        console.log(`🔄 [dashboardService] Fetching monthly data for last ${months} months...`);
        try {
            const { data, error } = await supabase
                .rpc('get_monthly_interventions', { months });

            if (error) {
                console.error('❌ [dashboardService] Error fetching monthly data:', error);
                throw error;
            }

            // Transform for chart usage (ensure chronological order)
            const result = data.reverse();
            console.log(`✅ [dashboardService] Monthly data fetched: ${result.length} months`);
            return result;
        } catch (error) {
            console.error('❌ [dashboardService] Exception in fetchMonthlyData:', error);
            return [];
        }
    },

    /**
     * Fetch detailed statistics for a specific site
     * @param {string} siteId 
     */
    async fetchSiteDetails(siteId) {
        console.log(`🔄 [dashboardService] Fetching details for site ${siteId}...`);
        try {
            // 1. Get site info
            const { data: siteData, error: siteError } = await supabase
                .from('sites')
                .select('*')
                .eq('id', siteId)
                .single();

            if (siteError) throw siteError;

            // 2. Get recent interventions
            const { data: interventions, error: intError } = await supabase
                .from('interventions')
                .select('*')
                .eq('site_id', siteId)
                .order('start_date', { ascending: false })
                .limit(20);

            if (intError) throw intError;

            // 3. Calculate basic stats from interventions
            const totalInterventions = interventions.length; // Note: this is only of the last 20 fetched. 
            // For accurate totals we would need a count query or use aggregate function.
            // But for "details" screen showing recent activity, this might be fine or we fetch count separately.

            // Let's get the accurate count
            const { count: totalCount, error: countError } = await supabase
                .from('interventions')
                .select('*', { count: 'exact', head: true })
                .eq('site_id', siteId);

            if (countError) console.warn('⚠️ [dashboardService] Error fetching total count:', countError);

            // Calculate type distribution for this site
            const types = {};
            interventions.forEach(i => {
                types[i.intervention_type] = (types[i.intervention_type] || 0) + 1;
            });
            const typeDistribution = Object.keys(types).map(key => ({
                name: key ? key : 'Inconnu',
                value: types[key],
                color: '#4F46E5', // Will be overridden by helper
                legendFontColor: '#7F7F7F',
                legendFontSize: 12
            }));

            const result = {
                site: siteData,
                recentInterventions: interventions,
                stats: {
                    total: totalCount || totalInterventions,
                    types: typeDistribution
                }
            };

            console.log('✅ [dashboardService] Site details fetched successfully');
            return result;

        } catch (error) {
            console.error('❌ [dashboardService] Exception in fetchSiteDetails:', error);
            return null;
        }
    }
};
