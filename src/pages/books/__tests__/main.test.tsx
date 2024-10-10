import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "../main";
import { MemoryRouter } from "react-router-dom";

// Create a QueryClient instance
const queryClient = new QueryClient();

describe("App Component", () => {
  it("renders the heading", () => {
    // Wrap your component with QueryClientProvider in the test
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });
});
