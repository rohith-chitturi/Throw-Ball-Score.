const bcrypt = require('bcryptjs');
try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('test', salt);
    console.log('Hash worked:', hash);
} catch (err) {
    console.error('Bcrypt failed:', err);
}
