if (!window) var window = global;

var obtains = [
  'express',
  'body-parser',
  'fs',
  'express-fileupload',
  'express-session',
  'https',
];

obtain(obtains, (express, bodyParser, fs, fileUpload, session, cookieParser, https)=> {
  if (!window.expressServer) {
    window.expressServer = {};
    window.expressServer.sessionParser = session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true,
    });
    // window.expressServer.sessionParser = session({
    //   saveUninitialized: false,
    //   secret: '$eCuRiTy',
    //   resave: false,
    // });

    // const options = {
    //   cert: fs.readFileSync(`${global.tld}/sslcert/fullchain.pem`),
    //   key: fs.readFileSync(`${global.tld}/sslcert/privkey.pem`),
    // };

    var fileServer = express();
    var router = express.Router();

    router.use(bodyParser.json());
    router.use(fileUpload());

    fileServer.use(window.expressServer.sessionParser);

    fileServer.set('view engine', 'pug');

    fileServer.use('', express.static('./client'));
    fileServer.use('/common', express.static('./common'));

    fileServer.use(router);
    window.expressServer.httpServer = fileServer.listen(80, function () {
      console.log('listening on 80');
    });

    //window.expressServer.httpsServer = https.createServer(options, fileServer).listen(443);

    window.expressServer.fileServer = fileServer;
    window.expressServer.router = router;
    window.express = express;
  }

  exports.fileServer = window.expressServer.fileServer;
  exports.router = window.expressServer.router;
  exports.express = window.expressServer.express;
  exports.httpServer = window.expressServer.httpServer;
  //exports.httpsServer = window.expressServer.httpsServer;
  exports.sessionParser = window.expressServer.sessionParser;

});
