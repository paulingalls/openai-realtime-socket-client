export type RealtimeEvent = {
  event_id: string,
}

type RealtimeContentResponseEvent = RealtimeEvent & {
  content_index: number,
  item_id: string,
  output_index: number,
  response_id: string,
}

type RealtimeFunctionResponseEvent = RealtimeEvent & {
  call_id: string,
  item_id: string,
  output_index: number,
  response_id: string,
  name: string
}

export type RealtimeModel = 'gpt-4o-realtime-preview' | 'gpt-4o-mini-realtime-preview' | string;
export type RealtimeTranscriptionModel = 'whisper-1' | 'gpt-4o-transcribe' | 'gpt-4o-mini-transcribe' | (string & {});

type AudioFormat = 'pcm16' | 'g711_ulaw' | 'g711_alaw';
export const AzureVoiceList = [
  'amuch',
  'dan',
  'elan',
  'marilyn',
  'meadow',
  'breeze',
  'cove',
  'ember',
  'jupiter',
  'alloy',
  'echo',
  'shimmer',
  'ash',
  'ballad',
  'coral',
  'sage',
  'verse'] as const;
export type AzureVoice = typeof AzureVoiceList[number];
export const OpenAIVoiceList = [
  'alloy',
  'ash',
  'ballad',
  'coral',
  'echo',
  'fable',
  'onyx',
  'nova',
  'sage',
  'shimmer',
  'verse'] as const;
export type OpenAIVoice = typeof OpenAIVoiceList[number];
export type Voice = AzureVoice | OpenAIVoice;
type Modality = 'text' | 'audio';
type ToolDefinition = {
  type: string,
  name: string,
  description: string,
  parameters: Record<string, any>, // JSON Schema
}
type ToolChoice = 'auto' | 'none' | 'required' | { type: 'function'; name: string };

export type AudioTranscription = null | {
  language?: string,
  model?: RealtimeTranscriptionModel,
  prompt?: string,
}

export type TurnDetection = null | {
  type: 'server_vad' | 'semantic_vad' | 'none',
  create_response?: boolean,
  eagerness?: 'auto' | 'high' | 'medium' | 'low',
  interrupt_response?: boolean,
  threshold?: number,
  prefix_padding_ms?: number,
  silence_duration_ms?: number
};

export type ClientSecret = {
  value: string,
  expires_at: number
};

export type AudioNoiseReduction = null | {type?: 'near_field' | 'far_field'};

export type RealtimeResponseConfig = {
  conversation: string,
  input: Array<RealtimeItem>,
  instructions: string,
  max_response_output_tokens: number | 'inf'
  metadata: Record<string, string>,
  modalities: Array<Modality>,
  output_audio_format: AudioFormat,
  temperature: number,
  tool_choice: ToolChoice,
  tools: Array<ToolDefinition>,
  voice: Voice,
};

export type RealtimeSessionConfig = {
  input_audio_format: AudioFormat, // defaults to 'pcm16'
  input_audio_noise_reduction: AudioNoiseReduction, // defaults to null
  input_audio_transcription: AudioTranscription, // defaults to null
  instructions: string, // defaults to instructions set by OpenAI
  max_response_output_tokens?: number | 'inf' // defaults to 'inf'
  modalities: Array<Modality>, // defaults to ['text', 'audio']
  output_audio_format: AudioFormat, // defaults to 'pcm16'
  temperature: number, // defaults to 0.8
  tool_choice: ToolChoice, // defaults to 'auto'
  tools: Array<ToolDefinition>,
  turn_detection: TurnDetection, // defaults to null
  voice: Voice,
}

export type RealtimeTranscriptionSessionConfig = {
  input_audio_format: AudioFormat, // defaults to 'pcm16'
  input_audio_noise_reduction: AudioNoiseReduction, // defaults to null
  input_audio_transcription: AudioTranscription, // defaults to null
  modalities: Array<Modality>, // defaults to ['text', 'audio']
  turn_detection: TurnDetection, // defaults to null
}

export type RealtimeSession = RealtimeSessionConfig & {
  id: string,
  model: RealtimeModel,
}

export type RealtimeTranscriptionSession = RealtimeTranscriptionSessionConfig & {
  id: string,
}

export type ItemType = 'message' | 'function_call' | 'function_call_output';
export type ItemStatus = 'in_progress' | 'completed' | 'incomplete' | 'failed' | 'cancelled';
export type ItemRole = 'user' | 'assistant' | 'system';
export type ItemContentType = 'input_text' | 'input_audio' | 'text' | 'audio' | 'item_reference';
export type ItemContent = {
  type: ItemContentType,
  id?: string,
  audio?: string,
  text?: string,
  transcript?: string | null,
};

export type RealtimeItem = {
  arguments?: string,
  call_id?: string,
  content?: Array<ItemContent>,
  id: string,
  name?: string,
  output?: string,
  role?: ItemRole,
  status?: ItemStatus,
  type: ItemType,
}

type RealtimeResponse = {
  conversation_id: string,
  id: string,
  max_output_tokens: number | 'inf',
  metadata: Record<string, string>,
  modalities: Array<Modality>,
  output: Array<RealtimeItem>,
  output_audio_format: AudioFormat,
  status: ItemStatus,
  status_details: null | {
    type: 'cancelled',
    reason: 'turn_detected' | 'client_cancelled',
  } | {
    type: 'incomplete',
    reason: 'max_output_tokens' | 'content_filter',
  } | {
    type: 'failed',
    error?: RealtimeError | null,
  },
  temperature: number,
  usage?: {
    input_tokens: number,
    input_token_details: {
      audio_tokens: number,
      cached_tokens: number,
      text_tokens: number,
    },
    output_token_details: {
      audio_tokens: number,
      text_tokens: number,
    },
    output_tokens: number,
    total_tokens: number,
  },
  voice?: Voice,
}

type RealtimeContentPart = {
  type: Modality,
  text?: string,
  audio?: string,
  transcript?: string | null,
}

type LogProb = {
  bytes: Array<number>,
  logprob: number,
  token: string,
}

type RealtimeError = {
  message: string,
  type?: string,
  code?: null | string,
  param?: null | string
}

export type RealtimeErrorEvent = RealtimeEvent & {
  type: 'error',
  error: RealtimeError & {
    event_id?: null | string
  }
}

export type SessionCreatedEvent = RealtimeEvent & {
  type: 'session.created',
  session: RealtimeSession
}

export type SessionUpdatedEvent = RealtimeEvent & {
  type: 'session.updated',
  session: RealtimeSession
}

export type ConversationCreatedEvent = RealtimeEvent & {
  type: 'conversation.created',
  conversation: {
    id: string,
  }
}

export type ConversationItemCreatedEvent = RealtimeEvent & {
  type: 'conversation.item.created',
  previous_item_id: string,
  item: RealtimeItem,
}

export type ConversationItemRetrievedEvent = RealtimeEvent & {
  type: 'conversation.item.retrieved',
  item: RealtimeItem,
}

export type ConversationItemInputAudioTranscriptionCompletedEvent = RealtimeEvent & {
  type: 'conversation.item.input_audio_transcription.completed',
  item_id: string,
  content_index: number,
  logprobs?: null | Array<LogProb>,
  transcript: string,
}

export type ConversationItemInputAudioTranscriptionDeltaEvent = RealtimeEvent & {
  type: 'conversation.item.input_audio_transcription.delta',
  item_id: string,
  content_index: number,
  logprobs?: null | Array<LogProb>,
  delta: string,
}

export type ConversationItemInputAudioTranscriptionFailedEvent = RealtimeEvent & {
  type: 'conversation.item.input_audio_transcription.failed',
  item_id: string,
  content_index: number,
  error: RealtimeError
}

export type ConversationItemTruncatedEvent = RealtimeEvent & {
  type: 'conversation.item.truncated',
  item_id: string,
  content_index: number,
  audio_end_ms: number,
}

export type ConversationItemDeletedEvent = RealtimeEvent & {
  type: 'conversation.item.deleted',
  item_id: string,
}

export type InputAudioBufferCommittedEvent = RealtimeEvent & {
  type: 'input_audio_buffer.committed',
  previous_item_id: string,
  item_id: string,
}

export type InputAudioBufferClearedEvent = RealtimeEvent & {
  type: 'input_audio_buffer.cleared',
}

export type InputAudioBufferSpeechStartedEvent = RealtimeEvent & {
  type: 'input_audio_buffer.speech_started',
  audio_start_ms: number,
  item_id: string,
}

export type InputAudioBufferSpeechStoppedEvent = RealtimeEvent & {
  type: 'input_audio_buffer.speech_stopped',
  audio_end_ms: number,
  item_id: string,
}

export type ResponseCreatedEvent = RealtimeEvent & {
  type: 'response.created',
  response: RealtimeResponse
}

export type ResponseDoneEvent = RealtimeEvent & {
  type: 'response.done',
  response: RealtimeResponse,
}

export type ResponseOutputItemAddedEvent = RealtimeEvent & {
  type: 'response.output_item.added',
  response_id: string,
  output_index: number,
  item: RealtimeItem,
}

export type ResponseOutputItemDoneEvent = RealtimeEvent & {
  type: 'response.output_item.done',
  response_id: string,
  output_index: number,
  item: RealtimeItem,
}

export type ResponseContentPartAddedEvent = RealtimeContentResponseEvent & {
  type: 'response.content_part.added',
  part: RealtimeContentPart,
}

export type ResponseContentPartDoneEvent = RealtimeContentResponseEvent & {
  type: 'response.content_part.done',
  part: RealtimeContentPart,
}

export type ResponseTextDeltaEvent = RealtimeContentResponseEvent & {
  type: 'response.text.delta',
  delta: string,
}

export type ResponseTextDoneEvent = RealtimeContentResponseEvent & {
  type: 'response.text.done',
  text: string,
}

export type ResponseAudioTranscriptDeltaEvent = RealtimeContentResponseEvent & {
  type: 'response.audio_transcript.delta',
  delta: string,
}

export type ResponseAudioTranscriptDoneEvent = RealtimeContentResponseEvent & {
  type: 'response.audio_transcript.done',
  transcript: string,
}

export type ResponseAudioDeltaEvent = RealtimeContentResponseEvent & {
  type: 'response.audio.delta',
  delta: string,
}

export type ResponseAudioDoneEvent = RealtimeContentResponseEvent & {
  type: 'response.audio.done',
}

export type ResponseFunctionCallArgumentsDeltaEvent = RealtimeFunctionResponseEvent & {
  type: 'response.function_call_arguments.delta',
  delta: string,
}

export type ResponseFunctionCallArgumentsDoneEvent = RealtimeFunctionResponseEvent & {
  type: 'response.function_call_arguments.done',
  arguments: string,
}

export type TranscriptionSessionUpdatedEvent = RealtimeEvent & {
  type: 'transcription_session.updated',
  session: RealtimeTranscriptionSessionConfig
}

export type RateLimitsUpdatedEvent = RealtimeEvent & {
  type: 'rate_limits.updated',
  rate_limits: Array<{
    name: 'requests' | 'tokens' | 'input_tokens' | 'output_tokens' | (string & {})
    limit: number
    remaining: number
    reset_seconds: number
  }>
}