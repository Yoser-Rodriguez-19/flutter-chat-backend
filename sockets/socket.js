const { verificarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');


// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    // console.log( client.handshake.headers['x-token'] );
    const [ valido, uid ] = verificarJWT( client.handshake.headers['x-token'] );

    // verificar autenticación
    if (!valido) {
        return client.disconnect();
    }

    // cliente conectado y autenticado
    usuarioConectado( uid );

    // ingresar a el usuario a una sala especifica en particular para tener comuinicacion con otro usuario
    //sala global donde estan todos los dispositivos conectados o personas, client.id de socket, uid del usuario de mongo
    client.join( uid );
    // escuchar el mensaje PERSONAL DE EL CLIENTE
    client.on('mensaje-personal', async (payload) => {
        //TODO: grabar menaje en la base de datos
        await grabarMensaje( payload );

        // emitir el mensaje a todos los clientes conectados
        io.to( payload.para ).emit('mensaje-personal', payload );
        
        console.log('Mensaje Personal', payload);
    });





    client.on('disconnect', () => {
        // cliente desconectado
        usuarioDesconectado( uid );
    });

    


    // client.on('mensaje', ( payload ) => {
    //     console.log('Mensaje', payload);

    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    // });


});
