// api.service.js

class ApiService {
  constructor() {
    this.apiUrl = 'https://api.eng-dev-1.trilloapps.com';
    this.headers = {
      'Accept': '*/*',
      'x-app-name': 'main',
      'x-org-name': 'cloud', // replace with your organization name
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + localStorageService.getItem('accessToken'),
    };
  }

  login(j_username, j_password) {
    const endpoint = '/ajaxLogin';
    const url = this.apiUrl + endpoint;
    const headers = Object.assign({}, this.headers);
    delete headers.Authorization;
    const credentials = { j_username, j_password };

    return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(credentials) })
      .then(response => response.json())
      .catch(error => console.error('Login Error:', error));
  }
  getUserDetail(userId) {
    const endpoint = '/ds/function/shared/GetUserDetails';
    const url = this.apiUrl + endpoint;
    const headers = this.headers;
    const payload = { userId };

    return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(payload) })
      .then(response => response.json())
      .catch(error => console.error('Login Error:', error));
  }
  getCustomers(start, size) {
    const endpoint = '/ds/function/shared/GetCustomers';
    const url = this.apiUrl + endpoint;
    const headers = this.headers;
    const payload = { start, size };

    return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(payload) })
      .then(response => response.json())
      .catch(error => console.error('Login Error:', error));
  }
  getOrders(start, size, customerId) {
    const endpoint = '/ds/function/shared/GetCustomerOrders';
    const url = this.apiUrl + endpoint;
    const headers = this.headers;
    const payload = { start, size, customerId };

    return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(payload) })
      .then(response => response.json())
      .catch(error => console.error('Login Error:', error));
  }
  getItems(start, size, orderId) {
    const endpoint = '/ds/function/shared/GetOrderItems';
    const url = this.apiUrl + endpoint;
    const headers = this.headers;
    const payload = { start, size, orderId };

    return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(payload) })
      .then(response => response.json())
      .catch(error => console.error('Login Error:', error));
  }
  getItemDetails(itemId) {
    const endpoint = '/ds/function/shared/GetItemDetails';
    const url = this.apiUrl + endpoint;
    const headers = this.headers;
    const payload = { itemId };

    return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(payload) })
      .then(response => response.json())
      .catch(error => console.error('Login Error:', error));
  }
  editLineItem(data) {
    const endpoint = '/ds/function/shared/EditLineItem';
    const url = this.apiUrl + endpoint;
    const headers = this.headers;

    return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(data) })
      .then(response => response.json())
      .catch(error => console.error('Login Error:', error));
  }
  uploadImage(formData) {
    const endpoint = '/foldersvc/cloudstorage/upload';
    const url = this.apiUrl + endpoint;
    const headers = Object.assign({}, this.headers);
    delete headers['content-type'];

    return fetch(url, { method: 'POST', headers: headers, body: formData })
      .then(response => response.json())
      .catch(error => console.error('Login Error:', error));
  }
}

const apiService = new ApiService();