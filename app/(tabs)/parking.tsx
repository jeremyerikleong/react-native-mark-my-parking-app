import CameraPermissionUI from '@/components/CameraPermissionUI';
import { useCameraPermission } from '@/context/CameraPermissionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraType, CameraView } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { COLORS, SIZES } from '@/constants/theme';

export default function Index() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [flashModeIndicator, setFlashModeIndicator] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<string>('');
  const [qrValue, setQrValue] = useState<string>('');
  const cameraRef = useRef<CameraView>(null);
  const size = 24;
  const imageCompression = 0.7;
  const timerRef = useRef<number | null>(null);

  const parkingDataKey = 'parkingData';
  const expiresIn = 24 //hours

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await AsyncStorage.getItem(parkingDataKey);

        if (result) {
          const data = JSON.parse(result);
          const currentTimeStamp = Date.now();

          if (currentTimeStamp - currentTimeStamp < expiresIn * 60 * 60 * 1000) {
            setPhoto(data.photo || '');
            setNotes(data.notes || '');
            setQrValue(JSON.stringify(data));
          } else {
            await AsyncStorage.removeItem(parkingDataKey);
          }
        }
      } catch (err) {
        console.error('Error loading saved data', err);
      }
    }

    fetchData();
  }, []);


  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function toggleFlashMode() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setFlashMode(prev => {
      switch (prev) {
        case 'off':
          setFlashModeIndicator('flash on');
          return 'on';
        case 'on':
          setFlashModeIndicator('auto flash');
          return 'auto';
        case 'auto':
          setFlashModeIndicator('flash off');
          return 'off';
        default:
          setFlashModeIndicator('flash off');
          return 'off';
      }
    });

    timerRef.current = setTimeout(() => {
      setFlashModeIndicator('');
    }, 1000);
  }

  async function takePhoto() {
    if (cameraRef.current) {
      try {
        const result = await cameraRef.current.takePictureAsync({
          quality: imageCompression,
          base64: true,
        });
        setPhoto(result.uri);

        const storedParkingData = {
          photo: result.uri,
          notes,
          timestamp: Date.now(),
        }
        await AsyncStorage.setItem(parkingDataKey, JSON.stringify(storedParkingData));
        setQrValue(JSON.stringify(storedParkingData));
      } catch (err) {
        console.error('Capture error:', err);
      }
    }
  }

  async function removePhoto() {
    setPhoto('');
    setNotes('');
    setQrValue('');
    await AsyncStorage.removeItem(parkingDataKey);
  }

  async function addNote(text: string) {
    setNotes(text);

    try {
      const storedParkingData = {
        photo,
        notes: text,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(parkingDataKey, JSON.stringify(storedParkingData));
      setQrValue(JSON.stringify(storedParkingData));
    } catch (err) {
      console.error('Save notes error', err);
    }
  }

  function showAlert() {
    Alert.alert(
      'Are you sure?',
      'Delete your image and note? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => removePhoto(),
          style: 'destructive',
        }
      ],
      { cancelable: true }
    )
  }

  if (!hasPermission) return <CameraPermissionUI />;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <SafeAreaView style={styles.innerContainer} edges={['left', 'right', 'bottom']}>
          <View style={styles.cameraContainer}>
            {photo ? (<Image source={{ uri: photo }} style={styles.camera} resizeMode="cover" />)
              : (<CameraView style={styles.camera} facing={facing} flash={flashMode} ref={cameraRef} />)}

            {photo !== '' ?
              (<TouchableOpacity
                style={[styles.btnContainer, styles.btnDeleteContainer]}
                onPress={showAlert}>
                <View style={styles.btnCapture}>
                  <Icon name="close" size={size} color={COLORS.secondary} />
                </View>
              </TouchableOpacity>) : null}

            {!photo && flashModeIndicator !== '' ? (<View style={styles.flashIndicatorContainer}>
              <Text style={styles.flashIndicatorText}>{flashModeIndicator}</Text>
            </View>) : null}

            {!photo ? (<TouchableOpacity style={styles.btnFlash} onPress={toggleFlashMode}>
              <Icon
                name={flashMode === "off" ? "flash-off" : flashMode === "on" ? "flash" : flashMode === "auto" ? "flash-auto" : "flash-off"}
                size={size}
                color={flashMode === 'off' ? COLORS.secondary : COLORS.warning}
              />
            </TouchableOpacity>) : null}

            {!photo ? (<TouchableOpacity
              style={[styles.btnContainer, styles.btnCaptureContainer]}
              onPress={takePhoto}>
              <View style={styles.btnCapture}>
                <Icon name="camera" size={size} color={COLORS.secondary} />
              </View>
            </TouchableOpacity>) : null}

            {!photo ? (<TouchableOpacity style={styles.btnFlip} onPress={toggleCameraFacing}>
              <Icon name="camera-flip" size={size} color={COLORS.secondary} />
            </TouchableOpacity>) : null}
          </View>

          <TextInput
            multiline
            style={styles.input}
            onChangeText={addNote}
            value={notes}
            placeholder='Add notes for your parking...'
            placeholderTextColor={COLORS.placeholderText}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.xLarge,
    backgroundColor: COLORS.secondary,
  },
  cameraContainer: {
    width: '100%',
    height: '70%',
    borderRadius: SIZES.small,
    overflow: 'hidden',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  btnFlip: {
    position: 'absolute',
    right: SIZES.medium,
    bottom: SIZES.medium,
  },
  btnFlash: {
    position: 'absolute',
    left: SIZES.medium,
    bottom: SIZES.medium,
  },
  flashIndicatorContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: SIZES.medium,
    width: 100,
    backgroundColor: COLORS.warning,
    paddingVertical: SIZES.xSmall / 2,
    paddingHorizontal: SIZES.xSmall,
    borderRadius: SIZES.xSmall / 2,
  },
  flashIndicatorText: {
    textAlign: 'center',
    color: COLORS.secondary,
    textTransform: 'capitalize',
  },
  input: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: COLORS.placeholderText,
    borderRadius: SIZES.medium / 2,
    marginTop: SIZES.medium,
    padding: SIZES.medium,
    color: COLORS.defaultText,
    textAlignVertical: 'top',
    textAlign: 'left',
  },
  btnContainer: {
    position: 'absolute',
    padding: SIZES.small,
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 40,
  },
  btnCaptureContainer: {
    bottom: SIZES.medium,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  btnCapture: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDeleteContainer: {
    top: SIZES.medium,
    backgroundColor: COLORS.danger,
    borderColor: COLORS.danger,
  },
  btnDelete: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});