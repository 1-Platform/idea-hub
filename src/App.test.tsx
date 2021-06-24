import ReactDOM from 'react-dom';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ShallowRenderer from 'react-test-renderer/shallow';

import App from './App';

afterEach(() => {
  cleanup();
});

test('testing main app renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('Root App matches the snapshot saved', function () {
  const renderer = ShallowRenderer.createRenderer();
  const tree = renderer.render(<App />);
  expect(tree).toMatchSnapshot();
});
