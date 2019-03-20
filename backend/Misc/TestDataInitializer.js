var mongoose            = require('mongoose');
var Station             = require('../Models/Station');
var Tdot                = require('../Models/Tdot');
var User                = require('../Models/User');
var Notification        = require('../Models/Notification');
var Visitor             = require('../Models/Visitor')
var PredefinedAnswer    = require('../Models/PredefinedAnswer');

var GenderType          = require('../Models/GenderType');
var UserType            = require('../Models/UserType');


var zips = Object.freeze([
    "9920",
    "9900",
    "9632",
    "8010",
    "8020",
    "1100"
]);

exports.GenerateTestData = function() {
    GenerateTdots();
    GenerateUsers();
    GenerateStations();
    GenerateVisitors();
    GeneratePredefinedAnswer();
    GenerateNotifications();
}

function GenerateTdots() {
    var name = 'tdots';

    console.log('###########################');
    console.log('# Generate ' + name);
    console.log('# Drop ' + name);
    Tdot.remove(function(err,removed) {
        var objs = 
        [
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000000'), 
                Year: 2015, 
                IsCurrent: false,
                IsLocked: false
            },
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000001'), 
                Year: 2016, 
                IsCurrent: true,
                IsLocked: false
            }
        ];

        Tdot.collection.insert(objs, function(err, docs) {
            console.log('# Inserted ' + name);
        });
    });
}

function GenerateUsers() {
    var name = 'users';

    console.log('###########################');
    console.log('# Generate ' + name);
    console.log('# Drop ' + name);
    User.remove(function(err,removed) {
        var objs = 
        [
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000000'), 
                Username: 'admin', 
                Type: UserType.ADMIN, 
                Password: 'admin' 
            },
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000001'), 
                Username: 'station', 
                Type: UserType.STATION, 
                Password: 'station' 
            },
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000002'), 
                Username: 'guide', 
                Type: UserType.GUIDE, 
                Password: 'guide' 
            },
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000003'), 
                Username: 'station2', 
                Type: UserType.STATION, 
                Password: 'station2' 
            }
        ];

        User.collection.insert(objs, function(err, docs) {
            console.log('# Inserted ' + name);
        });
    });
}

function GenerateStations() {
    var name = 'stations';

    console.log('###########################');
    console.log('# Generate ' + name);
    console.log('# Drop ' + name);
    Station.remove(function(err,removed) {
        var objs = 
        [
            {   
                _id: mongoose.Types.ObjectId('000000000000000000000001'), 
                Name: 'Programmierwerkstatt', 
                Grade:1, 
                Subject:'POS',
                Description:'Beschreibung der Programmierwerkstatt', 
                User: mongoose.Types.ObjectId('000000000000000000000001'), 
                Tdot: mongoose.Types.ObjectId('000000000000000000000001'), 
            },
            {  
                _id: mongoose.Types.ObjectId('000000000000000000000002'), 
                Name: 'Diplomarbeiten', 
                Grade:5, 
                Subject:'Other',
                Description:'Beschreibung der Diplomarbeiten', 
                User: mongoose.Types.ObjectId('000000000000000000000001'), 
                Tdot: mongoose.Types.ObjectId('000000000000000000000001'), 
            }  ,  
            {   
                _id: mongoose.Types.ObjectId('000000000000000000000003'), 
                Name: 'Wirtschaftsstand', 
                Grade:3, 
                Subject:'BWN',
                Description:'Beschreibung des Wirtschaftsstandes', 
                User: mongoose.Types.ObjectId('000000000000000000000003'), 
                Tdot: mongoose.Types.ObjectId('000000000000000000000000'), 
            },
            {   
                _id: mongoose.Types.ObjectId('000000000000000000000004'), 
                Name: 'BSD - Projekte', 
                Grade:1, 
                Subject:'POS',
                Description:'Projekte werden von den Erstellern vorgestellt.', 
                User: mongoose.Types.ObjectId('000000000000000000000003'), 
                Tdot: mongoose.Types.ObjectId('000000000000000000000001'), 
            },
            {  
                _id: mongoose.Types.ObjectId('000000000000000000000005'), 
                Name: 'Info-Stand', 
                Grade:5, 
                Subject:'SYP',
                Description:'Allgemeine Informationen über die Abteilung. (Jobaussichten, Gehalt etc.)', 
                User: mongoose.Types.ObjectId('000000000000000000000003'), 
                Tdot: mongoose.Types.ObjectId('000000000000000000000001'), 
                Position:'100' 
            }   
        ];

        Station.collection.insert(objs, function(err, docs) {
            console.log('# Inserted ' + name);
        });
    });
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

function GenerateVisitors() {
    var name = 'visitors';

    console.log('###########################');
    console.log('# Generate ' + name);
    console.log('# Drop ' + name);
    Visitor.remove(function(err,removed) {
        var objs = [];

        for(var i=0;i<100;i++) {
            objs.push(            { 
                _id: mongoose.Types.ObjectId('000000000000000000000' + pad(i, 3).toString()), 
                ZipCode:  zips[getRandomArbitrary(0, zips.length -1)],
                Gender: getRandomArbitrary(1, 3) == 1 ? GenderType.FEMALE : GenderType.MALE,
                Guide: mongoose.Types.ObjectId('000000000000000000000002'),
                IsFinished: false,
                Tdot: mongoose.Types.ObjectId('000000000000000000000001')
            });
        }

        Visitor.collection.insert(objs, function(err, docs) {
            console.log('# Inserted ' + name);
        });
    });
}

function GeneratePredefinedAnswer() {
    var name='predefinedanswers';

    console.log('###########################');
    console.log('# Generate ' + name);
    console.log('# Drop ' + name);
    PredefinedAnswer.remove(function(err,removed) {
        var objs = 
        [
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000000'), 
                Answer: 'Führung zu kurz'
            },
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000001'), 
                Answer: 'Führung zu lang'
            },
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000002'), 
                Answer: 'Führungsdauer genau richtig'
            },
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000003'), 
                Answer: 'Führung verständlich'
            },
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000003'), 
                Answer: 'Führung unverständlich'
            }
        ];

        PredefinedAnswer.collection.insert(objs, function(err, docs) {
            console.log('# Inserted ' + name);
        });
    });
}

function GenerateNotifications() {
    var name='notifications';

    console.log('###########################');
    console.log('# Generate ' + name);
    console.log('# Drop ' + name);
    Notification.remove(function(err,removed) {
        var objs = 
        [
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000000'), 
                Visitor: mongoose.Types.ObjectId('000000000000000000000000'),
                Station: mongoose.Types.ObjectId('000000000000000000000001'),
                Time: new Date(2016, 11, 12, 13, 0, 0, 0)
            },
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000001'), 
                Visitor: mongoose.Types.ObjectId('000000000000000000000000'),
                Station: mongoose.Types.ObjectId('000000000000000000000004'),
                Time: new Date(2016, 11, 12, 14, 0, 0, 0)
            },
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000002'), 
                Visitor: mongoose.Types.ObjectId('000000000000000000000000'),
                Station: mongoose.Types.ObjectId('000000000000000000000005'),
                Time: new Date(2016, 11, 12, 14, 32, 20, 0)
            }
        ];

        Notification.collection.insert(objs, function(err, docs) {
            console.log('# Inserted ' + name);
        });
    });
}