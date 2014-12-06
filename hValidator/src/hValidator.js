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

        var NOVALIDATE = 'novalidate',
            FORM = 'form';

        var VALIDITY_STATES = Object.freeze({
            VALID: 'h-valid',
            INVALID: 'h-invalid'
        });

        var EVENT_OPTIONS = Object.freeze({
            MANUAL_EVENT: 'manual',
            NAMESPACE: '.' + DIRECTIVE
        });

        var DEFAULT_ELEMENT_BEHAVIOUR = Object.freeze([
            {
                selector: ['input', 'textarea'],
                event: 'blur'
            },
            {
                selector: ['select'],
                event: 'change'
            }
        ]);

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
                hElementEvents: '=?',
                hOptions: '=?',
                hControl: '@' + DIRECTIVE
            }
        };

        function link(scope, element, attrs) {

            var _findElementsMap;

            scope.validatorControl = {
                validate: validate,
                errors: [],
                state: function () { return scope.validatorControl.errors.length === 0 ? STATES.valid : STATES.invalid; }
            }

            init();

            /////////////////
            // Functions
            /////////////////

            function init() {
                if (element.is(FORM)) {
                    element.prop(NOVALIDATE, true);
                }                    

                if (scope.hControl.length !== 0) {
                    scope.$parent[scope.hControl] = scope.validatorControl;
                }

                wireupWatchers();
            }

            function wireupWatchers() {
                scope.$watch('hElementEvents', watchHElementEvents);
                scope.$watch('hOptions', watchHOptions);
            }

            /////////////////
            // Scope Watchers
            /////////////////

            function watchHElementEvents(newVal) {
                if (newVal == null) {
                    scope.hElementEvents = DEFAULT_ELEMENT_BEHAVIOUR;
                } else {

                    // Remove previous bindings, if any
                    element.off(EVENT_OPTIONS.NAMESPACE);

                    // Wire up auto-validation if anything other than manual validation is asked for
                    if (newVal !== EVENT_OPTIONS.MANUAL_EVENT && Array.isArray(newVal)) {
                        _findElementsMap = newVal.map(function (curElmOpt) {
                            if (curElmOpt.selector) {
                                return curElmOpt.selector;
                            } else {
                                throw new Error('h-element-events must be \'manual\' or an array of { element: [selectors], event: eventname. However, it appears to be malformed.');
                            }
                        })
                        .join(',');

                        newVal.forEach(function (curElmOpt) {
                            if (curElmOpt.selector && curElmOpt.event) {
                                if (!Array.isArray(curElmOpt.selector)) {
                                    curElmOpt.selector = [curElmOpt.selector];
                                }

                                element.on(
                                    curElmOpt.event + '.' + EVENT_OPTIONS.NAMESPACE,
                                    curElmOpt.selector.join(','),
                                    onAutoValidateEvent);
                            } else {
                                throw new Error('h-element-events must be \'manual\' or an array of { element: [selectors], event: eventnames)');
                            }
                        });
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
                var results = {};

                if (input != null) {
                    validateSingleElement(input);
                } else {
                    element.find(_findElementsMap).each(function (idx, curInput) {
                        validateSingleElement(curInput);
                    });
                }
            }

            ////////////////
            // Private
            ////////////////

            function removeInputsValidationErrors(input) {
                scope.validatorControl.errors =
                    scope.validatorControl.errors.filter(function (curError) {
                        return curError.input !== input;
                    });
            }

            function validateSingleElement(input) {
                var rules = scope.hOptions.rules,
                    validationErrors = [];

                removeInputsValidationErrors(input);

                if (rules) {
                    rules.forEach(function (curRule) {
                        if (!checkRule(angular.element(input), curRule)) {
                            validationErrors
                                .push(new ValidationError(input, curRule));
                        }
                    });
                }

                scope.validatorControl.errors = scope.validatorControl.errors.concat(validationErrors);
            }

            function checkRule(input, rule) {
                var validateFn = rule.validateFn;

                if (typeof validateFn === 'function') {
                    return validateFn(input);
                }
            }

            function ValidationError(input, rule) {
                this.input = input;
                this.message = rule.message(angular.element(input));
            }
        }

        return directive;
    }]);

})()