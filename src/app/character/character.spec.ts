import { Character, Option } from './character';

import { describe, expect, it } from 'vitest';

describe('Character', () => {
  it('creates a new character with a name and experience stream', () => {
    const character = new Character({ Option: Option.Create });

    expect(character.Name).toBe('');
    expect(character.Experience).toBeDefined();
  });
});