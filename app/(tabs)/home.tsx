import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { COLORS, SIZES } from '@/constants/theme';

export default function Home() {
    const [qrValue, setQrValue] = useState<string>('');
    const parkingDataKey = 'parkingData';
    const isFocused = useIsFocused();
    const size = 24;
    const [isQrVisible, setIsQrVisible] = useState(false);

    async function loadData() {
        try {
            const result = await AsyncStorage.getItem(parkingDataKey);
            if (result) {
                setQrValue(result);
            } else {
                setQrValue('');
            }
        } catch (err) {
            console.error("Error loading parking data", err);
        }
    }

    useEffect(() => {
        if (isFocused) {
            loadData();
        }
    }, [isFocused]);

    return (
        <SafeAreaView style={styles.container}>
            {qrValue === '' ? (
                <Link href="/(tabs)/parking" asChild>
                    <Pressable style={styles.messageContainer}>
                        <View style={styles.qrHeader}>
                            <Text style={styles.message}>
                                No active parking data yet
                            </Text>

                            <MaterialCommunityIcons
                                name="chevron-right"
                                size={size}
                                color={COLORS.secondary}
                            />
                        </View>
                    </Pressable>
                </Link>
            ) : (
                <Pressable
                    style={styles.messageContainer}
                    onPress={() => setIsQrVisible((prev) => !prev)}>
                    <View style={styles.qrHeader}>
                        {isQrVisible ?
                            <Text style={styles.message}>
                                Protected QR
                            </Text> :
                            <Text></Text>
                        }

                        {isQrVisible ?
                            <MaterialCommunityIcons
                                name="chevron-down"
                                size={size}
                                color={COLORS.secondary}
                            /> :
                            <MaterialCommunityIcons
                                name="chevron-up"
                                size={size}
                                color={COLORS.secondary}
                            />
                        }
                    </View>
                    <View>
                        {!isQrVisible ?
                            <View style={styles.qrContainer}>
                                <Text style={[styles.title, { marginBottom: SIZES.medium }]}>
                                    Parking QR Code
                                </Text>

                                <QRCode
                                    value={qrValue}
                                    size={200}
                                    color={COLORS.primary}
                                    backgroundColor={COLORS.secondary}
                                    ecl="L"
                                    quietZone={SIZES.medium}
                                    logoSize={40}
                                    logoBackgroundColor="transparent"
                                />

                                <Text style={[styles.message, { marginTop: SIZES.medium }]}>
                                    Share this with your parking buddy
                                </Text>
                            </View>
                            : null
                        }
                    </View>
                </Pressable>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: SIZES.large
    },
    qrHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    qrContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        color: COLORS.secondary,
    },
    messageContainer: {
        width: '100%',
        backgroundColor: COLORS.primary,
        padding: SIZES.medium,
        borderRadius: SIZES.small,
        marginTop: SIZES.medium,
    },
    message: {
        color: COLORS.secondary,
    },
});
