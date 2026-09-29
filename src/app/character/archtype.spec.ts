import { Archtype as ArchtypeClass } from './archtype';
import { Archtype } from '../utils/common';

import { describe, expect, it } from 'vitest';

describe('Archtype', () => {
  it('stores its type and stage data', () => {
    const data = {
      0: { Affiliations: [] },
      1: { Backgrounds: [] },
      2: { Backgrounds: [] },
      3: { Educations: [] },
      4: { Backgrounds: [] }
    } as ConstructorParameters<typeof ArchtypeClass>[1];
    const archtype = new ArchtypeClass(Archtype.Academic, data);

    expect(archtype.type).toBe(Archtype.Academic);
    expect(archtype.calculateSuggestedScore('test')).toBe(0);
  });
});