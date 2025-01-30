export function hasNativeWebSocket(): boolean {
  // eslint-disable-next-line no-undef
  return !!process.versions.bun || !!globalThis.WebSocket;
}

export function trimDebugEvent(event?: any): any {
  if (!event) return event;

  const maxLimit = 200;
  const e = structuredClone(event);
  if (e.delta?.length > maxLimit) {
    e.delta = e.delta.slice(0, maxLimit) + '... (truncated)';
  }

  return e;
}