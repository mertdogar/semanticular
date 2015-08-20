angular.module('semanticular.dropdown').directive('dropdown', [function() {
    /**
     * Template of directive.
     * @type {String}
     */
    var template =
        '<div class="ui selection dropdown">' +
            '<input type="hidden" name="">' +
            '<i class="dropdown icon"></i>' +
            '<div class="default text"></div>' +
            '<div class="menu">' +
                '<div class="item" ng-repeat="item in items" ' +
                        'data-value="{{item.value}}" ' +
                        'ng-class="{filtered: isValueSelected(item.value)}">' +
                    '{{item.title}}' +
                '</div>' +
            '</div>' +
            '<div ng-transclude style="display: none;"></div>' +
        '</div>';


    /**
     * Linker function.
     */
    var link = function(scope, $element, attrs, ngModel) {
        $element = $($element[0]);
        var extraClasses = [];

        if (scope.options.allowSearch)
            extraClasses.push('search');

        if (scope.options.allowMultipleSelection)
            extraClasses.push('multiple');

        // Manually add placeholder
        $element
            .find('.default.text')
            .text(scope.options.placeholder || '');

        // Initalize dropdown
        $element
            .addClass(extraClasses.join(' '))
            .dropdown(scope.options);

        // Sets view value
        scope.control.setViewValue = function(value, opt_force) {
            if (_.isEqual(scope.control.getViewValue(), value))
                return;

            var command = 'set selected';

            if (scope.options.allowMultipleSelection)
                command = 'set exactly';

            $element.dropdown(command, value);

            // Check if it's set selected indeed. While initalizing sometimes
            // this does not work.
            if (opt_force) {
                var viewValue = scope.control.getViewValue();

                if (!_.isEqual(viewValue, value)) {
                    setTimeout(
                        scope.control.setViewValue.bind(null, value, opt_force),
                        10
                    );
                }
            }
        };

        // Gets view value
        scope.control.getViewValue = function() {
            var viewValue = $element.dropdown('get value');
            if (scope.options.allowMultipleSelection)
                viewValue = viewValue ? viewValue.split(',') : [];

            return viewValue;
        };

        // Listen ng-model's value
        var modelListener = scope.$watch('model', function(val) {
            scope.control.setViewValue(scope.model, true);
        });

        // Clear model listener on destroy
        scope.$on('$destroy', function() {
            modelListener();
        });
    };


    return {
        restrict: 'E',
        scope: {
            model: '=ngModel',
            options: '=?',
            control: '=?'
        },
        template: template,
        transclude: true,
        replace: true,
        controller: 'DropdownController',
        link: link
    };
}]);
