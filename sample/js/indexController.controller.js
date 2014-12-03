angular.module('app')
.controller('indexController',
        ['$scope',
function ($scope) {
    'use strict';
    var vm = this;

    vm.testValidation = testValidation;
    
    

    ////////////
    // Functions
    ////////////

    function testValidation() {
        console.dir($scope.validator.validate());
    }


}]);