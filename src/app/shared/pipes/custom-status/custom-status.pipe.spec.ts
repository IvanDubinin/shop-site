import { CustomStatusPipe } from './custom-status.pipe';

describe('CustomStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
