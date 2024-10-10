import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, Mock } from "vitest";
import BookFormEdit from "../BookFormEdit";
import { useAuth } from "@/lib/helper/AuthProvider";
import { useBookFindById, useEditBook } from "@/repositories/books/service";

vi.mock("@/lib/helper/AuthProvider");
vi.mock("@/repositories/books/service");

describe("BookFormEdit", () => {
  const mockSetBookId = vi.fn();
  const mockSetOpen = vi.fn();
  const mockMutate = vi.fn();

  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({ user: { id: "user123" } });
    (useBookFindById as Mock).mockReturnValue({ data: null, isLoading: false });
    (useEditBook as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
    });
  });

  it("renders without crashing", () => {
    render(
      <BookFormEdit
        children={<button>Edit Book</button>}
        bookId="book123"
        setBookId={mockSetBookId}
        open={true}
        setOpen={mockSetOpen}
      />
    );
    expect(screen.getByText("Edit Book Detail")).toBeInTheDocument();
  });

  it("renders form fields correctly", () => {
    render(
      <BookFormEdit
        children={<button>Edit Book</button>}
        bookId="book123"
        setBookId={mockSetBookId}
        open={true}
        setOpen={mockSetOpen}
      />
    );

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description (Optional)")).toBeInTheDocument();
    expect(screen.getByLabelText("Start Period")).toBeInTheDocument();
    expect(screen.getByLabelText("End Period")).toBeInTheDocument();
  });

  it("renders submit button correctly", () => {
    render(
      <BookFormEdit
        children={<button>Edit Book</button>}
        bookId="book123"
        setBookId={mockSetBookId}
        open={true}
        setOpen={mockSetOpen}
      />
    );

    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    const mockMutate = vi.fn();
    (useEditBook as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    });

    render(
      <BookFormEdit
        children={<button>Edit Book</button>}
        bookId="book123"
        setBookId={mockSetBookId}
        open={true}
        setOpen={mockSetOpen}
      />
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "New Book Name" },
    });
    fireEvent.change(screen.getByLabelText("Description (Optional)"), {
      target: { value: "New Description" },
    });
    fireEvent.change(screen.getByLabelText("Start Period"), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByLabelText("End Period"), {
      target: { value: "2024-12-31" },
    });

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        id: "book123",
        user_id: "user123",
        book_name: "New Book Name",
        description: "New Description",
        start_period: "2024-01-01",
        end_period: "2024-12-31",
      });
    });
  });

  it("handles form submission with missing required fields", async () => {
    render(
      <BookFormEdit
        bookId="book123"
        setBookId={mockSetBookId}
        open={true}
        setOpen={mockSetOpen}
        children={<button>Edit Book</button>}
      />
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Start Period"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("End Period"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      expect(screen.getByText(/input your book name/i)).toBeInTheDocument();
      expect(screen.getByText(/input your start period/i)).toBeInTheDocument();
      expect(screen.getByText(/input your end period/i)).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });
});
