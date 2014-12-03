(function () {

    var COMPANY = 'heroicVentures',
        MODULE = '.validation',
        DIRECTIVE = 'hValidator';

    angular.module(COMPANY + MODULE, [])
    .directive(DIRECTIVE,
             [
    function () {

        ////////////
        // Consts
        ////////////

        var EVENT_OPTIONS = Object.freeze({
            DEFAULT_EVENT: 'blur',
            MANUAL_EVENT: 'manual',
            NAMESPACE: '.' + DIRECTIVE
        });

        var ELEMENTS = Object.freeze(['input', 'textarea', 'select']);

        ////////////
        // Directive
        ////////////

        var directive = {
            restrict: 'AE',
            link: link,
            scope: {
                hValidateOn: '=?',
                hOptions: '=?',
                hControl: '@' + DIRECTIVE
            }
        };

        function link(scope, element, attrs) {

            if (scope.hControl.length !== 0) {
                scope.$parent[hControl] = this;
            }
            
            scope.$watch('hValidateOn', watchHValidateOn);
            scope.$watch('hOptions', watchHOptions);            

            /////////////////
            // Functions
            /////////////////

            /////////////////
            // Scope Watchers
            /////////////////

            function watchHValidateOn(newVal) {
                if (newVal == null) {
                    scope.hValidateOn = EVENT_OPTIONS.DEFAULT_EVENT;
                } else {

                    // Remove previous bindings, if any
                    element.off(EVENT_OPTIONS.NAMESPACE);

                    // Wire up auto-validation if anything other than manual validation is asked for
                    if (newVal !== EVENT_OPTIONS.MANUAL_EVENT) {
                        element.on(
                            scope.hValidateOn + EVENT_OPTIONS.NAMESPACE,
                            ELEMENTS.join(','),
                            onAutoValidateEvent);
                    }
                }
            }

            function watchHOptions(newVal, oldVal) {

            }

            ////////////////
            // Events
            ////////////////

            function onAutoValidateEvent(element, options) {
                console.dir(element);
            }
        }

        return directive;
    }]);

})()