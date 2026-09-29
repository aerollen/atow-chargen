import { CitationPipe } from './citation.pipe';

import { describe, expect, it } from 'vitest';

describe('CitationPipe', () => {
  it('create an instance', () => {
    const pipe = new CitationPipe();
    expect(pipe).toBeTruthy();
  });
});
