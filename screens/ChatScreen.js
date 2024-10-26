import { View, SafeAreaView } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { Bubble, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatFaceData from '../services/ChatFaceData';
import SendMessage from '../services/Request';

const CHAT_BOT_FACE = 'https://res.cloudinary.com/dknvsbuyy/image/upload/v1685678135/chat_1_c7eda483e3.png';

export default function ChatScreen() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatFaceColor, setChatFaceColor] = useState();

    // Start conversation memory
    const conversationHistory = [
        { role: 'system', content: 'You are an assistant that serves as a tutor for master’s students learning business model theory...' },
        { role: 'assistant', content: 'Hello, I am your assistant. How can I help you?' }
    ];

    useEffect(() => {
        checkFaceId();
    }, []);

    const checkFaceId = async () => {
        const id = await AsyncStorage.getItem('chatFaceId');
        const selectedChatFace = id ? ChatFaceData[id] : ChatFaceData[0];
        setChatFaceColor(selectedChatFace.primary);
        setMessages([
            {
                _id: 1,
                text: 'Hello, I am ' + selectedChatFace.name + ', How Can I help you?',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: selectedChatFace.image,
                },
            },
        ]);
    };

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        if (messages[0].text) {
            getBotResponse(messages[0].text);
        }
    }, []);

    const getBotResponse = (msg) => {
        setLoading(true);
        const userMessage = { role: 'user', content: msg };
        conversationHistory.push(userMessage);

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
                    conversationHistory.push(botMessage);
                    setMessages(previousMessages => GiftedChat.append(previousMessages, chatAIResp));
                } else {
                    handleError();
                }
            })
            .catch(error => {
                console.error(error);
                handleError();
            });
    };

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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: chatFaceColor }}>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{ _id: 1 }}
                renderBubble={(props) => (
                    <Bubble {...props}
                            textStyle={{ right: { color: 'white' } }}
                            wrapperStyle={{
                                left: { backgroundColor: '#F0F0F0' },
                                right: { backgroundColor: '#0078fe' },
                            }}
                    />
                )}
                renderInputToolbar={(props) => (
                    <InputToolbar {...props} containerStyle={{ backgroundColor: 'white' }} />
                )}
                renderSend={(props) => (
                    <Send {...props}>
                        <View style={{ marginRight: 10, marginBottom: 5 }}>
                            <FontAwesome name="send" size={24} color="blue" />
                        </View>
                    </Send>
                )}
                alwaysShowSend
            />
        </SafeAreaView>
    );
}
