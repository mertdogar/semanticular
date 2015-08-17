angular.module('semanticular.dropdown').directive('dropdown', ['$timeout', function($timeout) {
    /**
     * Template of directive.
     * @type {String}
     */
    var template =
        '<div class="ui selection dropdown">' +
            '<input type="hidden" name="">' +
            '<i class="dropdown icon"></i>' +
            '<div class="default text">{{placeholder}}</div>' +
            '<div class="menu">' +
                '<div class="item" ng-repeat="item in items" ' +
                    'data-value="{{item.value}}">{{item.title}}</div>' +
            '</div>' +
            '<div ng-transclude style="display: none;"></div>' +
        '</div>';


    /**
     * Default options.
     * @type {Object}
     */
    var defaults = {
        placeholder: '',
        allowSearch: false,
        allowMultipleSelection: false,
        allowAdditions: false,
        maxSelections: false,
        fullTextSearch: false,
        transition: 'auto',
        duration: 200,
        apiSettings: false,
        saveRemoteData: true,
        showOnFocus: true,
        extraClasses: [],
        message: {},
        onChange: function() {},
        onNoResults: function() {},
        onShow: function() {},
        onHide: function() {},
    };


    /**
     * Linker function.
     */
    var link = function(scope, $element, attrs, ngModel) {
        $element = $($element[0]);
        var options = $.extend(true, {}, defaults, scope.options || {});

        if (options.allowSearch)
            options.extraClasses.push('search');

        if (options.allowMultipleSelection)
            options.extraClasses.push('multiple');

        // Expose some options to view
        scope.placeholder = attrs.placeholder || options.placeholder;

        // Listen ng-model's value
        var modelListener = scope.$watch(function() {
            return ngModel.$modelValue;
        }, function(val) {
            $timeout(function() {
                $element.dropdown('set selected', ngModel.$modelValue);
            });
        });

        // Initalize dropdown
        $timeout(function() {
            $element
                .addClass(options.extraClasses.join(' '))
                .dropdown({
                    allowAdditions: options.allowAdditions,
                    maxSelections: options.maxSelections,
                    fullTextSearch: options.fullTextSearch,
                    transition: options.transition,
                    duration: options.duration,
                    apiSettings: options.apiSettings,
                    saveRemoteData: options.saveRemoteData,
                    showOnFocus: options.showOnFocus,
                    message: options.message,
                    onChange: function(val) {
                        if (options.allowMultipleSelection)
                            val = val ? val.split(',') : [];

                        ngModel.$setViewValue(val);
                        options.onChange(val);
                        scope.$apply();
                    },
                    onNoResults: function(val) {
                        options.onNoResults(val);
                        scope.$apply();
                    },
                    onShow: function() {
                        options.onShow();
                        scope.$apply();
                    },
                    onHide: function() {
                        options.onShow();
                        scope.$apply();
                    },
                });
        });

        // Clear model listener on destroy
        scope.$on('$destroy', function() {
            modelListener();
        });
    };


    return {
        restrict: 'E',
        scope: {
            options: '=',
            control: '=?'
        },
        template: template,
        transclude: true,
        require: 'ngModel',
        replace: true,
        controller: 'DropdownController',
        link: link
    };
}]);
