import {describe, it, expect, beforeEach} from 'bun:test';
import {Transcription} from '../src/transcription';
import {RealtimeItem} from '../src';

describe('Transcription', () => {
  let transcription: Transcription;
  let item1: RealtimeItem;
  let item2: RealtimeItem;

  beforeEach(() => {
    transcription = new Transcription();
    item1 = {id: '1', role: 'user', type: 'message', content: [{type: 'text', text: 'Hello'}]};
    item2 = {id: '2', role: 'assistant', type: 'message', content: [{type: 'text', text: 'Hi'}]};
  });

  it('should add an item', () => {
    transcription.addItem(item1, '');
    expect(transcription.getItem('1')).toEqual(item1);
  });

  it('should add a transcript to an item', () => {
    transcription.addItem(item1, '');
    transcription.addTranscriptToItem('1', 'Hello, world!');
    const item = transcription.getItem('1');
    expect(item).toBeDefined();
    expect(item?.content).toBeDefined();
    if (item && item.content) {
      expect(item.content[0].text).toBe('Hello, world!');
    }
  });

  it('should update an item', () => {
    transcription.addItem(item1, '');
    transcription.updateItem('1', item2);
    expect(transcription.getItem('1')).toEqual(item2);
  });

  it('should remove an item', () => {
    transcription.addItem(item1, '');
    transcription.removeItem('1');
    expect(transcription.getItem('1')).toBeUndefined();
  });

  it('should get ordered items', () => {
    transcription.addItem(item1, '');
    transcription.addItem(item2, '1');
    const orderedItems = transcription.getOrderedItems();
    expect(orderedItems).toEqual([item1, item2]);
  });
});