import { render, screen } from '@testing-library/react';
import Main from './Main';

test('renders Titrew', () => {
  render(<Main />);
  const linkElement = screen.getByText(/Gestion de budgets/i);
  expect(linkElement).toBeInTheDocument();
});
