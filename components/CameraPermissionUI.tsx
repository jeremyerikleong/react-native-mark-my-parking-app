import ShowCameraPermissionAlert from '@/components/ShowCameraPermissionAlert';
import { useCameraPermission } from '@/context/CameraPermissionContext';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS, SIZES } from '@/constants/theme';

export default function CameraPermissionUI() {
    const { hasPermission, requestPermission } = useCameraPermission();

    function handleRequestPermission() {
        ShowCameraPermissionAlert(() => requestPermission());
    };

    if (hasPermission) return null;

    return (
        <View style={styles.permissionContainer}>
            <Text style={styles.permissionMessage}>
                We need your permission to use the camera
            </Text>
            <TouchableOpacity onPress={handleRequestPermission} style={styles.btnGrant}>
                <Text style={styles.btnGrantText}>Grant Permission</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: SIZES.large,
    },
    permissionMessage: {
        textAlign: 'center',
        marginBottom: SIZES.small,
        color: COLORS.defaultText,
    },
    btnGrant: {
        backgroundColor: COLORS.primary,
        padding: SIZES.medium,
        borderRadius: SIZES.small,
    },
    btnGrantText: {
        color: COLORS.secondary,
        fontWeight: 'bold',
    },
});
