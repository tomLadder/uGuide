var User            = require('../Models/User');
var UserType        = require('../Models/UserType');
var GenderType      = require('../Models/GenderType');
var Visitor         = require('../Models/Visitor');
var Feedback        = require('../Models/Feedback');
var FeedbackType    = require('../Models/FeedbackType');
var moment            = require('moment');

exports.getBasicStats = function(tdotid, resultCallback) {
    countVisitorMale(tdotid, function(male) {
        countVisitorFemale(tdotid, function(female) {
            var total = male + female;
            var femalepercent = (female / total) * 100;
            var malepercent = (male / total) * 100;
            getAvgTourDuration(tdotid, function(avgTourDuration) {
                var finishedTours = 477;
                countFinishedTours(tdotid, function(finishedTours) {
                    resultCallback(
                        {
                            Total: total, Male: male, Female: female, MalePercent: Math.round(malepercent, 2), FemalePercent: Math.round(femalepercent, 2), 
                            AvgTourDuration: avgTourDuration,
                            FinishedTours: finishedTours 
                        }
                    );
                });
            });
        });
    });
}

exports.getVisitorStats = function(tdotid, resultCallback) {
    getVisitors(tdotid, function(visitors) {
        resultCallback(visitors);
    });
}

exports.getFeedbackStats = function(tdotid, resultCallback) {
    countPositiveFeedback(tdotid,  function(positiveCount) {
        countNegativeFeedback(tdotid, function(negativeCount) {
            var totalCount = positiveCount + negativeCount;
            var positiveCountPercent = (positiveCount / totalCount) * 100;
            var negativeCountPercent = (negativeCount / totalCount) * 100;
            getPositiveFeedbacks(tdotid, function(positivFeedbacks) {
                getNegativeFeedbacks(tdotid, function(negativFeedbacks) {
                    resultCallback(
                        { 
                            Total: totalCount, Positive: positiveCount, Negative: negativeCount,
                            PositivePercent: Math.round(positiveCountPercent, 2),
                            NegativePercent: Math.round(negativeCountPercent, 2),
                            PositiveFeedbacks: positivFeedbacks,
                            NegativeFeedbacks: negativFeedbacks
                        }
                    );
                });
            });
        });
    });
}

function countVisitorMale(tdotid, resultCallback) {
    Visitor.count({Gender: GenderType.MALE, Tdot: tdotid}, function(err, count) {
        if(err || count == undefined) {
            resultCallback(0);
            return;
        }

        resultCallback(count);
    });
}

function countVisitorFemale(tdotid, resultCallback) {
    Visitor.count({Gender: GenderType.FEMALE, Tdot: tdotid}, function(err, count) {
        if(err || count == undefined) {
            resultCallback(0);
            return;
        }

        resultCallback(count);
    });
}

function countPositiveFeedback(tdotid, resultCallback) {
    Visitor.find({Tdot: tdotid}).populate('Feedback')
    .exec(function(err, visitors) {
        if(err || visitors == undefined) {
            resultCallback(0);
            return;
        }

        var count = 0;
        visitors.forEach(function(visitor) {
            if(visitor.Feedback != undefined) {
                if(visitor.Feedback.FeedbackType == FeedbackType.POSITIV) {
                    count++;
                }
            }
        });

        resultCallback(count);
    });
}

function countNegativeFeedback(tdotid, resultCallback) {
    Visitor.find({Tdot: tdotid}).populate('Feedback')
    .exec(function(err, visitors) {
        if(err || visitors == undefined) {
            resultCallback(0);
            return;
        }

        var count = 0;
        visitors.forEach(function(visitor) {
            if(visitor.Feedback != undefined) {
                if(visitor.Feedback.FeedbackType == FeedbackType.NEGATIV) {
                    count++;
                }
            }
        });

        resultCallback(count);
    });
}

function getPositiveFeedbacks(tdotid, resultCallback) {
    Visitor.find({Tdot: tdotid}).populate('Feedback')
    .exec(function(err, visitors) {
        if(err || visitors == undefined) {
            resultCallback([]);
            return;
        }

        var feedbacks = new Array();
        visitors.forEach(function(visitor) {
            if(visitor.Feedback != undefined) {
                if(visitor.Feedback.FeedbackType == FeedbackType.POSITIV) {
                    feedbacks.push({OptionalAnswer: visitor.Feedback.OptionalAnswer, PredefinedAnswers: visitor.Feedback.PredefinedAnswers });
                }
            }
        });

        resultCallback(feedbacks);
    });
}

function getNegativeFeedbacks(tdotid, resultCallback) {
    Visitor.find({Tdot: tdotid}).populate('Feedback')
    .exec(function(err, visitors) {
        if(err || visitors == undefined) {
            resultCallback([]);
            return;
        }

        var feedbacks = new Array();
        visitors.forEach(function(visitor) {
            if(visitor.Feedback != undefined) {
                if(visitor.Feedback.FeedbackType == FeedbackType.NEGATIV) {
                    feedbacks.push({OptionalAnswer: visitor.Feedback.OptionalAnswer, PredefinedAnswers: visitor.Feedback.PredefinedAnswers });
                }
            }
        });

        resultCallback(feedbacks);
    });
}

function getAvgTourDuration(tdotid, resultCallback) {
    Visitor.find({Tdot: tdotid, IsFinished: true}, function(err, visitors) {
        if(err || visitors == undefined || visitors.length == 0) {
            resultCallback(0);
            return;
        }

        var totalTime = 0;
        visitors.forEach(function(visitor) {
            var time1 = moment(visitor.Start);
            var time2 = moment(visitor.End);
            totalTime += (moment.duration(time2 - time1) / 1000);
        });

        resultCallback(totalTime / visitors.length);
    });
}

function countFinishedTours(tdotid, resultCallback) {
    Visitor.find({Tdot: tdotid, IsFinished: true}, function(err, visitors) {
        if(err || visitors == undefined) {
            resultCallback(0);
            return;
        }

        resultCallback(visitors.length);
    });
}

function getVisitors(tdotid, resultCallback) {
    Visitor.find({Tdot: tdotid, IsFinished: true}, function(err, visitors) {
        if(err || visitors == undefined) {
            resultCallback([]);
        }

        var res = new Array();
        visitors.forEach(function(visitor) {
            var start = moment(visitor.Start);
            var end = moment(visitor.End);
            var time = (moment.duration(end - start) / 1000);

            res.push({ZipCode: visitor.ZipCode, Gender: visitor.Gender, Duration: time});
        });

        resultCallback(res);
    });
}