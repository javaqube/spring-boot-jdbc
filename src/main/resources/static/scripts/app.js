(function () {
    angular.module("app",['craft.core','craft.api.rest']);
    angular.module("app").controller("DemoCtrl",function ($scope,HttpService) {
        var url="comments";

        // $scope.data1 = [
        //     {name: '正面', value: '1'},
        //     {name: '中性', value: '0'},
        //     {name: '负面', value: '-1'}
        // ];
        // $scope.data2 = [
        //     {name: '保留', value: '0'},
        //     {name: '删除', value: '1'}
        // ];
        $scope.comments=[];
        $scope.keywords="";
        HttpService.get(url).then(function (data) {
            console.log(data);
            $scope.comments=data;
        },function (error) {
            console.log(error);
            $scope.comments=[];
        });

        $scope.submitReview=function () {
            console.log("submit review ");
            HttpService.post(url,{'review':$scope.comments,'keywords':$scope.keywords}).then(function (data) {
                console.log(data);
                $scope.keywords="";
                HttpService.get(url).then(function (data) {
                    console.log(data);
                    $scope.comments=data;
                },function (error) {
                    console.log(error);
                    $scope.comments=[];
                });
            },function (error) {
                console.log(error);
                $scope.keywords="";
                HttpService.get(url).then(function (data) {
                    console.log(data);
                    $scope.comments=data;
                },function (error) {
                    console.log(error);
                    $scope.comments=[];
                });
            });
        }

    });


}).call(this);