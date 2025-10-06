import { Alert } from 'react-native';

export default function ShowCameraPermissionAlert(handleRequestPermission: () => void) {
    return (
        Alert.alert(
            '"Parking Buddy" would like to access your camera',
            'This allows you to take and share parking photos',
            [
                {
                    text: "Cancel",
                },
                {
                    text: 'Grant',
                    onPress: handleRequestPermission
                }
            ])
    )
}