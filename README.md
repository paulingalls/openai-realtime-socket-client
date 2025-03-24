# Realtime Voice Client

## Overview

This package provides a client for managing real-time voice interactions, including handling reconnections, session updates, and managing conversation items. It is built with TypeScript and designed to work with WebSocket connections.

## Features

- Automatic reconnection with exponential backoff
- Session management and updates
- Real-time conversation item handling
- Audio buffer management
- Support for Azure and OpenAI voice services

## Installation

Install the package using bun:

```bash
bun add openai-realtime-socket-client
```

## Usage

### Importing the Client

```typescript
import { RealtimeVoiceClient } from 'openai-realtime-socket-client';
```

### Creating a New Client

```typescript
const client = new RealtimeVoiceClient({
  apiKey: 'your-api-key',
  sessionConfig: {
    voice: 'alloy',
    // other session configurations
  },
});
```

### Handling Events

```typescript
client.on('connect', () => {
  console.log('Connected to the voice service');
});
```

### Sending Conversation Items

```typescript
client.createConversationItem(item);
client.truncateConversationItem(itemId, contentIndex, audioEndMs);
client.deleteConversationItem(itemId);
```

### Managing Audio Buffers

```typescript
client.appendInputAudio(buffer);
client.commitInputAudio();
client.clearInputAudio();
```

## Development

To build the package, run the following command:

```bash
bun install
bun test
bun build
```

## License

This package is open source and available under the [MIT License](LICENSE).
