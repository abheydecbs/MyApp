import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Button, StyleSheet } from 'react-native';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';

export default function HomeScreen({ navigation }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'items'));
                const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setItems(data);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

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
            <Button
                title="Go to Map"
                onPress={() => navigation.navigate('Map')} // Naviger til MapScreen
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
