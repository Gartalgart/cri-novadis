import 'react-native-gesture-handler'; // Must be at the top
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import LoadingAnimation from './src/components/LoadingAnimation';

const Stack = createStackNavigator();

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userEmail, setUserEmail] = useState(null);

    // Session duration: 7 days
    const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const sessionJson = await AsyncStorage.getItem('userSession');
            if (sessionJson) {
                const session = JSON.parse(sessionJson);
                const loginTime = new Date(session.loginDate).getTime();
                const now = new Date().getTime();

                // Check if session is valid (not expired)
                if (now - loginTime < SESSION_DURATION) {
                    setIsAuthenticated(true);
                    setUserEmail(session.email);
                } else {
                    // Session expired
                    await handleLogout();
                }
            }
        } catch (error) {
            console.error('Session check failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSuccess = (email) => {
        setUserEmail(email);
        setIsAuthenticated(true);
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.multiRemove(['userSession']);
            setIsAuthenticated(false);
            setUserEmail(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (isLoading) {
        return <LoadingAnimation />;
    }

    return (
        <SafeAreaProvider>
            {/* 
               We wrap everything in NavigationContainer here if AppNavigator doesn't already have one.
               However, looking at AppNavigator.js, it ALREADY has a NavigationContainer.
               To properly integrate login, we should pass the auth state TO AppNavigator 
               or simply conditionally render either LoginScreen OR AppNavigator.
               
               Given that AppNavigator likely handles inner stack navigation, 
               conditionally rendering it is the cleanest approach here 
               without rewriting the entire AppNavigator.
            */}

            {!isAuthenticated ? (
                <LoginScreen onLoginSuccess={handleLoginSuccess} />
            ) : (
                <AppNavigator
                    // You might want to pass these down if needed, 
                    // though usually Context is better for global state.
                    // For now, we'll attach logout to the initial params of the screens inside AppNavigator
                    // But since AppNavigator is a component, we can't easily pass props *into* its screens 
                    // without Context or modifying AppNavigator.
                    // 
                    // For this step, we will Modify AppNavigator in the next step or 
                    // ensure screens can access logout via a simple prop drilling workaround 
                    // or just updating AppNavigator to accept screenProps (deprecated) or Context.
                    //
                    // To keep it simple and follow requirements: 
                    // The requirement says "add logout to HomeScreen". 
                    // We'll pass a Context Provider or just let AppNavigator handle it.
                    // Let's pass the logout handler as a prop to AppNavigator so it can pass it down.
                    extraData={{ userEmail, handleLogout }}
                />
            )}

            <StatusBar style="light" />
        </SafeAreaProvider>
    );
}
