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