import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function SettingsScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings Screen</Text>
            <Button
                title="Change Profile"
                onPress={() => navigation.navigate('Profile')}
            />
            <Button
                title="Notifications"
                onPress={() => alert('Notifications settings')}
            />
            <Button
                title="Theme"
                onPress={() => alert('Theme settings')}
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
