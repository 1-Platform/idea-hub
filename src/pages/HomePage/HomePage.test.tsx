import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ShallowRenderer from 'react-test-renderer/shallow';

import { HomePage } from './HomePage';

afterEach(() => {
  cleanup();
});

test('HomePage matches the snapshot saved', function () {
  const renderer = ShallowRenderer.createRenderer();
  const tree = renderer.render(<HomePage />);
  expect(tree).toMatchSnapshot();
});
