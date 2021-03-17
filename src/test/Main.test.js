import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Main from "../main/Main";

test('renders Titrew', () => {
  render(<Main />);
  const linkElement = screen.getByText(/Gestion de budgets/i);
  expect(linkElement).toBeInTheDocument();
});
