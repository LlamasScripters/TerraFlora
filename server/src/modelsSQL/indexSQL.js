const fs = require("node:fs");
const path = require("node:path");
const connection = require("./dataBase.js");

const files = fs.readdirSync(__dirname);
const db = {
  connection,
};
for (const file of files) {
  if (["index.js", "dataBase.js"].includes(file)) continue;
  const model = require(path.join(__dirname, file))(connection);
  db[model.name] = model;
}

for (let modelName in db) {
  if (db[modelName] === connection) continue;
  if (db[modelName].associateToto) db[modelName].associateToto(db);
}

module.exports = db;