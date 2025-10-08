import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { COLORS, SIZES } from "@/constants/theme";

export default function BtnBack() {
    const size = 24

    return (
        <TouchableOpacity
            onPress={() => router.back()}
            style={styles.btnBackContainer}>
            <Icon name="arrow-left" size={size} color={COLORS.secondary} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btnBackContainer: {
        paddingLeft: SIZES.medium,
    }
})