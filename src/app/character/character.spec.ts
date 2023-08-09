import { Character, Option } from './character';

describe('Character', () => {
  it('should create an instance', () => {
    expect(new Character({ Option: Option.Create })).toBeTruthy();
  });
});
