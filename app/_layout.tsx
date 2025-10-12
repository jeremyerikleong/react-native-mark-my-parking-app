import BtnBack from '@/components/BtnBack';
import { CameraPermissionProvider } from '@/context/CameraPermissionContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { COLORS, SIZES } from '@/constants/theme';

export default function RootLayout() {
    return (
        <>
            <StatusBar style='light' />
            <CameraPermissionProvider>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        headerStyle: { backgroundColor: COLORS.primary },
                        headerTintColor: COLORS.secondary,
                        headerTitleAlign: 'center',
                    }}
                >
                    <Stack.Screen name="onboarding" />

                    <Stack.Screen name="(tabs)" />

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
        </>
    );
}

const styles = StyleSheet.create({
    btnBackContainer: {
        marginLeft: -SIZES.medium
    }
})
