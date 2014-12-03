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

        var STATES = Object.freeze({
            valid: 'valid',
            invalid: 'invalid'
        });

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

            scope.validatorControl = {
                validate: validate,
                errors: [],
                state: STATES.valid
            }

            init();

            /////////////////
            // Functions
            /////////////////

            function init() {
                if (scope.hControl.length !== 0) {
                    scope.$parent[scope.hControl] = scope.validatorControl;
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
                scope.$apply(function () {
                    validate(evt.currentTarget);
                });                
            }

            ////////////////
            // API
            ////////////////

            function validate(input) {
                if (input != null) {
                    if (angular.isElement(input) && !(input instanceof angular.element)) {
                        input = angular.element(input);
                    }

                    var results = validateSingleElement(input);

                    scope.validatorControl.state = (results.validated ? STATES.valid : STATES.invalid);
                    scope.validatorControl.errors = results.validationErrors;
                } else {
                    var errors = [],
                        validated = true;

                    element.find(ELEMENTS).each(function (idx, curInput) {
                        var inputValidation = validateSingleElement(angular.element(curInput));

                        errors = errors.concat(inputValidation.validationErrors);

                        if (validated !== false) {
                            validated = inputValidation.validated;
                        }                        
                    });

                    scope.validatorControl.state = (validated ? STATES.valid : STATES.invalid);
                    scope.validatorControl.errors = errors;
                }

            }

            ////////////////
            // Private
            ////////////////

            function validateSingleElement(input) {
                var rules = scope.hOptions.rules,
                    validationErrors = [];

                if (rules) {
                    rules.forEach(function (curRule) {
                        if (!checkRule(input, curRule)) {
                            validationErrors
                                .push(new ValidationError(input, curRule));
                        }
                    });
                }

                return {
                    validated: validationErrors.length === 0,
                    validationErrors: validationErrors
                };
            }

            function checkRule(input, rule) {
                var validateFn = rule.validateFn;

                if (typeof validateFn === 'function') {
                    return validateFn(input);
                }
            }

            function ValidationError(input, rule) {
                this.input = input;
                this.message = rule.message(input);
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