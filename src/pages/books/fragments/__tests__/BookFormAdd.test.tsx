import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BookFormAdd from "../BookFormAdd";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "@/lib/helper/AuthProvider";
import { vi, Mock } from "vitest";

vi.mock("@/lib/helper/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/repositories/books/service", () => ({
  useCreateBook: vi.fn(() => ({
    mutate: vi.fn((_, { onError }) => {
      onError(new Error("Create error"));
    }),
    isPending: false,
    error: null,
  })),
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

  it("assigns empty string to user_id if no auth user", () => {
    (useAuth as Mock).mockReturnValue({ user: null });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BookFormAdd open={true} setOpen={vi.fn()}>
            {null}
          </BookFormAdd>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const userIdInput = screen.getByTestId("user-id") as HTMLInputElement;
    expect(userIdInput.value).toBe("");
  });

  it("assigns user_id from auth user in form default values", () => {
    (useAuth as Mock).mockReturnValue({ user: { id: "user123" } });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BookFormAdd open={true} setOpen={vi.fn()}>
            {null}
          </BookFormAdd>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const userIdInput = screen.getByTestId("user-id") as HTMLInputElement;
    expect(userIdInput.value).toBe("user123");
  });

  it("resets the form to its default values when the form is closed", async () => {
    const setOpenMock = vi.fn();

    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BookFormAdd open={true} setOpen={setOpenMock}>
            {null}
          </BookFormAdd>
        </MemoryRouter>
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test Book" },
    });
    fireEvent.change(screen.getByLabelText("Description (Optional)"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText("Start Period"), {
      target: { value: "2023-01-01" },
    });
    fireEvent.change(screen.getByLabelText("End Period"), {
      target: { value: "2023-12-31" },
    });

    // Simulate closing the form
    rerender(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BookFormAdd open={false} setOpen={setOpenMock}>
            {null}
          </BookFormAdd>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Reopen the form
    rerender(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BookFormAdd open={true} setOpen={setOpenMock}>
            {null}
          </BookFormAdd>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe(
        ""
      );
      expect(
        (screen.getByLabelText("Description (Optional)") as HTMLInputElement)
          .value
      ).toBe("");
      expect(
        (screen.getByLabelText("Start Period") as HTMLInputElement).value
      ).toBe("");
      expect(
        (screen.getByLabelText("End Period") as HTMLInputElement).value
      ).toBe("");
    });
  });

  it("throws and logs errorCreate when mutate fails", async () => {
    const setOpenMock = vi.fn();
    const errorCreate = new Error("Create error");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BookFormAdd open={true} setOpen={setOpenMock}>
            {null}
          </BookFormAdd>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const consoleLogSpy = vi.spyOn(console, "log");

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test Book" },
    });
    fireEvent.change(screen.getByLabelText("Description (Optional)"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText("Start Period"), {
      target: { value: "2023-01-01" },
    });
    fireEvent.change(screen.getByLabelText("End Period"), {
      target: { value: "2023-12-31" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith(errorCreate);
      expect(setOpenMock).toHaveBeenCalledWith(false);
    });

    consoleLogSpy.mockRestore();
  });
});
