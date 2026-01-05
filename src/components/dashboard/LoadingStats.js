import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const LoadingStats = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.text}>Chargement des données...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        minHeight: 200
    },
    text: {
        marginTop: 12,
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500'
    }
});

export default LoadingStats;
