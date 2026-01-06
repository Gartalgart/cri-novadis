import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';

const LoadingAnimation = () => {
    return (
        <View style={styles.container}>
            <View style={styles.animationContainer}>
                <LottieView
                    source={{ uri: 'https://lottie.host/0e0d8385-d71b-419a-9892-0b73c461376b/uVw09C0632.lottie' }}
                    autoPlay
                    loop
                    style={styles.lottie}
                />
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
        backgroundColor: 'rgba(255, 255, 255, 1)', // White background for the loading screen
    },
    animationContainer: {
        width: '80%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        alignItems: 'center',
        // If there was a "square" (carré) here before, the animation replaces it.
        // The user mentioned "novadis cri" is written there. 
        // We add it here to ensure the branding remains.
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
