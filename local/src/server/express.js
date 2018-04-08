if (!window) var window = global;

var obtains = [
  'express',
  'body-parser',
  'fs',
  'express-fileupload',
  'express-session',
  'https',
  'http',
];

obtain(obtains, (express, bodyParser, fs, fileUpload, session, https, http)=> {
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

    var fileServer = express();
    var router = express.Router();

    router.use(bodyParser.json());
    router.use(fileUpload());

    fileServer.use(window.expressServer.sessionParser);

    fileServer.set('view engine', 'pug');

    fileServer.use('', express.static('./client'));
    fileServer.use('/common', express.static('./common'));

    fileServer.use(router);

    //window.expressServer.httpServer = http.createServer(fileServer).listen(80);
    var httpApp = fileServer;

    if (muse.useSSL) {
      const options = {
        cert: fs.readFileSync(`${global.tld}/sslcert/fullchain.pem`),
        key: fs.readFileSync(`${global.tld}/sslcert/privkey.pem`),
      };

      window.expressServer.httpsServer = https.createServer(options, fileServer).listen(443);

      window.expressServer.httpServer.get('*', function (req, res) {
        res.redirect('https://' + req.headers.host + req.url);
      });

      httpApp = function (req, res) {
        res.redirect('https://' + req.headers.host + req.url);
      };

    } else window.expressServer.httpsServer = {};

    window.expressServer.httpServer = http.createServer(httpApp).listen(80);

    window.expressServer.fileServer = fileServer;
    window.expressServer.router = router;
    window.express = express;
  }

  exports.fileServer = window.expressServer.fileServer;
  exports.router = window.expressServer.router;
  exports.express = window.expressServer.express;
  exports.httpServer = window.expressServer.httpServer;
  exports.httpsServer = window.expressServer.httpsServer;
  exports.sessionParser = window.expressServer.sessionParser;

});
