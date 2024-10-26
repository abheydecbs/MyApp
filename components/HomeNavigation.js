import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ChatScreen from '../screens/ChatScreen';
import AIScreen from "../screens/AIScreen";

const Stack = createStackNavigator();

export default function HomeNavigation() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="aiscreen" component={AIScreen} />
            <Stack.Screen name="chat" component={ChatScreen} />
        </Stack.Navigator>
    );
}
