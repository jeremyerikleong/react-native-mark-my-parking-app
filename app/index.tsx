import * as Notifications from 'expo-notifications';
import { Redirect } from "expo-router";
import { useEffect } from 'react';
import { Alert } from 'react-native';

export default function Index() {
    useEffect(() => {
        (async () => {
            const settings = await Notifications.getPermissionsAsync();

            if (!settings.granted) {
                const { status } = await Notifications.requestPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission required', 'Notifications permission is needed to remind you.');
                }
            }
        })();
    }, []);

    return <Redirect href="/onboarding" />;
}