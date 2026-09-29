import { StatPipe } from './stat.pipe';

import { describe, expect, it } from 'vitest';

describe('StatPipe', () => {
  it('create an instance', () => {
    const pipe = new StatPipe();
    expect(pipe).toBeTruthy();
  });
});
