import CameraPermissionUI from '@/components/CameraPermissionUI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { COLORS, SIZES } from '@/constants/theme';

const screenWidth = Dimensions.get('window').width;
const scanBoxSize = screenWidth * 0.7;

export default function Scanner() {
    const [scanned, setScanned] = useState(false);
    const scannedRef = useRef(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();
    const size = 24;
    const [isTorchOn, setIsTorchOn] = useState(false);

    if (!permission) {
        return <CameraPermissionUI />
    }

    function toggleTorch() {
        setIsTorchOn(prev => !prev);
    }

    function clearErrorMessage() {
        setErrorMessage(null);
    }

    async function handleReplaceParkingData(data: any) {
        try {
            await AsyncStorage.setItem('parkingData', JSON.stringify(data));
            router.replace('/(tabs)/parking');
        } catch (err) {
            console.error('Error replacing parking data:', err);
            setErrorMessage('Something went wrong. Please try again.');
            setScanned(false);
        }
    }

    async function handleBarcodeScan({ data }: { data: string }) {
        if (scannedRef.current) return;
        scannedRef.current = true;

        try {
            const result = JSON.parse(data);
            const existingData = await AsyncStorage.getItem('parkingData');

            setErrorMessage(null);

            if (existingData) {
                Alert.alert(
                    'Replace Existing Parking Info?',
                    'You already have parking data. Do you want to replace it?', [
                    {
                        text: "Cancel",
                        style: 'cancel',
                        onPress: () => {
                            setScanned(false);
                            router.push('/(tabs)/home');
                        }
                    },
                    {
                        text: 'Replace',
                        onPress: async () => {
                            await handleReplaceParkingData(result);
                        },
                    }
                ], {
                    cancelable: true
                })
            } else {
                await AsyncStorage.setItem('parkingData', JSON.stringify(result));
                router.replace('/(tabs)/parking');
            }
        } catch (err) {
            console.error('Invalid QR:', err);
            setErrorMessage('Invalid QR code. Please try again.');
            setScanned(false);
        }
    }

    return (
        <SafeAreaView
            style={styles.cameraContainer}
            edges={['left', 'right']}>
            <CameraView
                style={styles.camera}
                onBarcodeScanned={scannedRef.current ? undefined : handleBarcodeScan}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                facing="back"
                enableTorch={isTorchOn}
            />

            {errorMessage && (
                <View style={styles.errorMessageContainer}>
                    <Text style={styles.errorMessage}>{errorMessage}</Text>

                    <Pressable onPress={clearErrorMessage}>
                        <Icon name="close" size={size} color={COLORS.secondary} />
                    </Pressable>
                </View>)
            }

            <View style={styles.scanBoxContainer}>
                <View style={styles.scanBoxArea}>
                    <View style={[styles.scanBoxCorner, styles.topLeft]} />
                    <View style={[styles.scanBoxCorner, styles.topRight]} />
                    <View style={[styles.scanBoxCorner, styles.bottomLeft]} />
                    <View style={[styles.scanBoxCorner, styles.bottomRight]} />
                </View>
                <Text style={styles.scanBoxText}>Align QR inside the scan area</Text>

                <TouchableOpacity style={styles.btnTorch} onPress={toggleTorch}>
                    <Icon
                        name={!isTorchOn ? "flashlight-off" : "flashlight"}
                        size={32}
                        color={!isTorchOn ? COLORS.secondary : COLORS.warning}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        position: 'relative',
    },
    camera: {
        flex: 1,
    },
    scanBoxContainer: {
        position: 'absolute',
        inset: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanBoxArea: {
        position: 'relative',
        width: scanBoxSize,
        height: scanBoxSize,
        backgroundColor: 'transparent',
    },
    scanBoxCorner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: COLORS.primary,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderLeftWidth: 4,
        borderTopWidth: 4,
        borderTopLeftRadius: SIZES.medium,
    },
    topRight: {
        top: 0,
        right: 0,
        borderRightWidth: 4,
        borderTopWidth: 4,
        borderTopRightRadius: SIZES.medium,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderLeftWidth: 4,
        borderBottomWidth: 4,
        borderBottomLeftRadius: SIZES.medium,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderRightWidth: 4,
        borderBottomWidth: 4,
        borderBottomRightRadius: SIZES.medium,
    },
    scanBoxText: {
        color: COLORS.secondary,
        fontSize: SIZES.medium,
        marginTop: SIZES.xLarge * 3,
    },
    btnTorch: {
        marginTop: SIZES.xxLarge,
    },
    errorMessageContainer: {
        position: 'absolute',
        bottom: SIZES.xxLarge * 2,
        left: SIZES.medium,
        right: SIZES.medium,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SIZES.medium,
        backgroundColor: COLORS.danger,
        borderRadius: SIZES.xSmall,
        zIndex: 10,
    },
    errorMessage: {
        color: COLORS.secondary,
        fontSize: SIZES.medium,
    }
})