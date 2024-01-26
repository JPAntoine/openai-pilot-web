
export const checkPermissionAPI = async (): Promise<boolean> => {
    // Simulate an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true); // Simulates permission granted
      }, 1000);
    });
};
  