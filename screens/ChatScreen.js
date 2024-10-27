import { View, SafeAreaView } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { Bubble, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatFaceData from '../services/ChatFaceData';
import SendMessage from '../services/Request';

// URL for chat-bot ansigtet, der vises som avatar
const CHAT_BOT_FACE = 'https://res.cloudinary.com/dknvsbuyy/image/upload/v1685678135/chat_1_c7eda483e3.png';

// ChatScreen-komponent, der viser chat UI og styrer chat-logik
export default function ChatScreen() {
    // State til beskeder, loading-status og chat-ansigtets farve
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatFaceColor, setChatFaceColor] = useState();

    // Start-samtalehistorik bruges som kontekst for AI-assistenten
    const conversationHistory = [
        { role: 'system', content: 'You are an assistant that serves as a tutor for master’s students learning business model theory...' },
        { role: 'assistant', content: 'Hello, I am your assistant. How can I help you?' }
    ];

    // useEffect kaldes ved komponentens første render for at hente det gemte chat-ansigt
    useEffect(() => {
        checkFaceId();
    }, []);

    // Funktion til at hente det valgte chat-ansigts ID fra AsyncStorage
    const checkFaceId = async () => {
        const id = await AsyncStorage.getItem('chatFaceId');
        // Hvis ID'et findes, vælges det tilsvarende chat-ansigt, ellers vælges det første ansigt
        const selectedChatFace = id ? ChatFaceData[id] : ChatFaceData[0];
        setChatFaceColor(selectedChatFace.primary);
        // Initial besked, der præsenterer chat-botten
        setMessages([
            {
                _id: 1,
                text: 'Hello, I am ' + selectedChatFace.name + '. How can I help you?',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: selectedChatFace.image,
                },
            },
        ]);
    };

    // onSend kaldes når brugeren sender en besked
    const onSend = useCallback((messages = []) => {
        // Tilføjer brugerens besked til chat-historikken
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        // Henter AI-bot respons hvis beskedtekst er til stede
        if (messages[0].text) {
            getBotResponse(messages[0].text);
        }
    }, []);

    // getBotResponse håndterer anmodningen til chatbotten og opdaterer historikken med svaret
    const getBotResponse = (msg) => {
        setLoading(true);
        const userMessage = { role: 'user', content: msg };
        conversationHistory.push(userMessage); // Tilføjer brugerbeskeden til samtalehistorikken

        // Send besked til chatbot API og håndter responsen
        SendMessage(conversationHistory)
            .then(response => {
                setLoading(false);
                if (response.content) {
                    const chatAIResp = {
                        _id: Math.random() * (9999999 - 1),
                        text: response.content,
                        createdAt: new Date(),
                        user: {
                            _id: 2,
                            name: 'React Native',
                            avatar: CHAT_BOT_FACE,
                        }
                    };
                    const botMessage = { role: 'assistant', content: response.content };
                    conversationHistory.push(botMessage); // Tilføjer chatbottens svar til historikken
                    setMessages(previousMessages => GiftedChat.append(previousMessages, chatAIResp)); // Opdaterer UI med chatbottens svar
                } else {
                    handleError();
                }
            })
            .catch(error => {
                console.error(error);
                handleError();
            });
    };

    // handleError viser en fejlbesked hvis API'en ikke kan svare
    const handleError = () => {
        setLoading(false);
        const chatAIResp = {
            _id: Math.random() * (9999999 - 1),
            text: "Sorry, I cannot help with it",
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'React Native',
                avatar: CHAT_BOT_FACE,
            }
        };
        setMessages(previousMessages => GiftedChat.append(previousMessages, chatAIResp));
    };

    // Returnerer UI-elementerne til chat-komponenten
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: chatFaceColor }}>
            <GiftedChat
                messages={messages} // Beskeder der skal vises
                onSend={messages => onSend(messages)} // Håndterer sending af beskeder
                user={{ _id: 1 }} // Identificerer brugeren i chatten
                renderBubble={(props) => ( // Tilpasser boblestil for brugeren og AI-assistenten
                    <Bubble {...props}
                            textStyle={{ right: { color: 'white' } }}
                            wrapperStyle={{
                                left: { backgroundColor: '#F0F0F0' },
                                right: { backgroundColor: '#0078fe' },
                            }}
                    />
                )}
                renderInputToolbar={(props) => ( // Tilpasser input-feltets stil
                    <InputToolbar {...props} containerStyle={{ backgroundColor: 'white' }} />
                )}
                renderSend={(props) => ( // Tilpasser send-knappens ikon og stil
                    <Send {...props}>
                        <View style={{ marginRight: 10, marginBottom: 5 }}>
                            <FontAwesome name="send" size={24} color="blue" />
                        </View>
                    </Send>
                )}
                alwaysShowSend // Viser altid send-knappen, selv når tekstfeltet er tomt
            />
        </SafeAreaView>
    );
}
