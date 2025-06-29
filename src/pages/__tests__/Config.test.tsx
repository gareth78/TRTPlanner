import { render, screen, fireEvent } from '@testing-library/react';
import Config from '../Config';

describe('Config injectables', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders injectable section on yes', () => {
    render(<Config />);
    expect(
      screen.getByText(/peptides or injectables you wish recorded/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/Add another/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Yes'));
    expect(screen.getByText(/Add another/i)).toBeInTheDocument();
  });

  test('add and remove injectable', () => {
    render(<Config />);
    fireEvent.click(screen.getByLabelText('Yes'));
    fireEvent.click(screen.getByText(/Add another/i));
    expect(screen.getAllByPlaceholderText(/Injectable/).length).toBe(2);
    fireEvent.click(screen.getAllByText('Remove')[0]);
    expect(screen.getAllByPlaceholderText(/Injectable/).length).toBe(1);
  });

  test('saves and loads injectables', () => {
    const { unmount } = render(<Config />);
    fireEvent.change(screen.getByLabelText(/Name/), {
      target: { value: 'Bob' },
    });
    fireEvent.click(screen.getByLabelText('Yes'));
    fireEvent.change(screen.getByPlaceholderText('Injectable 1'), {
      target: { value: 'Peptide' },
    });
    fireEvent.click(screen.getByText('Save'));

    const stored = JSON.parse(localStorage.getItem('configSettings') || '{}');
    expect(stored.injectables[0].name).toBe('Peptide');

    unmount();
    render(<Config />);
    expect(screen.getByPlaceholderText('Injectable 1')).toHaveValue('Peptide');
  });
});
