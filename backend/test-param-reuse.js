const db = require('./src/db');
db.query('SELECT $1 as a, $1 as b, $2 as c', ['val1', 'val2']).then(res => {
    console.log('Query Result:', res.rows);
    if (res.rows[0].a === 'val1' && res.rows[0].b === 'val1' && res.rows[0].c === 'val2') {
        console.log('TEST PASSED: Parameter reuse works');
    } else {
        console.log('TEST FAILED: Parameter reuse failed');
    }
    process.exit(0);
}).catch(err => {
    console.error('Query Error:', err);
    process.exit(1);
});
