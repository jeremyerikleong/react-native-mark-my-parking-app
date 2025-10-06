import { useCameraPermissions } from 'expo-camera';
import { createContext, useContext, useEffect, useState } from 'react';

interface CameraPermissionContextType {
    hasPermission: boolean;
    requestPermission: () => Promise<void>;
}

const CameraPermissionContext = createContext<CameraPermissionContextType | null>(null);

export function CameraPermissionProvider({ children }: { children: React.ReactNode }) {
    const [permission, requestPermissionInternal] = useCameraPermissions();
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        if (permission?.granted) {
            setHasPermission(true);
        } else {
            setHasPermission(false);
        }
    }, [permission]);

    async function requestPermission() {
        await requestPermissionInternal();
    }

    return (
        <CameraPermissionContext.Provider value={{ hasPermission, requestPermission }}>
            {children}
        </CameraPermissionContext.Provider>
    );
};

export function useCameraPermission() {
    const context = useContext(CameraPermissionContext);

    if (!context) {
        throw new Error('useCameraPermission must be used within a CameraPermissionProvider');
    }
    return context;
};
