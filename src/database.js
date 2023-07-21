import Dexie from "dexie";

const tables = {
  files: "++id, base64, created_at, updated_at",
}

const db = new Dexie("photo-gallery");
db.version(1).stores(tables);

Object.keys(tables).forEach((table) => {
  db[table].hook('creating', function (primKey, obj, transaction) {
    obj.created_at = new Date().toISOString();
    obj.updated_at = new Date().toISOString();
  });
  
  db[table].hook('updating', function (transaction, primKey, obj) {
    obj.updated_at = new Date().toISOString();
  });
})

export default db;
