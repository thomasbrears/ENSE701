import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LookupSubmission from "../pages/articles/lookup-submission";
import axios from "axios";
import "@testing-library/jest-dom";

// mocking axios
jest.mock("axios");

describe("LookupSubmission", () => {
  afterEach(() => {
    jest.clearAllMocks(); // clear mock calls
  });

  test("displays error when invalid submission ID is entered", async () => {
    render(<LookupSubmission />);

    const input = screen.getByPlaceholderText("Please enter your email or submission ID");
    
    fireEvent.change(input, { target: { value: "invalidID" } });
    fireEvent.keyPress(input, { key: "Enter", code: 13, charCode: 13 });
    
    await waitFor(() => {
      expect(screen.getByText("Please enter a valid email or submission ID.")).toBeInTheDocument();
    });
  });

  test("displays article status for valid submission ID", async () => {
    // mock api response
    const article = {
      _id: "123456789012345678901234",
      title: "Test Article",
      status: "pending",
      submitted_at: "2024-10-22T10:20:30Z"
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [article] });

    render(<LookupSubmission />);

    const input = screen.getByPlaceholderText("Please enter your email or submission ID");

    fireEvent.change(input, { target: { value: "123456789012345678901234" } });
    fireEvent.keyPress(input, { key: "Enter", code: 13, charCode: 13 });

    await waitFor(() => {
      expect(screen.getByText("Test Article")).toBeInTheDocument();
      expect(screen.getByText("The article has been submitted and is in the queue for a moderator to review.")).toBeInTheDocument();
    });
  });

  test("displays network error if API call fails", async () => {
    // mocking a network error
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(<LookupSubmission />);

    const input = screen.getByPlaceholderText("Please enter your email or submission ID");

    fireEvent.change(input, { target: { value: "123456789012345678901234" } });
    fireEvent.keyPress(input, { key: "Enter", code: 13, charCode: 13 });

    await waitFor(() => {
      expect(screen.getByText("Network error: Please check your internet connection.")).toBeInTheDocument();
    });
  });
});
