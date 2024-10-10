import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BookFormAdd from "../BookFormAdd";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "@/lib/helper/AuthProvider";
import { vi, Mock } from "vitest";

vi.mock("@/lib/helper/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

const queryClient = new QueryClient();

const mockMutate = vi.fn();
const mockSetOpen = vi.fn();

describe("BookFormAdd Component", () => {
  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({ user: { id: "123" } });
  });

  it("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BookFormAdd open={true} setOpen={vi.fn()}>
            {null}
          </BookFormAdd>
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  it("renders all form fields", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BookFormAdd open={true} setOpen={vi.fn()}>
            {null}
          </BookFormAdd>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Description \(Optional\)/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Period/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Period/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BookFormAdd open={true} setOpen={vi.fn()}>
            {null}
          </BookFormAdd>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BookFormAdd open={true} setOpen={mockSetOpen}>
            {null}
          </BookFormAdd>
        </MemoryRouter>
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "Test Book" },
    });
    fireEvent.change(screen.getByLabelText(/Description \(Optional\)/i), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText(/Start Period/i), {
      target: { value: "2023-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/End Period/i), {
      target: { value: "2023-12-31" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  it("handles form submission with missing required fields", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BookFormAdd open={true} setOpen={vi.fn()}>
            {null}
          </BookFormAdd>
        </MemoryRouter>
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/Start Period/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/End Period/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(screen.getByText(/input your book name/i)).toBeInTheDocument();
      expect(screen.getByText(/input your start period/i)).toBeInTheDocument();
      expect(screen.getByText(/input your end period/i)).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });
});
