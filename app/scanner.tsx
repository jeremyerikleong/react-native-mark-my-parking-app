import CameraPermissionUI from '@/components/CameraPermissionUI';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, SIZES } from '@/constants/theme';

const screenWidth = Dimensions.get('window').width;
const scanBoxSize = screenWidth * 0.7;

export default function Scanner() {
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        return <CameraPermissionUI />
    }

    return (
        <SafeAreaView style={styles.cameraContainer}>
            <CameraView style={styles.camera} />

            <View style={styles.scanBoxContainer}>
                <View style={styles.scanBoxArea}>
                    <View style={[styles.scanBoxCorner, styles.topLeft]} />
                    <View style={[styles.scanBoxCorner, styles.topRight]} />
                    <View style={[styles.scanBoxCorner, styles.bottomLeft]} />
                    <View style={[styles.scanBoxCorner, styles.bottomRight]} />
                </View>
                <Text style={styles.scanBoxText}>Align QR inside the scan area</Text>
            </View>
        </SafeAreaView>
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
    }
})