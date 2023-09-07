import { Education } from './education';

describe('Education', () => {
  it('should create an instance', () => {
    expect(new Education(0, {
      Name: '',
      Skills: []
    })).toBeTruthy();
  });
});
