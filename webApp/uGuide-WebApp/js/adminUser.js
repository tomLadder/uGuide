(function () {
angular.module('adminUser', [])

.controller('adminUserCtrl', function ($rootScope, $scope, $timeout, userFactory, ViewConstant) {
    $scope.helper = {};
    $scope.selectedUser = {};
    $scope.users = [];

    $scope.exportUsers = {};
    $scope.exportUsersPlain = "";

    $scope.selectedUsers = [];

    $scope.masterCheck = false;

    $scope.alert = {};

    //alertTypes -> warning (yellow), danger (red), success (green)
    $scope.addAlert = function(alertType, title, msg) {
        $scope.alert.type = alertType;
        $scope.alert.show = true;
        $scope.alert.title = title;
        $scope.alert.message = msg;
    }

    $scope.resetAlert = function() {
        $scope.alert = {};
    }

    $scope.init = function() {
        $scope.jQueryInjection();

        $scope.helper.formMode = 'Add';
        $scope.loadUsers();
    }

    $scope.jQueryInjection = function() {
        $('modalId').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    }

    $scope.clearForm = function() {
        $scope.setSelectedUser({});
        $scope.helper.formMode = 'Add';
    }

    $scope.loadUsers = function() {
        userFactory.getUsers().then
        (
        function(successResponse) {
            $scope.users = successResponse.data;
            console.log('INFO -- Users loaded');
        },
        function(errorResponse) {
            console.log('ERROR -- ' + errorResponse.status + ' ' + errorResponse.data.message);
            $scope.addAlert('danger', errorResponse.data.code, 'Error occured while loading the users');
            $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
        }
        );
    }

    $scope.editUser = function(u) {
        $scope.helper.formMode = 'Edit';
        $scope.setSelectedUser(u);
    }

    $scope.setSelectedUser = function(u) {
        $scope.selectedUser = {
            _id : u._id, 
            Username : u.Username, 
            Password : u.Password, 
            Type : String(u.Type),
        };
    }

    $scope.deleteUser = function() {
        console.log("User zu löschen: " + $scope.selectedUser.Username);

        $scope.jQueryInjection();

        userFactory.deleteUser($scope.selectedUser._id).then
        (
            function(successResponse) {
                console.log('INFO -- Successfully deleted a user');
                $scope.loadUsers();
            },
            function(errorResponse) {
                console.log('ERROR -- ' + errorResponse.status + ' ' + errorResponse.data.message);
                $scope.addAlert('danger', errorResponse.data.code, 'Error occured while deleting a user');
                $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
            }
        );

        $scope.setSelectedUser({});
    }

    $scope.stopEditing = function() {
        if($scope.helper.formMode == 'Add') {
        userFactory.addUser($scope.selectedUser.Username, $scope.selectedUser.Type, $scope.selectedUser.Password).then
        (
            function(successResponse) {
                console.log('INFO -- Successfully added a user');
                $scope.loadUsers();
                $scope.setSelectedUser({});

                $scope.addAlert('success', 'INFO', 'Successfully added');
                $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
            },
            function(errorResponse) {
                console.log('ERROR -- ' + errorResponse.status + ' ' + errorResponse.data.message);
                $scope.addAlert('danger', errorResponse.data.code, 'Error occured while adding a user');
                $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
            }
        );
        }
        else {
        userFactory.updateUser($scope.selectedUser._id, $scope.selectedUser.Username, $scope.selectedUser.Type, $scope.selectedUser.Password).then
        (
            function(successResponse) {
            console.log('INFO -- Station updated');
            $scope.loadUsers();
            $scope.setSelectedUser({});

            $scope.addAlert('success', 'INFO', 'Successfully updated');
            $timeout($scope.resetAlert, ViewConstant.timeoutDuration);

            $scope.helper.formMode = 'Add';
            },
            function(errorResponse) {
            console.log('ERROR -- ' + errorResponse.status + ' ' + errorResponse.data.message);
            $scope.addAlert('danger', errorResponse.data.code, 'Error occured while updating the selected user');
            $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
            }
        );
        }
    }

    $scope.showTypeInfo = function() {
        $scope.addAlert('warning', 'Type Info', '1 (Admin) - 2 (Station) - 3 (Guide)');
    }

    $scope.removeTypeInfo = function() {
        $scope.resetAlert();
    }

    $scope.clearExportForm = function() {
        $scope.exportUsersPlain = "";
    }

    $scope.addMultiple = function() {
        var tempSplitArray = $scope.exportUsersPlain.split('\n');
        $scope.exportUsers.Users = tempSplitArray.map(function(x) {
            var retValue = {};
            retValue.User = x;
            return retValue;
        });

        userFactory.addMultipleUsers($scope.exportUsers).then
        (
            function(successResponse) {
                console.log('INFO -- Multiple users added');
                $scope.addAlert('success', 'INFO', 'Successfully added');
                $timeout($scope.resetAlert, ViewConstant.timeoutDuration);

                $scope.loadUsers();
            },
            function(errorResponse) {
                console.log('ERROR -- ' + errorResponse.status + ' ' + errorResponse.data.message);
                $scope.addAlert('danger', errorResponse.data.code, 'Error occured while adding multiple users');
                $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
            }
        );
    }

    $scope.querySelectedUsers = function() {
        var userSelection = $scope.users.filter(function(x) {
            return x.Checked;
        });

        $scope.selectedUsers = userSelection.map(function(x) {
            var retValue = {};
            retValue.id = x._id;
            return retValue;
        });
    }

    $scope.exportMultipleUsers = function() {
        $scope.querySelectedUsers();

        if($scope.selectedUsers.length != 0) {
            userFactory.exportMultipleUsers($scope.selectedUsers).then
            (
                function(successResponse) {
                    console.log('INFO -- Users exported');
                    $scope.addAlert('success', 'INFO', 'Successfully exported');
                    $timeout($scope.resetAlert, ViewConstant.timeoutDuration);

                    $scope.downloadExports(successResponse.data);
                },
                function(errorResponse) {
                    console.log('ERROR -- ' + errorResponse.status + ' ' + errorResponse.data.message);
                    $scope.addAlert('danger', errorResponse.data.code, 'Error occured while exporting multiple users');
                    $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
                }
            );
        }
        else {
            $scope.addAlert('danger', 'WARNING!', 'Please first select some users');
            $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
        }
    }

    $scope.deleteMultipleUsers = function() {
        $scope.querySelectedUsers();

        if($scope.selectedUsers.length != 0) {
            $scope.jQueryInjection();

            userFactory.deleteMultipleUsers($scope.selectedUsers).then
            (
                function(successResponse) {
                    console.log('INFO -- Users deleted');
                    $scope.addAlert('success', 'INFO', 'Successfully deleted');
                    $timeout($scope.resetAlert, ViewConstant.timeoutDuration);

                    $scope.loadUsers();
                },
                function(errorResponse) {
                    console.log('ERROR -- ' + errorResponse.status + ' ' + errorResponse.data.message);
                    $scope.addAlert('danger', errorResponse.data.code, 'Error occured while deleting multiple users');
                    $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
                }
            );
        }
        else {
            $scope.addAlert('danger', 'WARNING!', 'Please first select some users');
            $timeout($scope.resetAlert, ViewConstant.timeoutDuration);
        }
    }

    $scope.toggleCheckboxes = function() {
        var newCheckedValue = true;

        if($scope.masterCheck == false) {
            newCheckedValue = false;
        }

        $scope.users.forEach(function(x) {
            x.Checked = newCheckedValue;
        });
    }

    $scope.downloadExports = function(encodedData) {
        var blob = new Blob([encodedData], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
        saveAs(blob, 'usersExport.docx');
    }


});
})();