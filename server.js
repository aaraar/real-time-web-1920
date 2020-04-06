const express = require ( 'express' );
const app = express ();
require ( 'express-ws' ) ( app );
const bodyParser = require ( 'body-parser' );
require ( 'dotenv' ).config ();
const port = process.env.PORT || 3000;
// const MongoClient = require ( 'mongodb' ).MongoClient;
// const uri = `mongodb+srv://${ process.env.MONGODB_USER }:${ process.env.MONGODB_PASSWORD }@${ process.env.MONGODB_SERVER }/rtw1920?retryWrites=true&w=majority`;
// const client = new MongoClient ( uri, { useNewUrlParser: true, useUnifiedTopology: true } );
//
// client.connect ( err => {
//     const collection = client.db ( "rtw1920" ).collection ( "users" );
    let wsClients = [];
    app.set ( 'view engine', 'pug' );
    app.use ( bodyParser.urlencoded ( { extended: true } ) );
    app.use ( bodyParser.json () );

    app.use ( express.static ( 'static' ) );

    app.ws ( '/send', ( ws, req ) => {

        wsClients.push ( ws );
        ws.on ( 'message', function ( msg ) {
            const message = JSON.parse(msg);
            if ( message.type === 'CHATMESSAGE' ) {
                wsClients.forEach ( wsClient => {
                    if (wsClient === ws) {
                        message.source='own';
                    } else {
                        message.source='other';
                    }
                    wsClient.send(JSON.stringify(message))
                } );
            } else if (message.type === 'LOGIN') {
                wsClients.forEach ( wsClient => {
                    wsClient.send ( JSON.stringify(message) );
                } );
            } else {
                console.log(msg);
            }
        } );

        ws.on ( 'close', ()  => {
            console.log ( 'WebSocket was closed' );
            wsClients = wsClients.filter ( wsClient => wsClient !== ws )
        } )
    } );

    app.post ( '/chat', ( req, res ) => {
        res.render ( 'chat', {
            active: true,
            name: req.body.name,
            title: 'Realtime Web',
            pageTitle: 'Chat'
        } )
    } );


    // app.get('/404', (req, res) => {
    //     res.render ( '404', {
    //         pageTitle: '404',
    //         title: '404'
    //     } );
    // });
    //
    app.get ( '/', ( req, res ) => {
        res.render ( 'index', {
            title: 'Realtime Web',
            pageTitle: 'Login'
        } )
    } );

    app.use ( function ( req, res, next ) {
        res.status ( 404 ).render ( '404', {
            title: '404'
        } );
    } );

    app.listen ( port, () => console.log (
        `Example app listening on port ${ port }!` ) );
// } );
