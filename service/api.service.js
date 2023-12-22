// api.service.js

class ApiService {
    constructor() {
      this.apiUrl = 'https://api.eng-dev-1.trilloapps.com';
      this.headers = {
        'Accept': '*/*',
        'x-app-name': 'main',
        'x-org-name': 'cloud', // replace with your organization name
        'content-type': 'application/json',
        'Authorization': 'Bearer ' +  localStorageService.getItem('accessToken'),
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
      getCustomers(start, size) {
        const endpoint = '/ds/function/shared/GetCustomers';
        const url = this.apiUrl + endpoint;
        const headers = this.headers;
        const payload = { start, size };
    
        return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(payload) })
          .then(response => response.json())
          .catch(error => console.error('Login Error:', error));
      }
  }
  
  const apiService = new ApiService();