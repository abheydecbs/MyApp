import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

// MapScreen-komponent, der viser et kort
const MapScreen = () => {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                // Angiver den oprindelige region, kortet skal centreres på ved første visning
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    map: {
        flex: 1,
    },
});

export default MapScreen;
