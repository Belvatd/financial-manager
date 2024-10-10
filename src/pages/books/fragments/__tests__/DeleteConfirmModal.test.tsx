import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DeleteConfirmModal from "../DeleteConfirmModal";
import { vi } from "vitest";

const queryClient = new QueryClient();

const mutateDeleteMock = vi.fn();

vi.mock("@/repositories/books/service", () => ({
  useDeleteBook: () => ({
    mutate: mutateDeleteMock,
    isPending: false,
    error: null,
  }),
}));

describe("DeleteConfirmModal Component", () => {
  it("renders the dialog content", () => {
    const setBookIdMock = vi.fn();
    const setOpenMock = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <DeleteConfirmModal
          bookId="1"
          setBookId={setBookIdMock}
          open={true}
          setOpen={setOpenMock}
        >
          <button>Open Modal</button>
        </DeleteConfirmModal>
      </QueryClientProvider>
    );

    expect(screen.getByText(/Are you absolutely sure\?/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /This action cannot be undone. This will permanently delete your book and remove your data from our servers./i
      )
    ).toBeInTheDocument();
  });

  it("handles delete action", async () => {
    const setBookIdMock = vi.fn();
    const setOpenMock = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <DeleteConfirmModal
          bookId="1"
          setBookId={setBookIdMock}
          open={true}
          setOpen={setOpenMock}
        >
          <button>Open Modal</button>
        </DeleteConfirmModal>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByTestId("delete-button"));

    await waitFor(() => {
      expect(mutateDeleteMock).toHaveBeenCalledWith("1");
      expect(setOpenMock).toHaveBeenCalledWith(false);
    });
  });
});
