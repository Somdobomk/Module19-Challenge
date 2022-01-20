let db;

const request = indexedDB.open('budget-tracker', 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore('pwa-budget', { autoIncrement: true });
};

//  when successfully connected to the database
request.onsuccess = function(event) {
  db = event.target.result;

  // check if app is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

// when there is an error connecting to the database
request.onerror = function(event) {
  console.log('event.target.errorCode');
};

// execute if we attempt to submit a new record to the database while offline
function saveRecord(record) {
  const transaction = db.transaction(['pwa-budget'], 'readwrite');
  const store = transaction.objectStore('pwa-budget');
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        HEADERS: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
      })
        .then(response => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            console.log(serverResponse.message);
            }
            const transaction = db.transaction(['pwa-budget'], 'readwrite');
            const store = transaction.objectStore('pwa-budget');
            store.clear();
            });
            }
            };
            };

window.addEventListener('online', checkDatabase);