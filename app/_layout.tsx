import BtnBack from '@/components/BtnBack';
import { CameraPermissionProvider } from '@/context/CameraPermissionContext';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { COLORS, SIZES } from '@/constants/theme';

export default function RootLayout() {
    return (
        <CameraPermissionProvider>
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: COLORS.primary },
                    headerTintColor: COLORS.secondary,
                    headerTitleAlign: 'center',
                }}
            >
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="scanner"
                    options={() => ({
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
    btnBackContainer: { marginLeft: -SIZES.medium }
})
