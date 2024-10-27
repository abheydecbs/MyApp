import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Button, StyleSheet } from 'react-native';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';

// HomeScreen-komponent, der viser en liste af elementer fra Firebase Firestore
export default function HomeScreen({ navigation }) {
    // State til at gemme listen af elementer, loading-status og eventuelle fejlmeddelelser
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect kører, når komponenten renderes første gang
    useEffect(() => {
        // Funktion til at hente data asynkront fra Firestore
        const fetchData = async () => {
            try {
                // Henter dokumenter fra "items"-samlingen i Firestore
                const querySnapshot = await getDocs(collection(db, 'items'));
                // Mapper data fra hvert dokument og tilføjer et unikt ID
                const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setItems(data); // Gemmer de hentede data i items-state
            } catch (error) {
                console.error("Error fetching data: ", error); // Logger fejl i konsollen
                setError("Failed to fetch data"); // Gemmer en fejlmeddelelse i state
            } finally {
                setLoading(false); // Stopper loading-status uanset succes eller fejl
            }
        };

        fetchData(); // Kalder fetchData for at hente data ved komponentens start
    }, []);

    // Viser en loading-indikator, mens data hentes
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    // Viser en fejlmeddelelse, hvis data ikke kunne hentes
    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    // Returnerer UI for komponenten, når data er hentet uden fejl
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Items List</Text>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text>{item.name}</Text>
                        <Text>{item.description}</Text>
                    </View>
                )}
            />
            {/* Knappen der navigerer til MapScreen */}
            <Button
                title="Go to Map"
                onPress={() => navigation.navigate('Map')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemName: {
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 20,
    },
});
