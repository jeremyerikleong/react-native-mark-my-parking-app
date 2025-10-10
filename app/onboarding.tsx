import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, SIZES } from '@/constants/theme';

const slides = [
    {
        key: "1",
        title: "Welcome to Parking Buddy",
        text: "Find and manage your parking spots with ease",
        image: require("@/assets/images/logo.png"),
    },
    {
        key: "2",
        title: "Scan QR Codes",
        text: "Quickly scan parking QR codes for fast access",
        image: require("@/assets/images/onboarding-2.png"),
    },
    {
        key: "3",
        title: "Save Parking Details",
        text: "Securely store your parking info for easy retrieval and sharing",
        image: require("@/assets/images/onboarding-3.png"),
    },
    {
        key: "4",
        title: "No More Phone Storage Worries",
        text: "Your notes and images aren’t stored on your phone and will automatically delete after 24 hours",
        image: require("@/assets/images/onboarding-4.png"),
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

    async function completeOnboarding() {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.replace("/(tabs)/home");
    }

    const renderItem = ({ item }: any) => (
        <SafeAreaView style={styles.slide}>
            <Image
                source={item.image}
                style={[styles.image, item.key === "1" ? styles.smallImageSize : styles.largeImageSize]}
                resizeMode="contain"
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.text}</Text>
        </SafeAreaView>
    );

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

    if (hasSeenOnboarding) {
        return <Redirect href="/(tabs)/home" />;
    }

    return (
        <AppIntroSlider
            renderItem={renderItem}
            data={slides}
            onDone={completeOnboarding}
            showSkipButton
            onSkip={completeOnboarding}
            dotStyle={styles.defaultDot}
            activeDotStyle={styles.activeDot}
        />
    );
}

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SIZES.large,
        backgroundColor: COLORS.primary,
    },
    image: {
        resizeMode: 'contain',
        marginBottom: SIZES.large,
        borderRadius: SIZES.large,
    },
    smallImageSize: {
        width: 120,
        height: 120,
    },
    largeImageSize: {
        width: 200,
        height: 200,
    },
    title: {
        fontSize: SIZES.xLarge,
        fontWeight: 'bold',
        color: COLORS.secondary,
        textAlign: 'center',
        marginBottom: SIZES.xSmall,
    },
    text: {
        fontSize: SIZES.medium,
        color: COLORS.secondary,
        textAlign: 'center',
    },
    defaultDot: {
        backgroundColor: COLORS.defaultDot,
        width: SIZES.xSmall,
        height: SIZES.xSmall,
        borderRadius: SIZES.xSmall / 2,
        marginHorizontal: SIZES.small / 3,
    },
    activeDot: {
        backgroundColor: COLORS.activeDot,
        width: SIZES.xLarge,
        height: SIZES.xSmall,
        borderRadius: SIZES.xSmall / 2,
        marginHorizontal: SIZES.small / 3,
    },
    layoutContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
