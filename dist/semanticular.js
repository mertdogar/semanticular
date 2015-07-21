angular.module('semanticular.dropdown', []);

angular.module('semanticular.dropdown').controller('DropdownController', ['$scope', function($scope) {
    $scope.items = [];


    /**
     * Adds item.
     * @param {string} text
     * @param {string} value
     */
    this.addItem = function(title, value) {
        $scope.items.push({
            title: title,
            value: value
        });
    };


    /**
     * Removes item.
     * @param {string} value
     */
    this.removeItem = function(value) {
        var index = -1;

        $scope.items.forEach(function(item, i) {
            if (item.value == value)
                index = i;
        });

        if (index > -1)
            $scope.items.splice(index, 1);
    };
}]);

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
                    message: options.message,
                    onChange: function(val) {
                        if (options.allowMultipleSelection)
                            val = val.split(',');

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
            options: '='
        },
        template: template,
        transclude: true,
        require: 'ngModel',
        replace: true,
        controller: 'DropdownController',
        link: link
    };
}]);

angular.module('semanticular.dropdown').directive('dropdownItem', function() {
    /**
     * Linker function.
     */
    var link = function(scope, $element, attrs, dropdownController) {
        var title = scope.title || $element[0].innerHTML,
            value = scope.value || attrs.value || title;

        // Add item
        dropdownController.addItem(title, value);

        // Listen destroy event and remove item
        scope.$on('$destroy', function() {
            dropdownController.removeItem(value);
        });
    };


    return {
        require: '^dropdown',
        restrict: 'E',
        scope: {
            value: '=',
            title: '='
        },
        link: link
    };
});

angular.module('semanticular.modal', []);

angular.module('semanticular.modal').directive('modal', [function() {
    /**
     * Template of directive.
     * @type {String}
     */
    var template = '<div class="ui modal" ng-transclude></div>';


    /**
     * Default options.
     * @type {Object}
     */
    var defaults = {
        extraClasses: [],
        closable: true,
        transition: 'scale',
        duration: 400,
        onShow: function() {},
        onHide: function() {},
        onApprove: function() {},
        onDeny: function() {}
    };


    /**
     * Linker function.
     */
    var link = function(scope, $element, attrs, ngModel) {
        $element = $($element[0]);
        var options = $.extend(true, {}, defaults, scope.options || {});

        // Listen ng-model's value
        var modelListener = scope.$watch(function() {
            return ngModel.$modelValue;
        }, function(val) {
            $element.modal(val ? 'show' : 'hide');
        });

        // Clear model listener on destroy
        scope.$on('$destroy', function() {
            modelListener();
        });

        $element
            .addClass(options.extraClasses.join(' '))
            .modal({
                closable: options.closable,
                transition: options.transition,
                duration: options.duration,
                onShow: function() {
                    options.onShow();
                },
                onHide: function() {
                    if (ngModel.$modelValue)
                        ngModel.$setViewValue(false);

                    options.onHide();
                },
                onApprove: function() {
                    options.onApprove();
                },
                onDeny: function() {
                    options.onDeny();
                }
            });
    };


    return {
        restrict: 'E',
        scope: {
            options: '='
        },
        template: template,
        transclude: true,
        require: 'ngModel',
        replace: true,
        link: link
    };
}]);

angular.module('semanticular.popup', []);

angular.module('semanticular.popup').directive('popup', [function() {
    /**
     * Default options.
     * @type {Object}
     */
    var defaults = {
        variation: '',
        content: '',
        title: '',
        html: '',
        on: 'hover',
        position: 'top left',
        inline: false,
        transition: 'slide down',
        duration: 200,
        setFluidWidth: true,
        hoverable: false,
        closable: true,
        hideOnScroll: 'auto',
        distanceAway: 0,
        offset: 0,
        onShow: function() {},
        onHide: function() {}
    };


    /**
     * Linker function.
     */
    var link = function(scope, $element, attrs) {
        var options = $.extend(true, {}, defaults, scope.popup || {});
        $element = $($element[0]);

        $element.popup({
            variation: options.variation,
            content: options.content,
            title: options.title,
            html: options.html,
            on: options.on,
            position: options.position,
            inline: options.inline,
            transition: options.transition,
            duration: options.duration,
            setFluidWidth: options.setFluidWidth,
            hoverable: options.hoverable,
            closable: options.closable,
            hideOnScroll: options.hideOnScroll,
            distanceAway: options.distanceAway,
            offset: options.offset,
            onShow: function() {
                options.onShow();
            },
            onHide: function() {
                options.onHide();
            }
        });
    };


    return {
        restrict: 'A',
        scope: {
            popup: '='
        },
        link: link
    };
}]);

angular.module('semanticular.checkbox', []);

angular.module('semanticular.checkbox').directive('checkbox', [function() {
    /**
     * Template of directive.
     * @type {String}
     */
    var template =
        '<div class="ui checkbox">' +
            '<input type="checkbox" tabindex="0" class="hidden">' +
            '<label ng-transclude></label>' +
        '</div>';


    /**
     * Default options.
     * @type {Object}
     */
    var defaults = {
        extraClasses: [],
        isDisabled: false,
        isReadOnly: false,
        style: 'standart' // slider, toggle,
    };


    /**
     * Linker function.
     */
    var link = function(scope, $element, attrs, ngModel) {
        $element = $($element[0]);
        var options = $.extend(true, {}, defaults, scope.options || {});

        // Listen ng-model's value
        var modelListener = scope.$watch(function() {
            return ngModel.$modelValue;
        }, function(val) {
            $element.checkbox(val ? 'set checked' : 'set unchecked');
        });

        // Handle extra classes
        if (options.style != 'standart')
            options.extraClasses.push(options.style);

        if (options.isDisabled)
            options.extraClasses.push('disabled');

        if (options.isReadOnly)
            options.extraClasses.push('read-only');

        // Clear model listener on destroy
        scope.$on('$destroy', function() {
            modelListener();
        });

        $element
            .addClass(options.extraClasses.join(' '))
            .checkbox({
                onChange: function() {
                    ngModel.$setViewValue($element.checkbox('is checked'));
                }
            });
    };


    return {
        restrict: 'E',
        scope: {
            options: '='
        },
        template: template,
        transclude: true,
        require: 'ngModel',
        replace: true,
        link: link
    };
}]);

angular.module('semanticular.radio', []);

angular.module('semanticular.radio').directive('radio', [function() {
    /**
     * Template of directive.
     * @type {String}
     */
    var template =
        '<div class="ui radio checkbox">' +
            '<input type="radio" tabindex="0" class="hidden">' +
            '<label ng-transclude></label>' +
        '</div>';


    /**
     * Default options.
     * @type {Object}
     */
    var defaults = {
        extraClasses: [],
        isDisabled: false,
        isReadOnly: false,
        style: 'standart' // slider, toggle,
    };


    /**
     * Linker function.
     */
    var link = function(scope, $element, attrs, ngModel) {
        $element = $($element[0]);

        var value = scope.value || attrs.value,
            options = $.extend(true, {}, defaults, scope.options || {});

        // Listen ng-model's value
        var modelListener = scope.$watch(function() {
            return ngModel.$modelValue;
        }, function(newValue) {
            $element.checkbox(newValue == value ? 'set checked' : 'set unchecked');
        });

        // Handle extra classes
        if (options.style != 'standart')
            options.extraClasses.push(options.style);

        if (options.isDisabled)
            options.extraClasses.push('disabled');

        if (options.isReadOnly)
            options.extraClasses.push('read-only');

        // Clear model listener on destroy
        scope.$on('$destroy', function() {
            modelListener();
        });

        $element
            .addClass(options.extraClasses.join(' '))
            .checkbox({
                onChange: function() {
                    ngModel.$setViewValue(value);
                }
            });
    };


    return {
        restrict: 'E',
        scope: {
            options: '=',
            value: '='
        },
        template: template,
        transclude: true,
        require: 'ngModel',
        replace: true,
        link: link
    };
}]);

angular.module('semanticular.progress', []);

angular.module('semanticular.progress').directive('progress', [function() {
    /**
     * Template of directive.
     * @type {String}
     */
    var template =
        '<div class="ui progress">' +
            '<div class="bar"></div>' +
            '<div class="label" ng-show="label" ng-bind="label"></div>' +
        '</div>';


    /**
     * Default options.
     * @type {Object}
     */
    var defaults = {
        label: '',
        extraClasses: []
    };


    /**
     * Linker function.
     */
    var link = function(scope, $element, attrs, ngModel) {
        $element = $($element[0]);
        var options = $.extend(true, {}, defaults, scope.options || {});
        scope.label = attrs.label || options.label;

        // Listen ng-model's value
        var modelListener = scope.$watch(function() {
            return ngModel.$modelValue;
        }, function(val) {
            $element.progress({
                percent: ngModel.$modelValue * 100
            });
        });

        // Clear model listener on destroy
        scope.$on('$destroy', function() {
            modelListener();
        });

        $element
            .addClass(options.extraClasses.join(' '))
            .checkbox();
    };


    return {
        restrict: 'E',
        scope: {
            options: '='
        },
        template: template,
        require: 'ngModel',
        replace: true,
        link: link
    };
}]);

angular.module('semanticular.tabs', []);

angular.module('semanticular.tabs').directive('tab', [function() {
    /**
     * Template of directive.
     * @type {String}
     */
    var template =
        '<div class="ui bottom attached tab segment" data-tab=""' +
            ' ng-transclude></div>';


    /**
     * Linker function.
     */
    var link = function(scope, $element, attrs, tabsetController) {
        $element = $($element[0]);
        var isActive = attrs.active != undefined,
            id = tabsetController.addTab(attrs.heading, isActive);

        if (isActive)
            $element.addClass('active');

        $element.attr('data-tab', id);

        // Listen destroy event and remove item
        scope.$on('$destroy', function() {
            tabsetController.removeTab(id);
        });
    };


    return {
        restrict: 'E',
        require: '^tabset',
        scope: {},
        template: template,
        transclude: true,
        replace: true,
        link: link
    };
}]);

angular.module('semanticular.tabs').controller('TabsetController', ['$scope', function($scope) {
    $scope.tabs = [];
    var index = 1,
        prefix = 'tab_' + Math.random().toString(36).substring(7);


    /**
     *
     * @param {string} heading
     * @param {boolean=} opt_isActive
     * @return {number}
     */
    this.addTab = function(heading, opt_isActive) {
        var tab = {
            heading: heading,
            id: prefix + '_' + index,
            isActive: !!opt_isActive
        };

        index++;
        $scope.tabs.push(tab);

        return tab.id;
    };


    /**
     *
     * @param {number} id
     */
    this.removeTab = function(id) {
        var index = -1;

        $scope.tabs.forEach(function(tab, i) {
            if (tab.id == id)
                index = i;
        });

        if (index > -1)
            $scope.tabs.splice(index, 1);
    };
}]);

angular.module('semanticular.tabs').directive('tabset', ['$timeout', function($timeout) {
    /**
     * Template of directive.
     * @type {String}
     */
    var template =
        '<div class="tabset">' +
            '<div class="ui top attached tabular menu">' +
                '<a class="item" ng-repeat="tab in tabs" data-tab="{{tab.id}}"' +
                    ' ng-class="{active: tab.isActive}">{{tab.heading}}</a>' +
            '</div>' +
            '<div ng-transclude></div>' +
        '</div>';


    /**
     * Default options.
     * @type {Object}
     */
    var defaults = {
        extraClasses: []
    };


    /**
     * Linker function.
     */
    var link = function(scope, $element, attrs) {
        $element = $($element[0]);
        var options = $.extend(true, {}, defaults, scope.options || {});

        $timeout(function() {
            $element
                .find('.menu')
                .addClass(options.extraClasses.join(' '))
                .find('.item')
                .tab();
        });
    };


    return {
        restrict: 'E',
        scope: {
            options: '='
        },
        template: template,
        transclude: true,
        replace: true,
        controller: 'TabsetController',
        link: link
    };
}]);

angular.module('semanticular', [
    'semanticular.dropdown',
    'semanticular.modal',
    'semanticular.popup',
    'semanticular.checkbox',
    'semanticular.radio',
    'semanticular.progress',
    'semanticular.tabs'
]);
