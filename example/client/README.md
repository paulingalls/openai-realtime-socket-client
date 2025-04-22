# Real-time Audio Client

This is a React Native Expo application that demonstrates real-time audio streaming capabilities, and connecting them via socket.io to a socket server that uses the openai-realtime-socket-client. The application allows users to record voice and stream it to a server, while also receiving and playing back the realtimeAI voice response from the server.

## Features

- Real-time audio recording and playback
- Socket.io integration for audio streaming
- Audio waveform visualization
- Echo cancellation support
- Configurable audio format settings

## Prerequisites

- Bun (latest version)
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)
- Xcode (for iOS development)
- Android Studio (for Android development)

## Installation

Install dependencies:
```bash
bun install
```

## Development Build Setup

This application requires a development build as it uses native modules that aren't supported in Expo Go. Follow these steps to create a development build:

### iOS

Create a development build:
```bash
bunx expo run:ios
```

### Android

Create a development build:
```bash
bunx expo run:android
```

## Configuration

Before running the application, ensure you have the correct socket server URL configured in `App.tsx`. The default configuration is:

```typescript
const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;
```

Either update this URL to match your server's address, or set EXPO_PUBLIC_SOCKET_URL in a .env file

It's best to run this client example on a real device to leverage the echo cancellation.  Otherwise the AI interrupts itself quite frequently.

## Running the Application

1. Start the development server:
```bash
bunx expo start
```

2. Press 'i' for iOS or 'a' for Android to launch the application in the respective simulator/emulator.

## Audio Settings

The application uses the following audio configuration:
- Sample Rate: 24000 Hz
- Encoding: PCM 16-bit Integer
- Channel Count: 1 (Mono)

## Permissions

The application requires audio recording permissions to function. These permissions will be requested when the app first launches.

## Troubleshooting

If you encounter any issues:

1. Ensure all dependencies are properly installed
2. Verify that the socket server is running and accessible
3. Check that audio permissions are granted
4. For iOS, ensure microphone usage description is properly configured in your app.json
5. For Android, ensure the RECORD_AUDIO permission is properly configured

## Dependencies

- react-native-realtime-audio
- socket.io-client
- react-native
- expo 