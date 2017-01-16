var ErrorManager            = require('../ErrorManager/ErrorManager');
var ErrorType               = require('../ErrorManager/ErrorTypes');
var Tdot                    = require('../Models/Tdot');
var Visitor                 = require('../Models/Visitor');
var GenderType              = require('../Models/GenderType');
var FeedbackType            = require('../Models/FeedbackType');
var User                    = require('../Models/User');
var express                 = require('express');
var moment                  = require('moment');
var router                  = express.Router();
var Permission              = require('../Misc/Permission');

var guard = require('../Guard.js')({
  requestProperty: 'token',
  permissionsProperty: 'permissions'
});

var validate = require('jsonschema').validate;

var offlinepacketSchema = {
  "type": "object",
  "properties": {
    "User": {
      "type": "object",
      "properties": {
        "_id": { "type": "string" }
      },
      "required": ["_id"]
    },
    "Visitor": {
      "type": "object",
      "properties": {
        "Zipcode": {"type": "integer"},
        "Gender": {"type": "integer"}
      },
      "required": ["ZipCode", "Gender"]
    },
    "Notifications": {
      "type":"array",
      "items": {
        "Type":"object",
        "properties": {
          "Time": {"type": "integer"},
          "Id": {"type": "string"}
        },
        "required": ["Time", "Id"]
      }
    },
    "Feedback": {
      "type":"object",
      "properties": {
        "FeedbackType": {"type":"integer"},
        "PredefinedAnswers": {
          "type":"array",
          "items": {"type":"string"}
        },
        "OptionalAnswer": {"type":"string"}
      },
      "required":["FeedbackType", "PredefinedAnswers"]
    },
    "Start": {"type":"integer"},
    "End": {"type":"integer"}
  },
  "required": ["User", "Visitor", "Notifications", "Feedback", "Start", "End"]
};

module.exports = router;

router.route('/offlinepackets')
.post(guard.check(Permission.PERMISSION_OFFLINEPACKETS_POST), function(req, res, next) {
  console.log('offlinepackets received');

  var offlinepackets = req.body;
  console.log(offlinepackets);
    Tdot.findOne({IsCurrent: true}, function(err, tdot) {
      if(err) {
        return next(ErrorManager.getAppropriateError(err));
      }


      if(offlinepackets && offlinepackets.length > 0) {
        for(var i=0;i<offlinepackets.length;i++) {
          if(isStructureValid(offlinepackets[i])) {

            (function (packet) {
              User.findOne({_id: packet.User._id}, function(err, user) {

                if(!err && user) {
                  var visitor = new Visitor(
                    {
                      ZipCode: packet.Visitor.ZipCode,
                      Gender: packet.Visitor.Gender,
                      Feedback: packet.Feedback,
                      Guide: packet.User._id,
                      Tdot: tdot._id,
                      Notifications: packet.Notifications,
                      Start: packet.Start,
                      End: packet.End
                    }
                  );

                  visitor.save(function(err) {
                    if(err) {
                      console.log('failed to save visitor ~ maybe hacker');
                      console.log(err);
                    }
                  });
                }
              });
            })(offlinepackets[i]);

          }
        }
      }

      res.send();
    });
});

function isStructureValid(offlinepacket) {
  console.log(validate(offlinepacket, offlinepacketSchema));
  return validate(offlinepacket, offlinepacketSchema).errors.length == 0;
}

/* Example json 
[{
	"User": {
		"_id": "000000000000000000000002"
	},
	"Visitor": {
		"ZipCode": 9856,
		"Gender": 2
	},
	"Notifications": [{
		"Time": 1484477311122,
		"Id": "RsGCqBdf7OSFtCLT6C6e"
	}, {
		"Time": 1484477316966,
		"Id": "G6Tv0M316bjZEKJ6bNGA"
	}],
	"Feedback": {
		"FeedbackType": 1,
		"PredefinedAnswers": ["000000000000000000000000", "000000000000000000000001", "000000000000000000000002", "000000000000000000000003"],
		"OptionalAnswer": "kkn"
	}
}, {
	"User": {
		"_id": "000000000000000000000002"
	},
	"Visitor": {
		"ZipCode": 9856,
		"Gender": 2
	},
	"Notifications": [{
		"Time": 1484477311122,
		"Id": "RsGCqBdf7OSFtCLT6C6e"
	}, {
		"Time": 1484477316966,
		"Id": "G6Tv0M316bjZEKJ6bNGA"
	}],
	"Feedback": {
		"FeedbackType": 1,
		"PredefinedAnswers": ["000000000000000000000000", "000000000000000000000001", "000000000000000000000002", "000000000000000000000003"],
		"OptionalAnswer": "kkn"
	}
}, {
	"User": {
		"_id": "000000000000000000000002"
	},
	"Visitor": {
		"ZipCode": 9856,
		"Gender": 2
	},
	"Notifications": [{
		"Time": 1484477311122,
		"Id": "RsGCqBdf7OSFtCLT6C6e"
	}, {
		"Time": 1484477316966,
		"Id": "G6Tv0M316bjZEKJ6bNGA"
	}],
	"Feedback": {
		"FeedbackType": 1,
		"PredefinedAnswers": ["000000000000000000000000", "000000000000000000000001", "000000000000000000000002", "000000000000000000000003"],
		"OptionalAnswer": "kkn"
	}
}]
*/