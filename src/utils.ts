export function hasNativeWebSocket(): boolean {
  // eslint-disable-next-line no-undef
  return !!process.versions.bun || !!globalThis.WebSocket;
}

export function arrayBufferToBase64(
  arrayBuffer: ArrayBuffer | Int16Array,
): string {
  let buffer: ArrayBuffer;
  if (arrayBuffer instanceof ArrayBuffer) {
    buffer = arrayBuffer;
  } else {
    buffer = arrayBuffer.buffer as ArrayBuffer;
  }

  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x80_00; // 32KB chunk size
  let binary = '';

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk as any);
  }

  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return bytes.buffer as ArrayBuffer;
}


export function trimDebugEvent(event?: any): any {
  if (!event) return event;

  const maxLimit = 200;
  const e = structuredClone(event);

  // if (e.item?.content?.find((c: any) => c.audio)) {
  //   e.item.content = e.item.content.map(({ audio, c }: any) => {
  //     if (audio) {
  //       return {
  //         ...c,
  //         audio: '(base64 redacted...)',
  //       };
  //     } else {
  //       return c;
  //     }
  //   });
  // }
  //
  // if (e.audio) {
  //   e.audio = '(audio redacted...)';
  // }

  if (e.delta?.length > maxLimit) {
    e.delta = e.delta.slice(0, maxLimit) + '... (truncated)';
  }

  return e;
}