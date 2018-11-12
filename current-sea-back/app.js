const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 4000;

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'BTC' }));

require('./authentication/passport.js');

app.use(express.static(path.join(__dirname, '/static/'))); // Serve static files from static folder

const userAccountRouter = require('./routes/userAccountRoutes.js')();
const bkAccountRouter = require('./routes/bkAccountRoutes.js')();
const transactionsRouter = require('./routes/transactionsRoutes.js')();
const eventRouter = require('./routes/eventRoutes.js')();
const statementRouter = require('./routes/statementRoutes.js')();
const favCurRouter = require('./routes/favCurRoutes.js')();

app.use('/accounts', userAccountRouter);
app.use('/bookkeeping', bkAccountRouter);
app.use('/transactions', transactionsRouter);
app.use('/event', eventRouter);
app.use('/statement', statementRouter);
app.use('/currencies', favCurRouter);

app.get('/', (req, res) => {
  res.send('Test message');
});


app.listen(port, () => {
  debug(`Listening on port ${chalk.green(port)}`);
});
