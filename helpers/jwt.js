const jwt = require('jsonwebtoken');


const generarJWT = (uid) => {
    
    return new Promise((resolve, reject) => {
            
        const payload = { uid };
        
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
            // expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                reject('Error al generar el token');
            } else {
                resolve(token);
            }
        });
            
    })

};

module.exports = {
    generarJWT
};