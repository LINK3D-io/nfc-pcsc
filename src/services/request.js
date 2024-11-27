import axios from 'axios';
// Optional: Uncomment and install these dependencies if needed for handling cookies and toast notifications
// import { toast } from 'react-hot-toast';
// import Cookies from 'universal-cookie';

// const cookies = new Cookies();

class Request {
  constructor() {
    this.axios = axios.create();
    this.accessToken = '';

    // Set base URL and other default configurations
	// this.axios.defaults.baseURL = 'http://localhost:5001/';
    this.axios.defaults.baseURL = 'https://api.link3d.io/';
    this.axios.defaults.withCredentials = true;

    // Setup response interceptor to handle global error scenarios
    this.axios.interceptors.response.use(
      response => response,
      error => this.handleErrorResponse(error)
    );
  }

  handleErrorResponse(error) {
    if (error.request && error.request.status === 0 && window.location.pathname !== '/network_error') {
      window.location.href = '/network_error';
    }

    if (error.response) {
      if (error.response.status === 401 && !error.config._retry) {
        error.config._retry = true;
        // Handle token refresh logic here if applicable
      }

      if (error.response.status === 403) {
        window.location.href = '/';
      }

      if (error.response.status === 409) {
        window.location.href = '/';
      }
    }

    throw error;
  }

  async get(url) {
    try {
      const response = await this.axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error during GET request:', error);
      throw error;
    }
  }

  async post(url, data) {
    try {
      const response = await this.axios.post(url, data);
      return response.data;
    } catch (error) {
      console.error('Error during POST request:', error);
      throw error;
    }
  }

  async put(url, data) {
    try {
      const response = await this.axios.put(url, data);
      return response.data;
    } catch (error) {
      console.error('Error during PUT request:', error);
      throw error;
    }
  }

  async delete(url, data) {
    try {
      const response = await this.axios.delete(url, { data });
      return response.data;
    } catch (error) {
      console.error('Error during DELETE request:', error);
      throw error;
    }
  }

  setAccessToken(accessToken) {
    console.log('accessToken', accessToken);
    this.accessToken = accessToken;
    // this.axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    this.axios.defaults.headers.common["Authorization"] =
    `Bearer ${accessToken}`;
  }
}

const request = new Request();
export default request;
