export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('GameResultsDB', 1);

    request.onerror = (event) => {
      console.error("Error opening database:", event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('results')) {
        db.createObjectStore('results', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const getResults = async (mode) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction("results", "readonly");
    const store = transaction.objectStore("results");

    const results = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const data = request.result.filter((result) => result.mode === mode);
        resolve(data);
      };
      request.onerror = () => reject("Error retrieving results");
    });

    return results.sort((a, b) => b.points - a.points).slice(0, 10);
  } catch (error) {
    console.error("Error getting results:", error);
    throw error;
  }
};


export const getResultsForOneUser = async (mode, username) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction("results", "readonly");
    const store = transaction.objectStore("results");

    const result = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const data = request.result.filter((entry) => entry.mode === mode && entry.username === username);
        resolve(data);
      };
      request.onerror = () => reject("Error retrieving results");
    });

    return result;
  } catch (error) {
    console.error("Error getting results:", error);
    throw error;
  }
};


export const saveResult = async (username, points, mode) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction("results", "readwrite");
    const store = transaction.objectStore("results");

    const pointsNumber = Number(points);

    const existingRecord = await new Promise((resolve, reject) => {
      const indexRequest = store.openCursor();
      let foundRecord = null;

      indexRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const record = cursor.value;
          if (record.username === username && record.mode === mode) {
            foundRecord = record;
            resolve(foundRecord);
          } else {
            cursor.continue();
          }
        } else {
          resolve(null);
        }
      };

      indexRequest.onerror = (event) => reject(event.target.error);
    });

    if (existingRecord) {
      if (pointsNumber > existingRecord.points) {
        const deleteRequest = store.delete(existingRecord.id);
        deleteRequest.onsuccess = () => {
          const addRequest = store.add({ username, points: pointsNumber, mode });
        };
        deleteRequest.onerror = (event) => console.error("Error deleting old result:", event.target.error);
      }
    } else {
      const addRequest = store.add({ username, points: pointsNumber, mode });
    }

    await new Promise((resolve, reject) => {
      transaction.oncomplete = resolve;
      transaction.onerror = (event) => reject(event.target.error);
    });

  } catch (error) {
    throw error;
  }
};

