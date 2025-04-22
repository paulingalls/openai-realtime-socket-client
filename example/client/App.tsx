import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  RealtimeAudioPlayerView,
  RealtimeAudioRecorderView,
  RealtimeAudioModule,
  RealtimeAudioCapturedEventPayload,
  AudioEncoding,
  Visualizers,
  RealtimeAudioPlayerViewRef,
  RealtimeAudioRecorderViewRef
} from 'react-native-realtime-audio';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

export default function App() {
  const audioViewRef = useRef<RealtimeAudioPlayerViewRef>(null);
  const recorderRef = useRef<RealtimeAudioRecorderViewRef>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    // Request audio permissions
    const requestPermissions = async () => {
      try {
        const status = await RealtimeAudioModule.checkAndRequestAudioPermissions();
        setHasPermissions(status);
        if (!status) {
          Alert.alert(
            'Permissions Required',
            'This app needs audio permissions to work properly.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Error requesting permissions:', error);
        Alert.alert('Error', 'Failed to request audio permissions');
      }
    };

    requestPermissions();

    // Initialize socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
    });

    newSocket.on('client_connected', () => {
      console.log('Client connected to voice server');
      recorderRef.current?.startRecording();
    });

    newSocket.on('client_error', (error: any) => {
      console.error('Client error:', error);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    // Listen for audio data from server
    newSocket.on('audio_delta', (data: string) => {
      audioViewRef.current?.addBuffer(data);
    });

    newSocket.on('input_audio_buffer_speech_started', () => {
      console.log('Input audio buffer speech started');
      audioViewRef.current?.stop();
    });

    // Cleanup
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleAudioData = (data: string) => {
    if (socket && isConnected) {
      socket.emit('audioData', data);
    }
  };

  if (!hasPermissions) {
    return (
      <View style={styles.container}>
        <Text>Waiting for audio permissions...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Demo</Text>
      <Text style={styles.status}>
        Socket Status: {isConnected ? 'Connected' : 'Disconnected'}
      </Text>

      <View style={styles.audioContainer}>
        <Text style={styles.sectionTitle}>Player</Text>
        <RealtimeAudioPlayerView
          style={styles.player}
          ref={audioViewRef}
          waveformColor={"#9ec7f4"}
          visualizer={Visualizers.tripleCircle}
          audioFormat={{
            sampleRate: 24000,
            encoding: AudioEncoding.pcm16bitInteger,
            channelCount: 1
          }}
          onPlaybackStarted={() => {
            console.log("RealtimeAudioView playback started callback");
          }}
          onPlaybackStopped={() => {
            console.log("RealtimeAudioView playback stopped callback");
          }}
        />
      </View>

      <View style={styles.audioContainer}>
        <Text style={styles.sectionTitle}>Recorder</Text>
        <RealtimeAudioRecorderView
          style={styles.recorder}
          ref={recorderRef}
          waveformColor={"#0e2655"}
          echoCancellationEnabled={true}
          audioFormat={{
            sampleRate: 24000,
            encoding: AudioEncoding.pcm16bitInteger,
            channelCount: 1
          }}
          onAudioCaptured={(event: { nativeEvent: RealtimeAudioCapturedEventPayload }) => {
            if (event && event.nativeEvent !== null && event.nativeEvent.audioBuffer) {
              const buffer = event.nativeEvent.audioBuffer;
              handleAudioData(buffer);
            }
          }}
          onCaptureComplete={() => {
            console.log("RealtimeAudioView capture complete");
          }}
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
  },
  audioContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  recorder: {
    height: 100,
    width: 300,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  player: {
    height: 300,
    width: 300,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});
