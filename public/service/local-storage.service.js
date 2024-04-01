// LocalStorageService class definition
class LocalStorageService {
  // Method to get an item from local storage by key
  getItem(key) {
      return localStorage.getItem(key);
  }

  // Method to set an item in local storage with a key and value
  setItem(key, value) {
      localStorage.setItem(key, value);
  }

  // Method to remove an item from local storage by key
  removeItem(key) {
      localStorage.removeItem(key);
  }
}

// Create an instance of LocalStorageService
const localStorageService = new LocalStorageService();