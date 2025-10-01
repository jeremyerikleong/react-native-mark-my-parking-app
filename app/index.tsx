import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { COLORS, SIZES } from '@/constants/theme';

export default function Index() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, setPermission] = useCameraPermissions();
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<string>('');
  const cameraRef = useRef<CameraView>(null);
  const size = 24;
  const imageCompression = 0.7;

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

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Camera permission is still loading</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={setPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
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
      } catch (err) {
        console.error('Capture error:', err);
      }
    }
  }

  async function removePhoto() {
    setPhoto('');
    setNotes('');
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
          onPress: () => console.log('cancel alert'),
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <SafeAreaView style={styles.innerContainer}>
          <View style={styles.cameraContainer}>
            {photo ? (<Image source={{ uri: photo }} style={styles.camera} resizeMode="cover" />)
              : (<CameraView style={styles.camera} facing={facing} ref={cameraRef} />)}

            {photo !== '' ? (<View style={[styles.btnContainer, styles.btnDeleteContainer]}>
              <TouchableOpacity style={styles.btnCapture} onPress={showAlert}>
                <Icon name="close" size={size} color={COLORS.secondary} />
              </TouchableOpacity>
            </View>) : null}

            {!photo ? (<View style={[styles.btnContainer, styles.btnCaptureContainer]}>
              <TouchableOpacity style={styles.btnCapture} onPress={takePhoto}>
                <Icon name="camera" size={size} color={COLORS.secondary} />
              </TouchableOpacity>
            </View>) : null}

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
  message: {
    textAlign: 'center',
    paddingBottom: SIZES.xSmall,
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
  }
});