import { Background } from './background';
import { Eternal } from "../utils/common"

import { describe, expect, it } from 'vitest';

describe('Background', () => {
  it('should create an instance', () => {
    const background = new Background(2398, {
      Name: "test",
      Cost: 0,
      Experience: [],
      Duration: 10
    });

    expect(background.At(0 as Eternal)).toMatchObject({
      Name: 'test',
      Cost: 0,
      Duration: 10,
      Experience: []
    });
  });
});