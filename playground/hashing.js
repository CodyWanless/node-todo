const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';
// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

var hashedPassword = '$2a$10$7Zqo.RfjU3qHsCIYimajauqjE0XjFWw5E6jHAx3X6SQ2p02z9b8ZW';
bcrypt.compare(password, hashedPassword, (err, result) => {
    console.log(result);
});