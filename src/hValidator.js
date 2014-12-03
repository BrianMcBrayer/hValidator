(function () {

var company = 'heroicVentures',
    module = 'validation',
    directive = 'hValidator';

angular.module(company + '.' + module, [])
.directive(directive,
            [
function () {
    
    ////////////
    // Consts
    ////////////

    var EVENTS = 'blur',
        ELEMENTS = 'input textarea select';

    ////////////
    // Directive
    ////////////

    var directive = {
        restrict: 'AE',
        link: link,
        scope: {}
    };

    function link(scope, element, attrs) {
        
        element.on(EVENTS, ELEMENTS, onAutoValidateEvent);

    }

    function onAutoValidateEvent(element) {
        console.dir(element);
    }

    return directive;
}]);

})()