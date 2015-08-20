angular.module('semanticular.dropdown').controller('DropdownController', ['$rootScope', '$scope', function($rootScope, $scope) {
    /**
     * Default options.
     * @type {Object}
     */
    var defaults = {
        placeholder: '',
        allowSearch: false,
        allowMultipleSelection: false
    };


    $scope.items = [];
    $scope.control = $scope.control || {};
    $scope.options = $.extend(true, {}, defaults, $scope.options || {});


    /**
     * Save original onChange handler in options, we will intercept that event.
     */
    var onChangeOriginal = $scope.options.onChange;
    $scope.options.onChange = function(val) {
        if ($scope.options.allowMultipleSelection)
            val = val ? val.split(',') : [];

        if (!_.isEqual($scope.model, val)) {
            $scope.model = val;

            onChangeOriginal && onChangeOriginal(val);

            // Sorry for anti pattern. There is no way to find out that
            // this method is called because model change or view change
            if (!$rootScope.$$phase)
                $scope.$apply()
        }
    };


    /**
     * Adds item.
     * @param {string} text
     * @param {string} value
     */
    this.addItem = $scope.control.addItem = function(title, value) {
        $scope.items.push({
            title: title,
            value: value
        });
    };


    /**
     * Removes item.
     * @param {string} value
     */
    this.removeItem = $scope.control.removeItem = function(value) {
        var index = -1;

        $scope.items.forEach(function(item, i) {
            if (item.value == value)
                index = i;
        });

        if (index > -1)
            $scope.items.splice(index, 1);
    };


    /**
     * Removes all items.
     */
    this.clearItems = $scope.control.clearItems = function() {
        $scope.items = [];
    };


    /**
     * Returns whether given value is selected or not.
     * @param {string} value
     * @return {boolean}
     */
    $scope.isValueSelected = function(value) {
        if ($scope.options.allowMultipleSelection)
            return $scope.model.indexOf(value) > -1;

        return $scope.model == value;
    };
}]);
