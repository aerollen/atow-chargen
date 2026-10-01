import { Background } from './background';
import { BackgroundInfo } from './background';
import { Eternal } from "../utils/common"

import { describe, expect, it } from 'vitest';

describe('Background', () => {
  const info: BackgroundInfo = {
    Name: 'test',
    Cost: 0,
    Experience: [],
    Duration: 10
  };

  it('should create an instance', () => {
    const background = new Background(2398, info);

    expect(background.At(0 as Eternal)).toMatchObject({
      Name: 'test',
      Cost: 0,
      Duration: 10,
      Experience: []
    });
  });

  it('returns undefined before the background is first allowed', () => {
    const background = new Background(2398, info);

    expect(background.At(-1 as Eternal)).toBeUndefined();
  });

  it('applies partial updates from their effective year and preserves other fields', () => {
    const background = new Background(2398, info).update(2400, { Cost: 25 });

    expect(background.At(1 as Eternal)?.Cost).toBe(0);
    expect(background.At(2 as Eternal)).toMatchObject({
      Name: 'test',
      Cost: 25,
      Duration: 10,
      Experience: []
    });
  });

  it('can be disabled and later enabled again', () => {
    const background = new Background(2398, info)
      .disable(2400)
      .enable(2402, info);

    expect(background.At(1 as Eternal)).toBeDefined();
    expect(background.At(2 as Eternal)).toBeUndefined();
    expect(background.At(4 as Eternal)).toMatchObject(info);
  });
});