var express                 = require('express');
var bodyParser              = require('body-parser');
var mongoose                = require('mongoose');
var jwt                     = require('njwt');
var cors                    = require('cors');
var Challenge               = require('./Routes/Challenge');
var Auth                    = require('./Routes/Auth');
var Tdot                    = require('./Routes/Tdot');
var User                    = require('./Routes/User');
var Visitor                 = require('./Routes/Visitor');
var Station                 = require('./Routes/Station');
var Notification            = require('./Routes/Notification');
var Misc                    = require('./Routes/Misc');
var Answer                  = require('./Routes/PredefinedAnswer');
var Statistic               = require('./Routes/Statistic');
var OfflineSupport          = require('./Routes/OfflineSupport');
var TestDataInitializer     = require('./Misc/TestDataInitializer');
var UserType                = require('./Models/UserType');
var PermissionHelper        = require('./Misc/PermissionHelper');      
var app = express();

/* MongoDB */
var dbName = 'uGuideDB';

var connectionString = 'mongodb://localhost:27017/' + dbName;

mongoose.Promise = global.Promise;
mongoose.connect(connectionString)
  .then
  (
    () => {
      console.log('# Sucessfully connected to MongoDB');
      TestDataInitializer.GenerateTestData();
    }
  )
  .catch((err) => console.error(err));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors());

/*     Routes     */
app.use('/api', Misc);
app.use('/api', Challenge.router);
app.use('/api', Auth);

app.use('/api', Tdot);
app.use('/api', User);
app.use('/api', Visitor);
app.use('/api', Station);
app.use('/api', Notification);
app.use('/api', Answer);
app.use('/api', Statistic);
app.use('/api', OfflineSupport);

app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  res.send(err.message);
});

app.set('port', 8000);
var server = app.listen(app.get('port'), "0.0.0.0");
