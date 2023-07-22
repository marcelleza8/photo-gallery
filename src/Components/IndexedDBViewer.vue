<template>
    <div>
      <h2>IndexedDB Databases:</h2>
      <ul>
        <li v-for="database in databases" :key="database.name">
          {{ database.name }} (version: {{ database.version }}) - Size: {{ database.size | formatBytes }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const databases = ref([]);
  
  onMounted(() => {
    if ('databases' in window.indexedDB) {
      window.indexedDB.databases().then((dbList) => {
        const promises = dbList.map((dbInfo) => getDatabaseSize(dbInfo));
        Promise.all(promises).then((dbSizes) => {
          databases.value = dbSizes;
        });
      });
    } else {
      console.error('The method window.indexedDB.databases() is not supported in this browser.');
    }
  });
  
  async function getDatabaseSize(dbInfo) {
    return new Promise((resolve) => {
      const request = indexedDB.open(dbInfo.name);
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(db.objectStoreNames, 'readonly');
        let size = 0;
  
        transaction.oncomplete = () => {
          resolve({
            name: dbInfo.name,
            version: dbInfo.version,
            size: size,
          });
        };
  
        transaction.onerror = (event) => {
          console.error('Error reading IndexedDB:', event.target.error);
          resolve({
            name: dbInfo.name,
            version: dbInfo.version,
            size: 0,
          });
        };

        console.log(db.objectStoreNames);
  
        // Calculate the size of the object stores
        Object.values(db.objectStoreNames).forEach((storeName) => {
          const objectStore = transaction.objectStore(storeName);
          const request = objectStore.getAllKeys();
  
          request.onsuccess = (event) => {
            const keys = event.target.result;
            keys.forEach((key) => {
              const request = objectStore.get(key);
              request.onsuccess = (event) => {
                const record = event.target.result;
                const recordSize = JSON.stringify(record).length;
                console.log(recordSize);
                size += recordSize;
              };
            });
          };
        });
      };
  
      request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event.target.error);
        resolve({
          name: dbInfo.name,
          version: dbInfo.version,
          size: 0,
        });
      };
    });
  }
  
  // Filter to format the size in bytes to a human-readable format
  const formatBytes = (size) => {
    if (size === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
    return Math.round((size / Math.pow(1024, i)) * 100) / 100 + ' ' + units[i];
  };
  </script>
  