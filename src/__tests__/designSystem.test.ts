import { TOKENS } from '../tokens';

it('exports more than 20 design tokens', () => {
  expect(Object.keys(TOKENS).length).toBeGreaterThan(20);
});
