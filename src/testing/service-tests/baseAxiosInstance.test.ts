import MockAdapter from "axios-mock-adapter";
import { baseAxiosInstance } from "@/app/base-api";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import axios from "axios";
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

describe("baseAxiosInstance", () => {
  let mock: MockAdapter;
  let mockDispatch: any;

  beforeEach(() => {
    // Initialize the MockAdapter with the axios instance
    mock = new MockAdapter(baseAxiosInstance);// Clear mocks and setup
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

  it("should fail a GET request due to invalid token", async () => {
    // Simulate a 401 Unauthorized response to indicate an invalid or expired token
    mock.onGet("/test").reply(401, { message: "Unauthorized" });

    try {
        await baseAxiosInstance.get("/test");
        // If the request does not throw, force the test to fail
        expect(true).toBe(false);
    } catch (error) {
        // Assuming error is an instance of AxiosError
        if (axios.isAxiosError(error)) {
            // Verify that the request was made and failed as expected
            expect(error.response?.status).toEqual(401);
            expect(error.response?.data).toEqual({ message: "Unauthorized" });
            // Check that the interceptor attempted to authorize the request
            expect(error?.config?.headers["Authorization"]).toEqual(`Bearer mock_access_token`);
            // Verify that no retry attempts were made (assuming retry logic might be implemented)
            expect(mock.history.get.length).toBe(1);
        } else {
            // If the error is not an AxiosError, force the test to fail
            expect(true).toBe(false);
        }
    }
  });
});
