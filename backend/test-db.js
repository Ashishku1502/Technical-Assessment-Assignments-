const db = require('./src/db');
db.query('SELECT 1 as test').then(res => {
    console.log('Query Result:', res.rows);
    process.exit(0);
}).catch(err => {
    console.error('Query Error:', err);
    process.exit(1);
});
