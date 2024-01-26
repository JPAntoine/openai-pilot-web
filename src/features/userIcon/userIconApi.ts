import axios from 'axios';

const getPhoto = async (token: string): Promise<string> => {
  try {
    const response = await axios.get("https://graph.microsoft.com/v1.0/me/photo/$value", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    });

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject('Failed to convert blob to base64 string');
        }
      };
      reader.onerror = () => reject('Error reading blob as base64');
      reader.readAsDataURL(response.data);
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error('Error fetching photo from Microsoft Graph API');
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export default getPhoto;
