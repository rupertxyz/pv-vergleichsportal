export async function initializeIndexedDB() {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('clientData', 2);

    openRequest.onupgradeneeded = function (e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('records')) {
        db.createObjectStore('records');
      }
    };

    openRequest.onsuccess = function (e) {
      const db = e.target.result;
      resolve(db);
    };

    openRequest.onerror = function (e) {
      console.error('Error opening IndexedDB:', e);
      reject(e);
    };
  });
}
