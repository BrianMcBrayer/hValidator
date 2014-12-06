(function () {

    var COMPANY = 'heroicVentures',
        MODULE = '.validation',
        DIRECTIVE = 'hValidator';

    angular.module(COMPANY + MODULE, [])
    .directive(DIRECTIVE,
             [
    function () {
        'use strict';

        ////////////
        // Consts
        ////////////

        var NOVALIDATE = 'novalidate',
            FORM = 'form',
            DEFAULT_MESSAGE_TEMPLATE = '<span id="{ID}" class="h-invalid-msg">{MSG}</span>';

        var TEMPLATE_MESSAGE_REPLACE = /\{MSG\}/;            

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

        var DEFAULT_OPTIONS = Object.freeze({
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
            ],
            errorMessageTemplate: DEFAULT_MESSAGE_TEMPLATE
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
                scope.$watchCollection('hOptions', watchHOptions);
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
                    scope.hAllOptions = angular.extend({}, DEFAULT_OPTIONS);
                } else {
                    scope.hAllOptions = angular.extend({}, DEFAULT_OPTIONS, scope.hOptions);
                }

                scope.hAllOptions.errorMessageTemplate =
                    (scope.hOptions && scope.hOptions.errorMessageTemplate ?
                        angular.element(scope.hOptions.errorMessageTemplate) :
                        angular.element(scope.hAllOptions.errorMessageTemplate));
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
                        if (curError.input === input) {
                            curError.destroy();

                            return false;
                        }

                        return true;
                    });
            }

            function validateSingleElement(input) {
                var rules = scope.hAllOptions.rules,
                    $input = (input instanceof angular.element ? input : angular.element(input)),
                    isValid = true;

                removeInputsValidationErrors(input);

                if (Array.isArray(rules)) {
                    isValid = rules.every(function (curRule) {
                        if (!checkRule($input, curRule)) {
                            var err = new ValidationError(input, curRule);

                            scope.validatorControl.errors.push(err);

                            return false;
                        }

                        return true;
                    });
                }

                $input.toggleClass(VALIDITY_STATES.VALID, isValid);
                $input.toggleClass(VALIDITY_STATES.INVALID, !isValid);

                return isValid;
            }

            function checkRule(input, rule) {
                var validateFn = rule.validateFn;

                if (typeof validateFn === 'function') {
                    return validateFn(input);
                }
            }

            function ValidationError(input, rule) {
                var MESSAGE_ID = '_error-msg';

                this.input = input;
                this.message = rule.message(angular.element(input));

                var $messageTemplate = scope.hAllOptions.errorMessageTemplate.clone(),
                    parsedHtml = $messageTemplate.html().replace(TEMPLATE_MESSAGE_REPLACE, this.message),
                    inputId = input.id;

                $messageTemplate
                    .attr('id', (inputId ? inputId + MESSAGE_ID : null))
                    .html(parsedHtml)
                    .insertAfter(input);

                this.$messageTemplate = $messageTemplate;

                this.relatedElements = (Array.isArray(rule.relatedElements) ? rule.relatedElements : []);

                this.destroy = function () {
                    this.$messageTemplate.remove();
                    this.$messageTemplate = null;

                    this.input = null;
                }
            }
        }

        return directive;
    }]);

})()