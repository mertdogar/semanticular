angular.module('myApp', ['semanticular.dropdown']).controller('DemoController', function($scope) {
    $scope.dropdownValue = 'item3';

    $scope.dropdownOptions = {
        placeholder: 'Al sana placeholder',
        // allowSearch: true,
        // allowMultipleSelection: true,
        // extraClasses: ['fluid'],
        onChange: function(val) {
            console.log('New value of dropdown is ' + val);
        }
    };

    $scope.items = [
        {
            title: 'Item 3',
            value: 'item3'
        },
        {
            title: 'Item 4',
            value: 'item4'
        },
        {
            title: 'Item 5',
            value: 'item5'
        }
    ];

    $scope.dropdownValue2 = ['item4'];

    $scope.dropdownOptions2 = {
        placeholder: 'Multiple search',
        allowSearch: true,
        allowMultipleSelection: true
    };

    $scope.dropdownOptions3 = {
        placeholder: 'Remote search',
        allowSearch: true,
        allowMultipleSelection: true,
        allowAdditions: true,
        maxSelections: 3,
        apiSettings: {
            url: '//api.github.com/search/repositories?q={query}',
            onResponse: function(response) {
                var repos = [];

                for (var i in response.items) {
                    repos.push({
                        name: response.items[i].name,
                        value: response.items[i].name
                    });
                }

                return {
                    success: true,
                    results: repos
                };
            }
        },
        onChange: function(val) {
            console.log('New value of dropdown is ' + val);
        }
    };
});
