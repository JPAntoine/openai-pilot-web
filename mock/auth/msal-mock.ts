// test.ts
export default [
  {
    url: '/organizations/oauth2/v2.0/authorize',
    method: 'post',
    response: () => {
      // mock the authorize endpoint
      // you can use the query parameters to customize the response
      return {
        accessToken: 'mock-access-token',
        idToken: 'mock-id-token',
        // ... other mock data
      };
    }
  },
]