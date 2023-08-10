import { Background } from './background';
import { Eternal, Experience, Requirment, Stage } from "../utils/common"

describe('Background', () => {
  it('should create an instance', () => {
    expect(new Background(2398, {
      Name: "test",
      Prereq: undefined,
      Cost: 0,
      Experience: [],
      Duration: 10
    })).toBeTruthy();
  });
});
