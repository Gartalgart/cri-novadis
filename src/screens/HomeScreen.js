import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { COLORS, GLOBAL_STYLES, CRI_TYPES } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation, extraData }) => {
    // Extract user email and logout function from extraData
    // Note: extraData is passed from AppNavigator where we injected it
    const { userEmail, handleLogout } = extraData || {};

    const onLogoutPress = () => {
        Alert.alert(
            "Déconnexion",
            "Êtes-vous sûr de vouloir vous déconnecter ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Se déconnecter",
                    style: "destructive",
                    onPress: () => {
                        if (handleLogout) handleLogout();
                    }
                }
            ]
        );
    };

    // Add logout button to header dynamically
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={onLogoutPress} style={{ marginRight: 15 }}>
                    <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                </TouchableOpacity>
            ),
            headerTitle: userEmail ? () => (
                <View>
                    <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: 16 }}>Accueil</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{userEmail}</Text>
                </View>
            ) : 'Accueil'
        });
    }, [navigation, userEmail]);

    return (
        <View style={[GLOBAL_STYLES.container, styles.container]}>
            <View style={styles.header}>
                <Text style={styles.title}>Novadis CRI</Text>
                <Text style={styles.subtitle}>Générez vos comptes rendus d'intervention simplement</Text>
            </View>

            <View style={styles.menuContainer}>
                <TouchableOpacity
                    style={[styles.card, styles.projectCard]}
                    onPress={() => navigation.navigate('CRIProjet')}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons name="construct" size={40} color={COLORS.white} />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>CRI Projet</Text>
                        <Text style={styles.cardDescription}>Installation, mise en service et suivi de projets</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, styles.serviceCard]}
                    onPress={() => navigation.navigate('CRIService')}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons name="build" size={40} color={COLORS.white} />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>CRI Service</Text>
                        <Text style={styles.cardDescription}>Maintenance, dépannage et SAV</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, styles.historyCard]}
                    onPress={() => navigation.navigate('History')}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons name="time" size={40} color={COLORS.secondary} />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={[styles.cardTitle, styles.darkText]}>Historique</Text>
                        <Text style={[styles.cardDescription, styles.darkText]}>Consulter les CRIs enregistrés</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.secondary} />
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.version}>Version 1.0.0 MVP</Text>
                {userEmail && <Text style={styles.userEmail}>Connecté en tant que: {userEmail}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
    },
    header: {
        marginTop: 40,
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.darkGray,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    menuContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    projectCard: {
        backgroundColor: COLORS.primary,
    },
    serviceCard: {
        backgroundColor: COLORS.secondary,
    },
    historyCard: {
        backgroundColor: COLORS.lightGray,
        borderWidth: 1,
        borderColor: COLORS.gray,
    },
    iconContainer: {
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 5,
    },
    cardDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    darkText: {
        color: COLORS.darkGray,
    },
    footer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    version: {
        color: COLORS.gray,
        fontSize: 12,
    },
});

export default HomeScreen;
