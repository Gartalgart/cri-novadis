import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, GLOBAL_STYLES, CRI_TYPES } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { getAllCRIs } from '../utils/storage';
import { generatePDF } from '../utils/pdfGenerator';

const HistoryScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all, projet, service
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fullData, setFullData] = useState([]);

    useFocusEffect(
        useCallback(() => {
            loadCRIs();
        }, [])
    );

    const loadCRIs = async () => {
        setLoading(true);
        const cris = await getAllCRIs();
        // Sort by date desc (assuming creation order or date field)
        // We can use date_intervention or just reverse if push order
        cris.reverse();
        setFullData(cris);
        setData(cris);
        setLoading(false);
    };

    useEffect(() => {
        // Filter logic
        let filtered = fullData;

        if (filter !== 'all') {
            filtered = filtered.filter(item => item.type === filter);
        }

        if (search) {
            const lowerSearch = search.toLowerCase();
            filtered = filtered.filter(item =>
                (item.nom_client && item.nom_client.toLowerCase().includes(lowerSearch)) ||
                (item.numero_cri && item.numero_cri.toLowerCase().includes(lowerSearch))
            );
        }

        setData(filtered);
    }, [search, filter, fullData]);

    const handleItemPress = (item) => {
        Alert.alert(
            'Options',
            `CRI N° ${item.numero_cri}`,
            [
                { text: 'Générer PDF', onPress: () => generatePDF(item) },
                { text: 'Annuler', style: 'cancel' }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleItemPress(item)}>
            <View style={styles.cardHeader}>
                <Text style={styles.criNumber}>{item.numero_cri}</Text>
                <View style={[styles.badge, item.type === 'projet' ? styles.badgeProjet : styles.badgeService]}>
                    <Text style={styles.badgeText}>{item.type ? item.type.toUpperCase() : 'INCONNU'}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.row}>
                    <Ionicons name="business" size={16} color={COLORS.gray} style={styles.icon} />
                    <Text style={styles.clientName}>{item.nom_client}</Text>
                </View>
                <View style={styles.row}>
                    <Ionicons name="calendar" size={16} color={COLORS.gray} style={styles.icon} />
                    <Text style={styles.date}>{item.date_intervention ? new Date(item.date_intervention).toLocaleDateString() : 'N/A'}</Text>
                </View>
                <Text style={[styles.status, { color: COLORS.success }]}>
                    Sauvegardé
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={COLORS.gray} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher (Client, N° CRI)..."
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <Ionicons name="close-circle" size={20} color={COLORS.gray} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Dashboard Shortcut */}
                <TouchableOpacity
                    style={styles.statsButton}
                    onPress={() => navigation.navigate('MainTabs', { screen: 'DashboardTab' })}
                >
                    <Ionicons name="stats-chart" size={18} color={COLORS.primary} />
                    <Text style={styles.statsButtonText}>Voir les statistiques</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.filters}>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'all' && styles.filterActive]}
                    onPress={() => setFilter('all')}
                >
                    <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>Tous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'projet' && styles.filterActive]}
                    onPress={() => setFilter('projet')}
                >
                    <Text style={[styles.filterText, filter === 'projet' && styles.filterTextActive]}>Projets</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'service' && styles.filterActive]}
                    onPress={() => setFilter('service')}
                >
                    <Text style={[styles.filterText, filter === 'service' && styles.filterTextActive]}>Services</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Aucun CRI trouvé</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
    },
    searchContainer: {
        padding: 15,
        backgroundColor: COLORS.white,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.lightGray,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        height: '100%',
    },
    statsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        padding: 10,
        backgroundColor: '#EEF2FF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    statsButtonText: {
        color: COLORS.primary,
        fontWeight: '600',
        marginLeft: 8,
        fontSize: 14,
    },
    filters: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: COLORS.lightGray,
    },
    filterActive: {
        backgroundColor: COLORS.primary,
    },
    filterText: {
        color: COLORS.darkGray,
        fontSize: 12,
        fontWeight: '600',
    },
    filterTextActive: {
        color: COLORS.white,
    },
    listContent: {
        padding: 15,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    criNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.darkGray,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeProjet: {
        backgroundColor: COLORS.primary,
    },
    badgeService: {
        backgroundColor: COLORS.secondary,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardBody: {
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
        paddingTop: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    icon: {
        marginRight: 8,
        width: 20,
    },
    clientName: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.black,
    },
    date: {
        fontSize: 14,
        color: COLORS.gray,
    },
    status: {
        marginTop: 5,
        fontSize: 12,
        fontWeight: 'bold',
        alignSelf: 'flex-end',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: COLORS.gray,
        fontSize: 16,
    },
});

export default HistoryScreen;
