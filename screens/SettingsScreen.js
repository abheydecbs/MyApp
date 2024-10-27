import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
// SettingsScreen viser 3 forskellige Buttons
export default function SettingsScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings Screen</Text>
            <Button
                title="Change Profile"
                onPress={() => navigation.navigate('Profile')}  // Fører dig hen til ProfileScreen
            />
            <Button
                title="Notifications"
                onPress={() => alert('Notifications settings')} // Giver dig en pop-up notification
            />
            <Button
                title="Theme"
                onPress={() => alert('Theme settings')} // Giver dig en pop-up notification
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});
