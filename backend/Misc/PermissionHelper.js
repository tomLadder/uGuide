var UserType        = require('../Models/UserType');
var Permission      = require('./Permission');

exports.getPermissions = function(userType) {
    var permissions = [];

    if(userType == UserType.ADMIN) {
        permissions = [
            /* TDOT */
            Permission.PERMISSION_TDOT_GET,
            Permission.PERMISSION_TDOT_POST,
            Permission.PERMISSION_TDOT_ID_GET,
            Permission.PERMISSION_TDOT_ID_PUT,
            Permission.PERMISSION_TDOT_ID_DELETE,
            Permission.PERMISSION_TDOT_CURRENT_GET,
            Permission.PERMISSION_TDOT_CURRENT_ID_POST,
            Permission.PERMISSION_TDOT_POSSIBLE_GET,
            Permission.PERMISSION_TDOT_LOCK_POST,
            Permission.PERMISSION_TDOT_UNLOCK_POST,

            /* User */
            Permission.PERMISSION_USER_GET,
            Permission.PERMISSION_USER_POST,
            Permission.PERMISSION_USER_ID_GET,
            Permission.PERMISSION_USER_ID_PUT,
            Permission.PERMISSION_USER_ID_DELETE,
            Permission.PERMISSION_USER_MULTIPLE_POST,
            Permission.PERMISSION_USER_MULTIPLE_DELETE,
            Permission.PERMISSION_USER_EXPORT_POST,

            /* Station */
            Permission.PERMISSION_STATION_QR_GET,
            Permission.PERMISSION_STATION_QR_ID_GET,
            Permission.PERMISSION_STATION_CURRENT_POSITIONPLAN,
            Permission.PERMISSION_STATION_CURRENT_GET,
            Permission.PERMISSION_STATION_ID_GET,
            Permission.PERMISSION_STATION_ID_PUT,
            Permission.PERMISSION_STATION_ID_DELETE,
            Permission.PERMISSION_STATION_GET,
            Permission.PERMISSION_STATION_CURRENT_QR_GET,

            /* Notification */
            Permission.PERMISSION_NOTIFICATION_GET,

            /* Visitor */
            Permission.PERMISSION_VISITOR_ID_GET,
            Permission.PERMISSION_VISITOR_ID_PUT,
            Permission.PERMISSION_VISITOR_ID_DELETE,
            Permission.PERMISSION_VISITOR_GET,
            Permission.PERMISSION_VISITOR_POST,

            /* Statistic */
            Permission.PERMISSION_STATISTIC_YEAR_GET,
            Permission.PERMISSION_STATISTIC_EXPORT_YEAR_GET
        ];
    } else if(userType == UserType.GUIDE) {
        permissions = [
            /* Station */
            Permission.PERMISSION_STATION_ID_GET,
            Permission.PERMISSION_STATION_GET,

            /* Notification */
            Permission.PERMISSION_NOTIFICATION_POST,

            /* Visitor */
            Permission.PERMISSION_VISITOR_POST,
            Permission.PERMISSION_VISITOR_FEEDBACK_POST,
            Permission.PERMISSION_VISITOR_CANCEL_POST,
            Permission.PERMISSION_VISITOR_TODO_GET,
            Permission.PERMISSION_VISITOR_DONE_GET,

            /* Answer */
            Permission.PERMISSION_ANSWER_GET,

            /* User */
            Permission.PERMISSION_USER_TOUR_GET,

            /* Offline */
            Permission.PERMISSION_OFFLINEPACKETS_POST
        ];
    } else if(userType == UserType.STATION) {
        permissions = [
            /* Station */
            Permission.PERMISSION_STATION_QR_GET,
            Permission.PERMISSION_STATION_QR_ID_GET,
            Permission.PERMISSION_STATION_CURRENT_GET,
            Permission.PERMISSION_STATION_ID_GET,
            Permission.PERMISSION_STATION_ID_PUT,
            Permission.PERMISSION_STATION_ID_DELETE,
            Permission.PERMISSION_STATION_GET,
            Permission.PERMISSION_STATION_POST,
            Permission.PERMISSION_STATION_CURRENT_QR_GET
        ];
    }

    return permissions;
}