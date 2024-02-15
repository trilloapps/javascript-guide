// api.service.js

// ApiService class definition



const loader = document.getElementById('loader');
const nonLoader = document.getElementById('non-loader');

// Now you can use `loader` and `nonLoader` anywhere in your script
function showLoader() {
  loader.style.display = 'flex';
}

function hideLoader() {
  loader.style.display = 'none';
  nonLoader.style.display = 'block';
}

class ApiService {
  constructor() {
    // Base URL for the API
    this.apiUrl = 'https://fe-wb-lab1.kdlabs.dev';

    // Default headers for API requests, including authorization token from local storage
    this.headers = {
      'Accept': '*/*',
      'x-app-name': 'main',
      'x-org-name': 'cloud', // replace with your organization name
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + localStorageService.getItem('accessToken'),
    };
  }

  // Method to handle user login
  login(userId, password) {
    const endpoint = '/_preauthsvc/user/authenticate';
    const url = this.apiUrl + endpoint;
    // Clone headers and remove 'Authorization' for login request
    const headers = Object.assign({}, this.headers);
    delete headers.Authorization;

    const credentials = { userId, password };

    // Perform login request
    return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(credentials) })
      .then(response => response.json())
      .catch(error => console.error('Login Error:', error));
  }

  // Method to get user details
  getUserDetail(userId) {
    const endpoint = '/ds/function/shared/GetUserDetails';
    const url = this.apiUrl + endpoint;
    const headers = this.headers;
    const payload = { userId };
    // Perform request to get user details
    return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(payload) })
      .then(response => response.json())
      .catch(error => console.error('Login Error:', error));
  }

  // Method to get a list of customers
  getCustomers(start, size) {
    const endpoint = '/ds/function/shared/GetCustomers';
    const url = this.apiUrl + endpoint;
    const headers = this.headers;
    const payload = { start, size };
    showLoader()
    // Perform request to get customers
    return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(payload) })
      .then(response => response.json())
      .then(data => {
        // Hide the loader after the API call is complete
        hideLoader();
        return data;
      })
      .catch(error => {
        // Hide the loader in case of an error
        hideLoader();


        console.error('API Error:', error);
        throw error; // Propagate the error for handling in the calling code
      });
  }

  // Method to get a list of orders for a customer
  getOrders(start, size, customerId) {
    const endpoint = '/ds/function/shared/GetCustomerOrders';
    const url = this.apiUrl + endpoint;
    const headers = this.headers;
    const payload = { start, size, customerId };
    showLoader()
    // Perform request to get customer orders
    return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(payload) })
      .then(response => response.json())
      .then(data => {
        // Hide the loader after the API call is complete
        hideLoader();
        return data;
      })
      .catch(error => {
        // Hide the loader in case of an error
        hideLoader();


        console.error('API Error:', error);
        throw error; // Propagate the error for handling in the calling code
      });
  }

  // Method to get a list of items for an order
  getItems(start, size, orderId) {
    const endpoint = '/ds/function/shared/GetOrderItems';
    const url = this.apiUrl + endpoint;
    const headers = this.headers;
    const payload = { start, size, orderId };
    showLoader()
    // Perform request to get order items
    return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(payload) })
      .then(response => response.json())
      .then(data => {
        // Hide the loader after the API call is complete
        hideLoader();
        return data;
      })
      .catch(error => {
        // Hide the loader in case of an error
        hideLoader();


        console.error('API Error:', error);
        throw error; // Propagate the error for handling in the calling code
      });
  }

  // Method to get details of a specific item
  getItemDetails(itemId) {
    const endpoint = '/ds/function/shared/GetItemDetails';
    const url = this.apiUrl + endpoint;
    const headers = this.headers;
    const payload = { itemId };
    // Show the loader before making the API call
    showLoader();
    // Perform request to get item details
    return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(payload) })
      .then(response => response.json())
      .then(data => {
        // Hide the loader after the API call is complete
        hideLoader();
        return data;
      })
      .catch(error => {
        // Hide the loader in case of an error
        hideLoader();


        console.error('API Error:', error);
        throw error; // Propagate the error for handling in the calling code
      });
  }

  // Method to edit a line item
  editLineItem(data) {
    const endpoint = '/ds/function/shared/EditLineItem';
    const url = this.apiUrl + endpoint;
    const headers = this.headers;

    // Perform request to edit line item
    return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(data) })
      .then(response => response.json())
      .catch(error => console.error('Login Error:', error));
  }

  // Method to upload an image
  uploadImage(formData) {
    const endpoint = '/foldersvc/cloudstorage/upload';
    const url = this.apiUrl + endpoint;

    // Clone headers and remove 'content-type' for image upload
    const headers = Object.assign({}, this.headers);
    delete headers['content-type'];

    // Perform image upload request
    return fetch(url, { method: 'POST', headers: headers, body: formData })
      .then(response => response.json())
      .catch(error => console.error('Login Error:', error));
  }
}

// Create an instance of ApiService
const apiService = new ApiService();
