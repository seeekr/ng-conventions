angular.module('something')
    .directive('dir', function () {
        return {
            templateUrl: '',
            compile () {
            }
        }
    })
    .directive('dir2', function () {
        return {
            link() {
            }
        }
    })
