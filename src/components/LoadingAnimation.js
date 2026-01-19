import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';

const LoadingAnimation = () => {
    return (
        <View style={styles.container}>
            <View style={styles.animationContainer}>
                <ActivityIndicator size="large" color="#0066CC" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>NOVADIS</Text>
                <Text style={styles.subtitle}>CRI</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 1)',
    },
    animationContainer: {
        marginBottom: 20,
        transform: [{ scale: 1.5 }],
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0066CC',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600',
    }
});

export default LoadingAnimation;
