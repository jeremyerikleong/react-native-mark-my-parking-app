import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, SIZES } from '@/constants/theme';

export default function Home() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Link href="/(tabs)/parking" asChild>
                    <Pressable style={styles.btn}>
                        <Text style={styles.text}>Home</Text>
                    </Pressable>
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.large
    },
    innerContainer: {
        marginTop: SIZES.xLarge,
    },
    btn: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.small,
        padding: SIZES.medium,
    },
    text: {
        fontSize: SIZES.large,
        fontWeight: "bold",
        color: COLORS.secondary,
    },
});
