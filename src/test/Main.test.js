import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Main from "../main/Main";

test('renders Titre', () => {
  render(<Main />);
  const linkElement = screen.getAllByText(/Gestion de budgets/i);
  expect(linkElement).toBeInTheDocument();
});
