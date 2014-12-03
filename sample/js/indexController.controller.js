angular.module('app')
.controller('indexController',
        ['$scope',
function ($scope) {
    'use strict';
    var vm = this;

    vm.testValidation = testValidation;
    vm.formElements = [];
    vm.addElement = addFormElement;
    
    $scope.$watchCollection('validator.errors', function (newVal) {        
        vm.errors = newVal;
    });

    $scope.$watch('validator.state', function (newVal) {
        vm.state = newVal;
    });
    

    ////////////
    // Functions
    ////////////

    function testValidation() {
        console.dir($scope.validator.validate());
    }

    function addFormElement() {
        vm.formElements.push({
            UID: 'id' + Math.floor(Math.random() * 10000000).toString()
        })
    }


}]);