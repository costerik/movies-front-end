import { describe, test, vi, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../components/ui/Pagination'; // Update the import path

describe('Pagination Component', () => {
  const mockOnPageChange = vi.fn();

  describe('Rendering Conditions', () => {
    test('does not render when totalPages <= 1', () => {
      const { container } = render(
        <Pagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} />,
      );
      expect(container).toBeEmptyDOMElement();
    });

    test('renders with className when provided', () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
          className="custom-class"
        />,
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Page Number Generation', () => {
    test.each([
      { total: 5, current: 1, expected: [1, 2, 3, 4, 5] },
      { total: 10, current: 1, expected: [1, 2, 3, 4, 5] },
      { total: 10, current: 5, expected: [3, 4, 5, 6, 7] },
      { total: 10, current: 8, expected: [6, 7, 8, 9, 10] },
      { total: 10, current: 10, expected: [6, 7, 8, 9, 10] },
    ])(
      'displays correct pages for total: $total, current: $current',
      ({ total, current, expected }) => {
        render(
          <Pagination currentPage={current} totalPages={total} onPageChange={mockOnPageChange} />,
        );

        const pageButtons = screen.getAllByRole('button', { name: /Page \d+/ });
        const pageNumbers = pageButtons.map(btn => parseInt(btn.textContent || '0'));

        expect(pageNumbers).toEqual(expected);
      },
    );
  });

  describe('Navigation Buttons', () => {
    test('Previous button is disabled on first page', () => {
      render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);

      const prevButton = screen.getByRole('button', { name: 'Previous page' });
      expect(prevButton).toBeDisabled();
    });

    test('Next button is disabled on last page', () => {
      render(<Pagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />);

      const nextButton = screen.getByRole('button', { name: 'Next page' });
      expect(nextButton).toBeDisabled();
    });

    test('clicking Previous calls onPageChange with current-1', () => {
      render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

      fireEvent.click(screen.getByText('Previous'));
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    test('clicking Next calls onPageChange with current+1', () => {
      render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

      fireEvent.click(screen.getByText('Next'));
      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });
  });

  describe('Interaction and Styling', () => {
    test('current page has active styling', () => {
      render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

      const activeButton = screen.getByRole('button', { name: 'Page 3' });
      expect(activeButton).toHaveClass('bg-blue-600');
      expect(activeButton).toHaveAttribute('aria-current', 'page');
    });

    test('clicking page number calls onPageChange', () => {
      render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

      fireEvent.click(screen.getByText('4'));
      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });
  });

  describe('Accessibility', () => {
    test('buttons have proper aria labels', () => {
      render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

      expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });
  });
});
