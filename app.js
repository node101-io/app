const bodyParser = require('body-parser');
const cluster = require('cluster');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const express = require('express');
const favicon = require('serve-favicon');
const http = require('http');
const i18n = require('i18n');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');

const MongoStore = require('connect-mongo');

const numCPUs = process.env.WEB_CONCURRENCY || require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++)
    cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();
  const server = http.createServer(app);

  dotenv.config({ path: path.join(__dirname, '.env') });

  const PORT = process.env.PORT || 3000;
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/node101';

  const adminRouteController = require('./routes/adminRoute');
  const cryptistRouteController = require('./routes/cryptistRoute');
  const imageRouteController = require('./routes/imageRoute');
  const indexRouteController = require('./routes/indexRoute');
  const projectsRouteController = require('./routes/projectsRoute');

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  i18n.configure({
    locales:['tr', 'en', 'ru'],
    directory: __dirname + '/translations',
    queryParameter: 'lang',
    defaultLocale: 'en'
  });

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const sessionOptions = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGODB_URI
    })
  });

  app.use(cookieParser());
  app.use(i18n.init);
  app.use(sessionOptions);

  app.use((req, res, next) => {
    if (!req.query || typeof req.query != 'object')
      req.query = {};
    if (!req.body || typeof req.body != 'object')
      req.body = {};
    next();
  });

  app.use('/', indexRouteController);
  app.use('/cryptist', cryptistRouteController);
  app.use('/admin', adminRouteController);
  app.use('/image', imageRouteController);
  app.use('/projects', projectsRouteController);

  server.listen(PORT, () => {
    console.log(`Server is on port ${PORT} as Worker ${cluster.worker.id} running @ process ${cluster.worker.process.pid}`);
  });
}
