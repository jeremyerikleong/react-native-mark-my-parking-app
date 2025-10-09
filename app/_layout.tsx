import BtnBack from '@/components/BtnBack';
import { CameraPermissionProvider } from '@/context/CameraPermissionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { COLORS, SIZES } from '@/constants/theme';

export default function RootLayout() {
    const [isLoading, setIsLoading] = useState(true);
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

    useEffect(() => {
        async function checkOnboardingFlag() {
            try {
                const flag = await AsyncStorage.getItem('hasSeenOnboarding');
                setHasSeenOnboarding(flag === 'true');
            } catch (err) {
                console.error(err);
                setHasSeenOnboarding(false);
            } finally {
                setIsLoading(false);
            }
        }

        checkOnboardingFlag();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.layoutContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <CameraPermissionProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    headerStyle: { backgroundColor: COLORS.primary },
                    headerTintColor: COLORS.secondary,
                    headerTitleAlign: 'center',
                }}
            >
                {
                    hasSeenOnboarding ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="onboarding" />
                }

                <Stack.Screen
                    name="scanner"
                    options={() => ({
                        headerShown: true,
                        title: 'Scan QR Code',
                        headerLeft: () => (
                            <View style={styles.btnBackContainer}>
                                <BtnBack />
                            </View>
                        )
                    })}
                />
            </Stack>
        </CameraPermissionProvider>
    );
}

const styles = StyleSheet.create({
    btnBackContainer: {
        marginLeft: -SIZES.medium
    },
    layoutContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
