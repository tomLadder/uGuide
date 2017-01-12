var User            = require('../Models/User');
var UserType        = require('../Models/UserType');
var GenderType      = require('../Models/GenderType');
var Visitor         = require('../Models/Visitor');
var Fb        = require('../Models/Feedback');
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
            getPositiveOptionalFeedbacks(tdotid, function(positivFeedbacks) {
                getNegativeOptionalFeedbacks(tdotid, function(negativFeedbacks) {
                    getPredefinedFeedbacks(tdotid, function(predefinedFeedbacks) {
                        resultCallback(
                        { 
                            Total: totalCount, Positive: positiveCount, Negative: negativeCount,
                            PositivePercent: Math.round(positiveCountPercent, 2),
                            NegativePercent: Math.round(negativeCountPercent, 2),
                            PositiveFeedbacks: positivFeedbacks,
                            NegativeFeedbacks: negativFeedbacks,
                            PredefinedFeedbacks: predefinedFeedbacks
                        });
                    });
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

function getPositiveOptionalFeedbacks(tdotid, resultCallback) {
    Visitor.find({Tdot: tdotid}).populate('Feedback')
    .exec(function(err, visitors) {
        if(err || visitors == undefined) {
            resultCallback([]);
            return;
        }

        var feedbacks = new Array();
        visitors.forEach(function(visitor) {
            if(visitor.Feedback != undefined) {
                if(visitor.Feedback.FeedbackType == FeedbackType.POSITIV && visitor.Feedback.OptionalAnswer != undefined && visitor.Feedback.OptionalAnswer != "") {
                    feedbacks.push(visitor.Feedback.OptionalAnswer);
                }
            }
        });

        resultCallback(feedbacks);
    });
}

function getNegativeOptionalFeedbacks(tdotid, resultCallback) {
    Visitor.find({Tdot: tdotid}).populate('Feedback')
    .exec(function(err, visitors) {
        if(err || visitors == undefined) {
            resultCallback([]);
            return;
        }

        var feedbacks = new Array();
        visitors.forEach(function(visitor) {
            if(visitor.Feedback != undefined) {
                if(visitor.Feedback.FeedbackType == FeedbackType.NEGATIV && visitor.Feedback.OptionalAnswer != undefined && visitor.Feedback.OptionalAnswer != "") {
                    feedbacks.push(visitor.Feedback.OptionalAnswer);
                }
            }
        });

        resultCallback(feedbacks);
    });
}

function getPredefinedFeedbacks(tdotid, resultCallback) {
    resultCallback(
        [
            {Answer: 'alles war top', Quantity: 22},
            {Answer: 'thomas leiter ist top', Quantity: 25}
        ]);
    // Visitor.aggregate([
    //         // {
    //         //     $match: {
    //         //         Tdot: tdotid
    //         //     }
    //         // },
    //         {
    //             $lookup: {
    //                 from: "Fb",
    //                 localField: "Feedback",
    //                 foreignField:"_id",
    //                 as: "feedb"
    //             }
    //         }
    // ], function(err, res) {
    //     if(err || res == undefined) {
    //         resultCallback([]);
    //         return;
    //     }

    //     // Feedback.aggregate([
    //     //     {
    //     //         $group: {
    //     //             _id: '$asdf',
    //     //             count: {$sum: 1}
    //     //         },
    //     //         $in: {
    //     //             _id: visitors._id
    //     //         }
    //     //     }
    //     // ])
    //     // var feedbacks = new Array();
    //     // visitors.forEach(function(visitor) {
    //     //     if(visitor.Feedback != undefined) {
    //     //         if(visitor.Feedback.FeedbackType == FeedbackType.NEGATIV && visitor.Feedback.OptionalAnswer != undefined && visitor.Feedback.OptionalAnswer != "") {
    //     //             feedbacks.push(visitor.Feedback.OptionalAnswer);
    //     //         }
    //     //     }
    //     // });

    //     resultCallback(res);
    // });
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
    Visitor.aggregate([
            {
                $match: {
                    Tdot: tdotid
                }
            },
            {
                $group: {
                    _id: '$ZipCode',
                    count: {$sum: 1}
                }
            }
    ], function (err, visitors) {
        if(err || visitors == undefined) {
            resultCallback([]);
        }

        resultCallback(visitors);
    });
}