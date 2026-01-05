import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Alert,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabase';
import { COLORS } from '../utils/constants';

/**
 * AdminScreen Component
 * Allows management of authorized users.
 */
const AdminScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    // New User State
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [department, setDepartment] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('authorized_users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de charger les utilisateurs');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async () => {
        if (!email.trim() || !fullName.trim()) {
            Alert.alert('Erreur', 'Email et Nom complet sont requis');
            return;
        }

        try {
            const { error } = await supabase
                .from('authorized_users')
                .insert([{
                    email: email.trim().toLowerCase(),
                    full_name: fullName.trim(),
                    department: department.trim(),
                    is_active: true
                }]);

            if (error) throw error;

            Alert.alert('Succès', 'Utilisateur ajouté');
            setModalVisible(false);
            resetForm();
            loadUsers();
        } catch (error) {
            Alert.alert('Erreur', "Echec de l'ajout. L'email existe peut-être déjà.");
            console.error(error);
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            const { error } = await supabase
                .from('authorized_users')
                .update({ is_active: !user.is_active })
                .eq('id', user.id);

            if (error) throw error;
            loadUsers(); // Refresh list to show change
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de modifier le statut');
        }
    };

    const handleDeleteUser = (user) => {
        Alert.alert(
            'Confirmation',
            `Supprimer définitivement ${user.full_name} ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('authorized_users')
                                .delete()
                                .eq('id', user.id);

                            if (error) throw error;
                            loadUsers();
                        } catch (err) {
                            Alert.alert('Erreur', 'Impossible de supprimer l\'utilisateur');
                        }
                    }
                }
            ]
        );
    };

    const resetForm = () => {
        setEmail('');
        setFullName('');
        setDepartment('');
    };

    const renderItem = ({ item }) => (
        <View style={styles.userCard}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.full_name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text style={styles.userDept}>{item.department || 'Aucun département'}</Text>
                {item.last_login && (
                    <Text style={styles.lastLogin}>
                        Dernière connexion: {new Date(item.last_login).toLocaleDateString()}
                    </Text>
                )}
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    onPress={() => handleToggleStatus(item)}
                    style={[styles.actionBtn, item.is_active ? styles.activeBtn : styles.inactiveBtn]}
                >
                    <Ionicons
                        name={item.is_active ? "checkmark-circle" : "ban"}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleDeleteUser(item)}
                    style={[styles.actionBtn, styles.deleteBtn]}
                >
                    <Ionicons name="trash" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Gestion Utilisateurs</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
                    <Ionicons name="add" size={24} color="white" />
                    <Text style={styles.addBtnText}>Ajouter</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>Aucun utilisateur trouvé.</Text>}
                />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Nouvel Utilisateur</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Email *"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Nom Complet *"
                            value={fullName}
                            onChangeText={setFullName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Département"
                            value={department}
                            onChangeText={setDepartment}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalBtnText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.confirmBtn]}
                                onPress={handleAddUser}
                            >
                                <Text style={[styles.modalBtnText, { color: 'white' }]}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        padding: 20,
        backgroundColor: COLORS.primary || '#0066CC',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 8,
        borderRadius: 8,
    },
    addBtnText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    list: {
        padding: 15,
    },
    userCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    userDept: {
        fontSize: 12,
        color: '#999',
    },
    lastLogin: {
        fontSize: 10,
        color: '#aaa',
        marginTop: 4,
        fontStyle: 'italic',
    },
    actions: {
        flexDirection: 'row',
    },
    actionBtn: {
        padding: 8,
        borderRadius: 8,
        marginLeft: 8,
    },
    activeBtn: {
        backgroundColor: '#34C759',
    },
    inactiveBtn: {
        backgroundColor: '#999',
    },
    deleteBtn: {
        backgroundColor: '#FF3B30',
    },
    loader: {
        marginTop: 50,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#999',
        fontSize: 16,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        backgroundColor: '#F0F2F5',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E1E4E8',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalBtn: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#E5E5EA',
        marginRight: 10,
    },
    confirmBtn: {
        backgroundColor: COLORS.primary || '#0066CC',
        marginLeft: 10,
    },
    modalBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default AdminScreen;
