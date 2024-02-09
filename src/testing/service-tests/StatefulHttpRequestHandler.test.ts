import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { executeApiRequest } from "@/app/StatefulHttpRequestHandler"; // Adjust the import path accordingly
import { baseAxiosInstance } from "@/app/base-api";
import { useDispatch } from "react-redux";

// Mock "react-redux" module
vi.mock("react-redux", () => ({
    ...vi.importActual("react-redux"), // This imports the actual react-redux functions, if needed
    useDispatch: vi.fn(), // Mock useDispatch
  }));

vi.mock("@/app/msalinstance", () => ({
  getToken: vi.fn().mockResolvedValue("mock_access_token"),
}));

// Mock the MSAL module
vi.mock("@azure/msal-browser", () => ({
  PublicClientApplication: vi.fn().mockImplementation(() => ({
    acquireTokenSilent: vi.fn().mockResolvedValue({
      accessToken: "mock_access_token",
    }),
    loginRedirect: vi.fn(),
    loginPopup: vi.fn().mockResolvedValue({
      account: { username: "mockuser@example.com" },
      accessToken: "mocked_access_token",
    }),
    logout: vi.fn(),
    // Add other MSAL methods you use and wish to mock
  })),
}));

describe("StatefulHttpRequestHandler", () => {
  let mock: MockAdapter;
  let mockDispatch: any;

  beforeEach(() => {
    // Initialize the MockAdapter with the axios instance
    mock = new MockAdapter(baseAxiosInstance);
    // Clear mocks and setup
    mockDispatch = vi.fn();
    vi.mocked(useDispatch).mockReturnValue(mockDispatch); // Corrected mock syntax
  });

  afterEach(() => {
    mock.restore(); // Restore axios adapter to default
    vi.clearAllMocks(); // Resets all mocks
  });

  it("completes successfully without retries", async () => {
    const dispatchMock = vi.fn();
    const testData = { data: "test" };

    // Mocking a successful response for a specific URL
    mock.onPost("test/url").reply(200, testData);

    const result = await executeApiRequest({
      args: { sampleData: "data" }, // Adjust according to your API args
      cancelToken: new axios.CancelToken(() => {}),
      dispatch: dispatchMock,
      url: "test/url",
    });

    expect(result).toEqual(testData);
  });
});
