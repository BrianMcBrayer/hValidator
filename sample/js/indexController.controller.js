angular.module('app')
.controller('indexController',
        ['$scope',
function ($scope) {
    'use strict';
    var vm = this;

    vm.testValidation = testValidation;
    
    $scope.$watchCollection('validator.errors', function (newVal) {        
        vm.errors = newVal;
    });

    $scope.$watchCollection('validator.state', function (newVal) {
        vm.state = newVal;
    });
    

    ////////////
    // Functions
    ////////////

    function testValidation() {
        console.dir($scope.validator.validate());
    }


}]);