(function () {

var company = 'heroicVentures',
    module = 'validation',
    directive = 'hValidator';

angular.module(company + '.' + module, [])
.directive(directive,
            [
function () {
    
    ////////////
    // Directive
    ////////////

    var directive = {
        restrict: 'AE',
        link: link,
        scope: {}
    };

    function link(scope, element, attrs) {

    }

    return directive;
}]);

})()