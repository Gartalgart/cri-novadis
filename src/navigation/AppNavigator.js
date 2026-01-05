import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

import {
    HomeScreen,
    CRIProjetScreen,
    CRIServiceScreen,
    HistoryScreen,
    AdminScreen,
    DashboardScreen,
    SiteDetailsScreen
} from '../screens';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const DashboardStack = createStackNavigator();

// Dashboard Stack wrapper (for nested navigation: Dashboard -> Details)
const DashboardNavigator = () => (
    <DashboardStack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: COLORS.primary },
            headerTintColor: COLORS.white,
        }}
    >
        <DashboardStack.Screen
            name="DashboardMain"
            component={DashboardScreen}
            options={{ headerShown: false }}
        />
        <DashboardStack.Screen
            name="SiteDetailsScreen"
            component={SiteDetailsScreen}
            options={{ title: 'Détails Site' }}
        />
    </DashboardStack.Navigator>
);

// Main Tabs (Home + Dashboard)
const MainTabNavigator = ({ extraData }) => (
    <Tab.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: COLORS.primary },
            headerTintColor: COLORS.white,
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: 'gray',
        }}
    >
        <Tab.Screen
            name="Accueil"
            children={(props) => <HomeScreen {...props} extraData={extraData} />}
            options={{
                title: 'Accueil',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" size={size} color={color} />
                ),
            }}
        />
        <Tab.Screen
            name="DashboardTab"
            component={DashboardNavigator}
            options={{
                title: 'Dashboard',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="chart-box-outline" size={size} color={color} />
                ),
            }}
        />
    </Tab.Navigator>
);

const AppNavigator = ({ extraData }) => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="MainTabs"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: COLORS.primary,
                    },
                    headerTintColor: COLORS.white,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitleVisible: false,
                }}
            >
                {/* Main Tabs becomes the new Home */}
                <Stack.Screen
                    name="MainTabs"
                    children={(props) => <MainTabNavigator {...props} extraData={extraData} />}
                    options={{ headerShown: false }}
                />

                {/* Other screens remain in the main stack for full screen experience */}
                <Stack.Screen
                    name="CRIProjet"
                    component={CRIProjetScreen}
                    options={{ title: 'Nouveau CRI Projet' }}
                />
                <Stack.Screen
                    name="CRIService"
                    component={CRIServiceScreen}
                    options={{ title: 'Nouveau CRI Service' }}
                />
                <Stack.Screen
                    name="History"
                    component={HistoryScreen}
                    options={{ title: 'Historique' }}
                />
                <Stack.Screen
                    name="Admin"
                    component={AdminScreen}
                    options={{ title: 'Administration' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
