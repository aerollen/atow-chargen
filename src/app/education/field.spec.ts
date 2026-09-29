import { Field } from './field';

import { describe, expect, it } from 'vitest';

describe('Field', () => {
  it('should create an instance', () => {
    expect(new Field(2398, { Name: '', Skills: [] })).toBeTruthy();
  });
});
