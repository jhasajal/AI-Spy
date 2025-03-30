// src/util/db.js

// Initialize IndexedDB
export const initDB = () => {
    const request = indexedDB.open('EmotionDB', 1);
  
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Create a store for emotion data if it doesn't exist
      if (!db.objectStoreNames.contains('emotions')) {
        db.createObjectStore('emotions', { keyPath: 'timestamp' });
      }
    };
  
    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.errorCode);
    };
  
    return request;
  };
  
  // Save Emotion Data to IndexedDB
  export const saveEmotionData = (data) => {
    const request = initDB();
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['emotions'], 'readwrite');
      const store = transaction.objectStore('emotions');
      store.add(data);
      transaction.onerror = (e) => console.error('Transaction error:', e.target.errorCode);
    };
  };
  
  // Retrieve Emotion Data from IndexedDB
  export const getEmotionData = (callback) => {
    const request = initDB();
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['emotions'], 'readonly');
      const store = transaction.objectStore('emotions');
      const data = [];
      store.openCursor().onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          data.push(cursor.value);
          cursor.continue();
        } else {
          callback(data); // Pass the retrieved data to the callback
        }
      };
    };
  };