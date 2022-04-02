const mongoose = require('mongoose');



const dbConnection = async () => {
    try {
        console.log('Conectando a la base de datos');
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
        console.log('DB is connected');
    } catch (error) {
        console.log(error);
        throw new Error('Eror en la base de datos');
    }
}


module.exports = {
    dbConnection
}