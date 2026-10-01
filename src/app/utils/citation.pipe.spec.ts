import { CitationPipe } from './citation.pipe';
import { Book } from './common';

import { describe, expect, it } from 'vitest';

describe('CitationPipe', () => {
  it('create an instance', () => {
    const pipe = new CitationPipe();
    expect(pipe).toBeTruthy();
  });

  it('returns a fallback when the citation is missing', () => {
    expect(new CitationPipe().transform(undefined)).toBe('No Citation given!');
  });

  it('formats a standard book citation', () => {
    expect(new CitationPipe().transform({ Book: Book.ATimeOfWar, Page: 52 }))
      .toBe('See A Time Of War, pg: 52');
  });

  it('formats numeric book titles with a separator', () => {
    expect(new CitationPipe().transform({ Book: Book.EraReport3052, Page: 158 }))
      .toBe('See Era Report-3052, pg: 158');
  });

  it('formats page zero and ignores optional notes', () => {
    expect(new CitationPipe().transform({
      Book: Book.BestGuess,
      Page: 0,
      Notes: ['Best guess citation']
    })).toBe('See Best Guess, pg: 0');
  });
});
