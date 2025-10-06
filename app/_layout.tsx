import { CameraPermissionProvider } from '@/context/CameraPermissionContext';
import { Slot } from "expo-router";

export default function RootLayout() {
    return (
        <CameraPermissionProvider>
            <Slot />
        </CameraPermissionProvider>
    )
}
