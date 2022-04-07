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

const verificarJWT = (token = '') => {
        
    // validar el token
    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        return [ true, uid ];
    } 
    catch (error) { 
        return [ false, null ];
    }
        
}

module.exports = {
    generarJWT,
    verificarJWT
};