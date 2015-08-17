angular.module('semanticular.dropdown').controller('DropdownController', ['$scope', function($scope) {
    $scope.items = [];
    $scope.control = $scope.control || {};


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
     * Refreshes value.
     */
    this.refreshValue = $scope.control.refreshValue = function() {
        $scope.refreshValue();
    };
}]);
