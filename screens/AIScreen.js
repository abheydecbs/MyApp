import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChatFaceData from "../services/ChatFaceData";

// Komponent AIScreen viser chatansigter og lader selv brugeren vælge en
export default function AIScreen({ navigation }) {
    // State for chat-ansigtsdata og det valgte chat-ansigt
    const [chatFaceData, setChatFaceData] = useState([]);
    const [selectedChatFace, setSelectedChatFace] = useState([]);

    // useEffect køres ved første render for at initialisere data og tjekke gemt chat-ansigt
    useEffect(() => {
        setChatFaceData(ChatFaceData);  // Sætter data for chatansigter
        checkFaceId(); // Henter gemt chat-ansigts-id, hvis det findes
    }, []);

    // Funktion til at hente gemt chat-ansigts-id fra AsyncStorage
    const checkFaceId = async () => {
        const id = await AsyncStorage.getItem("chatFaceId");
        // Hvis et id findes, vælges det tilhørende chat-ansigt; ellers vælges det første
        id
            ? setSelectedChatFace(ChatFaceData[id])
            : setSelectedChatFace(ChatFaceData[0]);
    };

    // Funktion til at opdatere det valgte chat-ansigt ved tryk og gemme det i AsyncStorage
    const onChatFacePress = async (id) => {
        setSelectedChatFace(ChatFaceData[id - 1]); // Opdaterer valgt ansigt
        await AsyncStorage.setItem("chatFaceId", (id - 1).toString()); // Gemmer id lokalt
    };

    // Returnerer UI-elementer til visning af brugerens valgte chat-ansigt og interaktion
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View style={{ alignItems: "center" }}>
                <Text style={[{ color: selectedChatFace?.primary }, { fontSize: 30 }]}>
                    Hello,
                </Text>
                <Text style={[{ color: selectedChatFace?.primary }, { fontSize: 30, fontWeight: "bold" }]}>
                    I am {selectedChatFace.name}
                </Text>

                {/* Billede af det valgte chat-ansigt */}
                <Image
                    source={{ uri: selectedChatFace.image }}
                    style={{ height: 150, width: 150, marginTop: 20 }}
                />
                <Text style={{ marginTop: 30, fontSize: 25 }}>How Can I help you?</Text>

                {/* Container til at vise valgmuligheder for andre chat-ansigter */}
                <View
                    style={{
                        marginTop: 20,
                        backgroundColor: "#F5F5F5",
                        alignItems: "center",
                        height: 110,
                        padding: 10,
                        borderRadius: 10,
                    }}
                >
                    {/* FlatList til vandret visning af alle chat-ansigter som brugeren kan vælge */}
                    <FlatList
                        data={chatFaceData}
                        horizontal={true}
                        renderItem={({ item }) =>
                            item.id !== selectedChatFace.id && (
                                <TouchableOpacity
                                    style={{ margin: 15 }}
                                    onPress={() => onChatFacePress(item.id)}
                                >
                                    <Image
                                        source={{ uri: item.image }}
                                        style={{ width: 40, height: 40 }}
                                    />
                                </TouchableOpacity>
                            )
                        }
                    />
                    {/* Tekst under chat-ansigtsbillederne */}
                    <Text style={{ marginTop: 5, fontSize: 17, color: "#B0B0B0" }}>
                        Choose Your Fav ChatBuddy
                    </Text>
                </View>

                {/* Knappen for at navigere til chat-skærmen */}
                <TouchableOpacity
                    style={[
                        { backgroundColor: selectedChatFace.primary },
                        {
                            marginTop: 40,
                            padding: 17,
                            width: Dimensions.get("screen").width * 0.6,
                            borderRadius: 100,
                            alignItems: "center",
                        },
                    ]}
                    onPress={() => navigation.navigate("Chat")}
                >
                    <Text style={{ fontSize: 16, color: "#fff" }}>Let's Chat</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
