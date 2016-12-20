var mongoose            = require('mongoose');
var Station             = require('../Models/Station');
var Tdot                = require('../Models/Tdot');
var User                = require('../Models/User');
var Notification        = require('../Models/Notification');
var Visitor             = require('../Models/Visitor')
var PredefinedAnswer    = require('../Models/PredefinedAnswer');

var GenderType          = require('../Models/GenderType');
var UserType            = require('../Models/UserType');

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
                IsCurrent: false 
            },
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000001'), 
                Year: 2016, 
                IsCurrent: true 
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
                _id: mongoose.Types.ObjectId('000000000000000000000000'), 
                Name: 'U1_Station_2015', 
                Grade:1, 
                Subject:'POS',
                Description:'blablabla', 
                User: mongoose.Types.ObjectId('000000000000000000000001'), 
                Tdot: mongoose.Types.ObjectId('000000000000000000000000'), 
                Position:'142' 
            },
            {   
                _id: mongoose.Types.ObjectId('000000000000000000000001'), 
                Name: 'U1_Station_2016_1', 
                Grade:1, 
                Subject:'POS',
                Description:'blablabla', 
                User: mongoose.Types.ObjectId('000000000000000000000001'), 
                Tdot: mongoose.Types.ObjectId('000000000000000000000001'), 
                Position:'141' 
            },
            {  
                _id: mongoose.Types.ObjectId('000000000000000000000002'), 
                Name: 'U1_Station_2016_2', 
                Grade:5, 
                Subject:'SYP',
                Description:'blablabla', 
                User: mongoose.Types.ObjectId('000000000000000000000001'), 
                Tdot: mongoose.Types.ObjectId('000000000000000000000001'), 
                Position:'141' 
            }  ,  
            {   
                _id: mongoose.Types.ObjectId('000000000000000000000003'), 
                Name: 'U2_Station_2015', 
                Grade:1, 
                Subject:'POS',
                Description:'blablabla', 
                User: mongoose.Types.ObjectId('000000000000000000000003'), 
                Tdot: mongoose.Types.ObjectId('000000000000000000000000'), 
                Position:'142' 
            },
            {   
                _id: mongoose.Types.ObjectId('000000000000000000000004'), 
                Name: 'U2_Station_2016_1', 
                Grade:1, 
                Subject:'POS',
                Description:'blablabla', 
                User: mongoose.Types.ObjectId('000000000000000000000003'), 
                Tdot: mongoose.Types.ObjectId('000000000000000000000001'), 
                Position:'141' 
            },
            {  
                _id: mongoose.Types.ObjectId('000000000000000000000005'), 
                Name: 'U2_Station_2016_2', 
                Grade:5, 
                Subject:'SYP',
                Description:'blablabla', 
                User: mongoose.Types.ObjectId('000000000000000000000003'), 
                Tdot: mongoose.Types.ObjectId('000000000000000000000001'), 
                Position:'141' 
            }   
        ];

        Station.collection.insert(objs, function(err, docs) {
            console.log('# Inserted ' + name);
        });
    });
}

function GenerateVisitors() {
    var name = 'visitors';

    console.log('###########################');
    console.log('# Generate ' + name);
    console.log('# Drop ' + name);
    Visitor.remove(function(err,removed) {
        var objs = 
        [
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000000'), 
                ZipCode: 9920,
                Gender: GenderType.MALE,
                Guide: mongoose.Types.ObjectId('000000000000000000000002'),
                IsFinished: false,
                Tdot: mongoose.Types.ObjectId('000000000000000000000001')
            }
        ];

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
                Answer: 'Alles ok :)'
            },
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000001'), 
                Answer: 'Warum gibt es diesen Tdot?'
            },
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000002'), 
                Answer: 'Freue mich schon auf die Kohle'
            },
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000003'), 
                Answer: 'Programmieren ist geil'
            },
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000004'), 
                Answer: 'Gutes Essen!'
            },
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000005'), 
                Answer: 'Programmierwerkstatt war top!'
            },
            { 
                _id: mongoose.Types.ObjectId('000000000000000000000006'), 
                Answer: 'Thomas Leiter ist top!'
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
        /*var objs = 
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
        });*/
    });
}