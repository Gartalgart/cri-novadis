import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { COLORS } from '../utils/constants';

import {
    HomeScreen,
    CRIProjetScreen,
    CRIServiceScreen,
    HistoryScreen,
    AdminScreen
} from '../screens';

const Stack = createStackNavigator();

const AppNavigator = ({ extraData }) => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
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
                <Stack.Screen
                    name="Home"
                >
                    {(props) => <HomeScreen {...props} extraData={extraData} />}
                </Stack.Screen>
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
                    options={{ title: 'Administration', headerShown: true }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
