const db = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./DB.db"
    },
    useNullAsDefault: true // so we can avoid sqlite specific bugs
});
db.raw('PRAGMA foreign_keys = ON');

module.exports = db;