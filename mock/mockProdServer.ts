import { createProdMockServer } from 'vite-plugin-mock/client'

import testModule from './auth/msal-mock';

export function setupProdMockServer() {
  createProdMockServer([...testModule])
}