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
     * @param {string} text
     * @param {string} value
     */
    this.removeItem = function(title, value) {
        var index = $scope.items.indexOf({
            title: title,
            value: value
        });

        if (index > -1)
            $scope.items.splice(index, 1);
    };
}]);
