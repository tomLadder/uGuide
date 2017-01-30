var fs = require('fs');
var path = require('path');
var officegen = require('officegen');

exports.generateUserDocument = function(users, callback) {
    var docx = officegen ( {
        type: 'docx',
        orientation: 'portrait'
    } );

    docx.on ( 'error', function ( err ) {
			callback(err);
            return;
    });

    var pObj = docx.createP ();
    var table = [
        [{
            val: "Username",
            opts: {
                b:true,
                sz: '30',
                shd: {
                    fill: "7F7F7F",
                    themeFill: "text1",
                    "themeFillTint": "80"
                },
                fontFamily: "Arial"
            }
        },{
            val: "Password",
            opts: {
                b:true,
                sz: '30',
                shd: {
                    fill: "7F7F7F",
                    themeFill: "text1",
                    "themeFillTint": "80"
                },
                fontFamily: "Arial"
            }
        }]
    ];

    table = table.concat(users);

    var tableStyle = {
        tableColWidth: 4261,
        tableSize: 24,
        tableColor: "ada",
        tableAlign: "left",
        tableFontFamily: "Arial"
    }

    docx.createTable(table, tableStyle);

    return docx;
}

exports.generateStatsDocument = function(stats, callback) {
    var xlsx = officegen ( 'xlsx' );

    xlsx.on ( 'error', function ( err ) {
			callback(err);
            return;
    });

    generateBasicStats(xlsx, stats.BasicStats);
    generateFeedbackStats(xlsx, stats.FeedbackStats);
    generateVisitorStats(xlsx, stats.VisitorStats);

    return xlsx;
}

function generateBasicStats(xlsx, basicStats) {
    var sheet = xlsx.makeNewSheet ();
    sheet.name = 'Basic Stats';

    sheet.data[0] = [];
    sheet.data[0][0] = 'Total';
    sheet.data[0][1] = basicStats.Total;

    sheet.data[1] = [];
    sheet.data[1][0] = 'Male';
    sheet.data[1][1] = basicStats.Male;

    sheet.data[2] = [];
    sheet.data[2][0] = 'Female';
    sheet.data[2][1] = basicStats.Female;

    sheet.data[3] = [];
    sheet.data[3][0] = 'MalePercent';
    sheet.data[3][1] = basicStats.MalePercent;

    sheet.data[4] = [];
    sheet.data[4][0] = 'FemalePercent';
    sheet.data[4][1] = basicStats.FemalePercent;

    sheet.data[5] = [];
    sheet.data[5][0] = 'AvgTourDuration';
    sheet.data[5][1] = basicStats.AvgTourDuration;

    sheet.data[6] = [];
    sheet.data[6][0] = 'FinishedTours';
    sheet.data[6][1] = basicStats.FinishedTours;

    sheet.data[2] = [];
    sheet.data[2][0] = 'Total';
    sheet.data[2][1] = basicStats.Female;
}

function generateFeedbackStats(xlsx, feedbackStats) {
    var sheet = xlsx.makeNewSheet ();
    sheet.name = 'Feedback Stats';

    sheet.data[0] = [];
    sheet.data[0][0] = 'Total';
    sheet.data[0][1] = feedbackStats.Total;

    sheet.data[1] = [];
    sheet.data[1][0] = 'Positive';
    sheet.data[1][1] = feedbackStats.Positive;

    sheet.data[2] = [];
    sheet.data[2][0] = 'Negative';
    sheet.data[2][1] = feedbackStats.Negative;

    sheet.data[3] = [];
    sheet.data[3][0] = 'PositivePercent';
    sheet.data[3][1] = feedbackStats.PositivePercent;

    sheet.data[4] = [];
    sheet.data[4][0] = 'NegativePercent';
    sheet.data[4][1] = feedbackStats.NegativePercent;

    sheet.data[8] = [];
    sheet.data[8][0] = 'PositiveFeedbacks';
    
    for(var i=0;i<feedbackStats.PositiveFeedbacks.length;i++) {
        sheet.data[i+9] = [];
        sheet.data[i+9][0] = feedbackStats.PositiveFeedbacks[i];
    }

    sheet.data[8][1] = 'NegativeFeedbacks';
    for(var i=0;i<feedbackStats.NegativeFeedbacks.length;i++) {
        if(sheet.data[i+9] == undefined)
            sheet.data[i+9] = [];

        sheet.data[i+9][1] = feedbackStats.NegativeFeedbacks[i];
    }
}

function generateVisitorStats(xlsx, visitorStats) {
    var sheet = xlsx.makeNewSheet ();
    sheet.name = 'Visitor Stats';

    sheet.data[0] = [];
    sheet.data[0][0] = 'ZipCode';
    sheet.data[0][1] = 'Count';

    for(var i=0;i<visitorStats.length;i++) {
        sheet.data[i+2] = [];
        sheet.data[i+2][0] = visitorStats[i]._id;
        sheet.data[i+2][1] = visitorStats[i].count;
    }
}