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

        var ELEMENTS = ['input', 'textarea', 'select'].join(',');

        var DEFAULT_VALIDATION = Object.freeze({
            rules: [
                {
                    name: 'required',
                    validateFn: function (input) {
                        var isValid = true;

                        if (input instanceof angular.element && input.prop('required')) {
                            var inputVal = input.val();

                            isValid = (inputVal && inputVal.length !== 0);
                        };

                        return isValid;
                    },
                    message: function (input) {
                        return (input.attr('name') || 'Control') + ' is required';
                    }
                }
            ]
        });

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

            var validatorControl = {
                validate: validate,
                errors: []
            }            

            init();

            /////////////////
            // Functions
            /////////////////

            function init() {
                if (scope.hControl.length !== 0) {
                    scope.$parent[scope.hControl] = validatorControl;
                }

                wireupWatchers();
            }

            function wireupWatchers() {
                scope.$watch('hValidateOn', watchHValidateOn);
                scope.$watch('hOptions', watchHOptions);
            }

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
                            ELEMENTS,
                            onAutoValidateEvent);
                    }
                }
            }

            function watchHOptions(newVal, oldVal) {
                if (newVal == null) {
                    scope.hOptions = angular.extend({}, DEFAULT_VALIDATION);
                }
            }

            ////////////////
            // Events
            ////////////////

            function onAutoValidateEvent(evt) {
                validate(angular.element(evt.currentTarget));
            }

            ////////////////
            // API
            ////////////////

            function validate(input) {
                if (input != null) {
                    validateSingleElement(input);
                } else {
                    // Validate all the things
                }
            }

            ////////////////
            // Private
            ////////////////

            function validateSingleElement(input) {
                var rules = scope.hOptions.rules,
                    hasErrors = false;

                if (rules) {
                    rules.forEach(function (curRule) {
                        // TODO rewrite to make this function return an array of failing rules... do logic off of that
                        hasErrors = updateValidationErrorForInputAndRule(input, curRule) || hasErrors;
                    });
                }

                return hasErrors;
            }

            function updateValidationErrorForInputAndRule(input, rule) {
                var validateFn = rule.validateFn,
                    errorUpdated = false;

                if (typeof validateFn === 'function') {
                    if (validateFn(input)) {
                        errorUpdated = removeAnyErrorOfInputAndRule(input, rule);
                    } else {
                        errorUpdated = true;
                        addErrorOfInputAndRule(input, rule);
                    }
                }

                return errorUpdated;
            }

            function removeAnyErrorOfInputAndRule(input, rule) {

            }

            function addErrorOfInputAndRule(input, rule) {
                validatorControl.errors.push(
                    {
                        input: input,
                        message: rule.message(input)
                    });
            }

        }

        return directive;
    }]);

})()