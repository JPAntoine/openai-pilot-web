import MockAdapter from "axios-mock-adapter";
import { baseAxiosInstance } from "@/app/base-api";
import { RetryTimes } from "@/app/constants";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useDispatch } from "react-redux";

// Mock "react-redux" module
vi.mock("react-redux", () => ({
  ...vi.importActual("react-redux"), // This imports the actual react-redux functions, if needed
  useDispatch: vi.fn(), // Mock useDispatch
}));

vi.mock('@/app/msalinstance', () => ({
    getToken: vi.fn().mockResolvedValue('mock_access_token'),
  }));

// Mock the MSAL module
vi.mock('@azure/msal-browser', () => ({
    PublicClientApplication: vi.fn().mockImplementation(() => ({
      acquireTokenSilent: vi.fn().mockResolvedValue({
        accessToken: 'mock_access_token',
      }),
      loginRedirect: vi.fn(),
      loginPopup: vi.fn().mockResolvedValue({
        account: { username: 'mockuser@example.com' },
        accessToken: 'mocked_access_token',
      }),
      logout: vi.fn(),
      // Add other MSAL methods you use and wish to mock
    })),
  }));

describe("baseAxiosInstance with retry logic", () => {
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

  it("should successfully make a GET request without retrying", async () => {
    mock.onGet("/test").reply(200, { data: "success" });

    const response = await baseAxiosInstance.get("/test");

    expect(response.data).toEqual({ data: "success" });
    expect(response.config.headers["Authorization"]).toEqual(`Bearer mock_access_token`)
    expect(mock.history.get.length).toBe(1);
  });

  it("should retry the request on a 503 status code and eventually succeed", async () => {
    mock
      .onGet("/test")
      .replyOnce(503)
      .onGet("/test")
      .reply(200, { data: "success after retry" });

    const response = await baseAxiosInstance.get("/test");

    expect(response.data).toEqual({ data: "success after retry" });
    expect(response.config.headers["Authorization"]).toEqual(`Bearer mock_access_token`)
    // Check that the request was retried the correct number of times
    expect(mock.history.get.length).toBe(2);
  });

  it("should stop retrying after reaching the maximum retry limit", async () => {
    mock.onGet("/test").reply(503);

    await expect(baseAxiosInstance.get("/test")).rejects.toThrow();
    // +1 accounts for the initial request
    expect(mock.history.get.length).toBe(RetryTimes.MAX_RETRY_DURATION + 1);
  });

});
