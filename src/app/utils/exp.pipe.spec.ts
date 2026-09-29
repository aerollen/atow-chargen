import { ExpPipe } from './exp.pipe';

import { describe, expect, it } from 'vitest';

describe('ExpPipe', () => {
  it('create an instance', () => {
    const pipe = new ExpPipe();
    expect(pipe).toBeTruthy();
  });
});
