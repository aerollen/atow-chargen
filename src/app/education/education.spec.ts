import { Education } from './education';

import { describe, expect, it } from 'vitest';

describe('Education', () => {
  it('should create an instance', () => {
    expect(new Education(0, {
      Name: '',
      Cost: 0,
      Experience: []
    })).toBeTruthy();
  });
});
