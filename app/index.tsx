import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, SIZES } from '@/constants/theme';

export default function Index() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, setPermission] = useCameraPermissions();
  const [notes, setNotes] = useState('');

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <SafeAreaView style={styles.innerContainer}>
          <View style={styles.cameraContainer}>
            <CameraView style={styles.camera} facing={facing} />
          </View>

          <TextInput
            multiline
            style={styles.input}
            onChangeText={setNotes}
            value={notes}
            placeholder='Add notes for your parking...'
            placeholderTextColor={COLORS.placeholderText}
          />

          <TouchableOpacity style={styles.btnFlip} onPress={toggleCameraFacing}>
            <Text>Flip Camera</Text>
          </TouchableOpacity>
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
    height: '60%',
    borderRadius: SIZES.small,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
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
  },
  btnFlip: {
    marginTop: SIZES.medium,
  }
});