import { ArchtypePipe } from './archtype.pipe';

import { describe, expect, it } from 'vitest';

describe('ArchtypePipe', () => {
  it('create an instance', () => {
    const pipe = new ArchtypePipe();
    expect(pipe).toBeTruthy();
  });
});
