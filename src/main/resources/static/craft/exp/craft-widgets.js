/**
 * Created by Ming on 2017/4/6.
 */
(function () {
    angular.module("craft.widgets.dataGrid", []).component("craftDataGrid", {
        templateUrl: "templates/widgets/data-grid.html",
        bindings: {
            data: '<',
            meta: '<',
            handlers: '<'
        },
        controller: ['$scope','$filter','CrudService', function ($scope,$filter,CrudService) {
            var vm = this;
            vm.$onInit = function () {
                // console.log(vm.meta);
                // console.log(vm.handlers);

                vm.allSelected=false;
                // vm.data=vm.handleData(vm.data);
                //pagination & filter
                vm.pager = {
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 50, 100],
                    totalItems: vm.data ? vm.data.length : 0,
                    filteredItemSize: function () {
                        if(typeof vm.filteredData !== "undefined" && vm.filteredData!==null)
                            return vm.filteredData.length;
                        else return 0;
                    },
                    currentPage: 1,
                    pageChanged: function () {
                        console.log("pageChanged");
                        console.log(this.currentPage);
                        if (typeof vm.filteredData !== "undefined" && vm.filteredData !== null) {
                            console.log(this.from(), this.to());
                            vm.displayData = vm.filteredData.slice(this.from(), this.to());
                        }
                    },
                    from: function () {
                        return (this.currentPage - 1) * this.pageSize;
                    },
                    to: function () {
                        if (this.currentPage * this.pageSize > this.filteredItemSize()) return this.filteredItemSize();
                        else return this.currentPage * this.pageSize;
                    }
                };
                vm.searchText = "";
                vm.orderColumn = null;
                vm.reverse=false;

                vm.meta.columns=vm.meta.columns.map(function (column) {
                    column.active=true;
                    return column;
                });

                $scope.$watch("vm.searchText", function (newValue, oldValue, scope) {
                    if (newValue != null && newValue !== "") {
                        vm.filteredData = $filter('filter')(vm.data, newValue);
                    }
                });

                $scope.$watch("vm.filteredData", function (newValue, oldValue) {
                    vm.pager.pageChanged();
                });
                $scope.$watch("vm.pager.pageSize", function (newValue, oldValue) {
                    vm.pager.pageChanged();
                });


                $scope.$watch("vm.data", function (newValue, oldValue, scope) {
                    console.log(newValue, oldValue);
                    if (newValue != null) {
                        vm.pager.totalItems = newValue.length;
                    }
                    vm.filteredData = vm.data;
                });
            };
            vm.sort=function (column) {
                vm.orderColumn=column;
                vm.reverse=!vm.reverse;
            };

            vm.handleData = function (data) {
                if (vm.handlers.advise !== null) {
                    angular.forEach(data, function (item) {
                        vm.executeFunctionByName("advise", item);
                    });
                }
                return data;
            };
            vm.executeFunctionByName = function (str) {
                var args=[];
                var argsCount=arguments.length;
                for (var i = 1; i < argsCount; i++) {
                    args.push(arguments[i]);
                }

                var fn = vm.findFuncByName(str);
                fn.apply(vm.handlers, args);

                // console.log(fn);
                // console.log(typeof args);
                // if (typeof args === "undefined") {
                //     fn.call(vm.handlers);
                // } else if (Array.isArray(args)===true) {
                //     fn.apply(vm.handlers, args);
                // } else {
                //     fn.call(vm.handlers, args);
                // }
            };

            vm.findFuncByName = function (funcName) {
                var arr = funcName.split('.');
                // console.log(arr);
                var fn = vm.handlers[arr[0]];
                // console.log(fn);
                for (var i = 1; i < arr.length; i++) {
                    fn = fn[arr[i]];
                }
                // console.log(fn);
                return fn;
            };

            vm.showInLineButton=function (funName,item) {
                if (funName === undefined) return true;
                // var fn = vm.findFuncByName(funName);
                //console.log(fn);
                return vm.executeFunctionByName(funName,item);
            };

            vm.toggleColumns=function (column) {
                column.active=!column.active;
            };
            vm.toggleColumnMenu=function () {
                vm.showColumnMenu=!vm.showColumnMenu;
            };

            vm.selectAllItems=function () {
                // console.log(vm.allSelected);
                vm.allSelected=!vm.allSelected;
                vm.data.forEach(function (item) {
                    item.checked=vm.allSelected;
                });
            };

        }],
        controllerAs: 'vm'
    });


    angular.module("craft.widgets.dataGrid").directive("checkboxModel", ["$compile", function ($compile) {
        return {
            restrict: "A",
            link: function (scope, ele, attrs) {
                // Defining updateSelection function on the parent scope
                if (!scope.$parent.updateSelections) {
                    // Using splice and push methods to make use of
                    // the same "selections" object passed by reference to the
                    // addOrRemove function as using "selections = []"
                    // creates a new object within the scope of the
                    // function which doesn't help in two way binding.
                    scope.$parent.updateSelections = function (selectedItems, item, isMultiple) {
                        var itemIndex = selectedItems.indexOf(item);
                        var isPresent = (itemIndex > -1);
                        if (isMultiple) {
                            if (isPresent) {
                                selectedItems.splice(itemIndex, 1);
                            } else {
                                selectedItems.push(item);
                            }
                        } else {
                            if (isPresent) {
                                selectedItems.splice(0, 1);
                            } else {
                                selectedItems.splice(0, 1, item);
                            }
                        }
                    };
                }

                // Adding or removing attributes
                ele.attr("ng-checked", attrs.checkboxModel + ".indexOf(" + attrs.checkboxValue + ") > -1");
                var multiple = attrs.multiple ? "true" : "false";
                ele.attr("ng-click", "updateSelections(" + [attrs.checkboxModel, attrs.checkboxValue, multiple].join(",") + ")");
                ele.attr("ng-change", "updateSelections(" + [attrs.checkboxModel, attrs.checkboxValue, multiple].join(",") + ")");
                // Removing the checkbox-model attribute,
                // it will avoid recompiling the element infinitly
                ele.removeAttr("checkbox-model");
                ele.removeAttr("checkbox-value");
                ele.removeAttr("multiple");

                $compile(ele)(scope);
            }
        };
    }]);


}).call(this);
(function () {
    angular.module('craft.widgets.dynamicForm', []).component('craftDynamicForm', {
        templateUrl: "templates/widgets/dynamic-form.html",
        bindings:{
            meta:'<',
            currentItem:'<',
            handlers:'<',
            edit:'<'
        },
        controller:['$scope',function ($scope) {
            var vm=this;
            vm.$onInit=function () {
                $scope.$watchCollection("vm.currentItem",function (newVal, oldVal, scope) {
                    console.log(newVal);
                    if(vm.handlers.hasOwnProperty("itemChanged")){
                        var fn = vm.findFuncByName("itemChanged");
                        fn.call(vm.handlers, newVal);
                    }
                });
            };
            vm.$onChanges=function (changesObj) {
                console.log(changesObj);
            };

            vm.hideLogic=function (funcName) {
                // console.log(funcName);
                if(typeof funcName==="undefined" || funcName===null) return false;

                if(vm.handlers.hasOwnProperty(funcName)){
                    var fn = vm.findFuncByName(funcName);
                    var value= fn.call(vm.handlers, vm.currentItem);
                    // console.log(value);
                    return value;
                }
            };

            vm.findFuncByName = function (funcName) {
                var arr = funcName.split('.');
                // console.log(arr);
                var fn = vm.handlers[arr[0]];
                // console.log(fn);
                for (var i = 1; i < arr.length; i++) {
                    fn = fn[arr[i]];
                }
                // console.log(fn);
                return fn;
            };
            vm.executeFunctionByName = function (str, args) {
                // console.log(args);
                var fn = vm.findFuncByName(str);
                // console.log(fn);
                // console.log(typeof args);
                if (typeof args === "undefined") {
                    fn.call(vm.handlers);
                } else if (Array.isArray(args)===true) {
                    fn.apply(vm.handlers, args);
                } else {
                    fn.call(vm.handlers, args);
                }
            };
        }],
        controllerAs:'vm'
    });
}).call(this);
(function () {
    angular.module('craft.widgets.FieldRender',[]);
    angular.module('craft.widgets.FieldRender').directive('craftFieldRender',  ['$templateCache', '$compile',  function ($templateCache, $compile) {

        var getTemplateUrl = function(type) {
            var templateUrl = "templates/widgets/field-render/" + type + ".html";
            return templateUrl;
        };

        var linker = function (scope, element, attribute) {
            var templateUrl=getTemplateUrl(scope.field.type);
            // $http.get(templateUrl).success(function(data) {
            //     element.html(data);
            //     $compile(element.contents())(scope);
            // });

            element.html($templateCache.get(templateUrl));
            $compile(element.contents())(scope);

            // scope.fieldValue = _.get(scope.currentItem, scope.field.name);
            // scope.$watch("fieldValue", function (newValue, oldValue, scope) {
            //     _.set(scope.currentItem, scope.field.name, newValue);
            // });
        };
        return {
            restrict: 'E',
            scope: {
                field: '=',
                currentItem: '='
            },
            controller:[function(){
            }],
            link: linker
        };
    }]);

}).call(this);
/**
 * Created by Ming on 2017/4/6.
 */
(function () {
    angular.module("craft.widgets.listViewer", []).component("craftListViewer", {
        templateUrl: "templates/widgets/list-viewer.html",
        bindings: {
            data: '=',
            meta: '<',
            handlers: '<'
        },
        controller: ['$scope', '$filter', function ($scope, $filter) {
            var vm = this;
            vm.$onInit = function () {
                // console.log(vm.meta);
                // console.log(vm.handlers);
                vm.data = vm.handleData(vm.data);
                vm.pager = {
                    pageSizeOptions: [10, 20, 50, 100],
                    pageSize: 10,
                    totalItems: vm.data ? vm.data.length : 0,
                    filteredItemSize: function () {
                        if(typeof vm.filteredData !== "undefined" && vm.filteredData!==null)
                            return vm.filteredData.length;
                        else return 0;
                    },
                    currentPage: 1,
                    pageChanged: function () {
                        console.log("pageChanged");
                        console.log(this.currentPage);
                        if (typeof vm.filteredData !== "undefined" && vm.filteredData !== null) {
                            console.log(this.from(), this.to());
                            vm.displayData = vm.filteredData.slice(this.from(), this.to());
                        }
                    },
                    from: function () {
                        return (this.currentPage - 1) * this.pageSize;
                    },
                    to: function () {
                        if (this.currentPage * this.pageSize > this.filteredItemSize()) return this.filteredItemSize();
                        else return this.currentPage * this.pageSize;
                    }
                };

                vm.searchText = "";
                vm.orderColumn = null;
                vm.reverse=false;

                $scope.$watch("vm.searchText", function (newValue, oldValue, scope) {
                    if (newValue != null && newValue !== "") {
                        vm.filteredData = $filter('filter')(vm.data, newValue);
                    }
                });

                $scope.$watch("vm.filteredData", function (newValue, oldValue) {
                    vm.pager.pageChanged();
                });
                $scope.$watch("vm.pager.pageSize", function (newValue, oldValue) {
                    vm.pager.pageChanged();
                });

                $scope.$watch("vm.data", function (newValue, oldValue, scope) {
                    console.log(newValue, oldValue);
                    if (newValue != null) {
                        vm.pager.totalItems = newValue.length;
                    }
                    vm.filteredData = vm.data;
                });

            };
            vm.handleData = function (data) {
                if (vm.handlers.advise !== null) {
                    angular.forEach(data, function (item) {
                        vm.executeFunctionByName("advise", item);
                    });
                }
                return data;
            };
            vm.sort=function (column) {
                vm.orderColumn=column;
                vm.reverse=!vm.reverse;
            };
            vm.executeFunctionByName = function (str, args) {
                // console.log(args);
                var fn = vm.findFuncByName(str);
                // console.log(fn);
                // console.log(typeof args);
                if (typeof args === "undefined") {
                    fn.call(vm.handlers);
                } else if (Array.isArray(args) === true) {
                    fn.apply(vm.handlers, args);
                } else {
                    fn.call(vm.handlers, args);
                }
            };

            vm.findFuncByName = function (funcName) {
                var arr = funcName.split('.');
                // console.log(arr);
                var fn = vm.handlers[arr[0]];
                // console.log(fn);
                for (var i = 1; i < arr.length; i++) {
                    fn = fn[arr[i]];
                }
                // console.log(fn);
                return fn;
            };

            vm.showInLineButton = function (funName, item) {
                if (funName === undefined) return true;
                // var fn = vm.findFuncByName(funName);
                //console.log(fn);
                return vm.executeFunctionByName(funName, item);
            };
        }],
        controllerAs: 'vm'
    });

}).call(this);
(function () {
    "use strict";

    angular.module("craft.widgets.MultiSelect", []);
    angular.module("craft.widgets.MultiSelect")
        .directive('craftMultiSelect',[multiSelect]);

    function multiSelect() {
        return {
            templateUrl: function (elements, attributes) {
                return attributes.templateUrl || 'templates/component/multi-select-module.html';
            },
            restrict: 'E',
            scope: {
                leftoptions: '=',
                rightoptions: '=',
                showcolumn: "@"
            },
            controller: function ($scope) {
                var leftSelect = [];
                var rightSelect = [];

                $scope.selectItem = function (item) {
                    leftSelect = [];
                    rightSelect = [];
                    leftSelect.push(item);
                };

                $scope.removeItem = function (item) {
                    leftSelect = [];
                    rightSelect = [];
                    rightSelect.push(item);
                };

                $scope.rightSelect = function () {
                    //remove left
                    removeArray($scope.leftoptions, leftSelect);

                    //add right
                    addArray($scope.rightoptions, leftSelect);
                    leftSelect = [];
                    rightSelect = [];
                };

                $scope.leftSelect = function () {
                    //remove left
                    removeArray($scope.rightoptions, rightSelect);

                    //add right
                    addArray($scope.leftoptions, rightSelect);
                    leftSelect = [];
                    rightSelect = [];
                };

                $scope.rightAll = function () {
                    leftSelect = [];
                    rightSelect = [];
                    addArray($scope.rightoptions, $scope.leftoptions);
                    $scope.leftoptions = [];
                };
                $scope.leftAll = function () {
                    leftSelect = [];
                    rightSelect = [];
                    addArray($scope.leftoptions, $scope.rightoptions);
                    $scope.rightoptions = [];
                };

                var removeArray = function (array1, array2) {
                    for (var i = 0; i < array2.length; i++) {
                        var index = array1.indexOf(array2[i]);
                        if (index < 0)
                            continue;
                        array1.splice(index, 1);
                    }
                };

                var addArray = function (array1, array2) {
                    for (var i = 0; i < array2.length; i++) {
                        array1.push(array2[i]);
                    }
                };

                $scope.show = function (item) {
                    if ($scope.showcolumn === undefined || $scope.showcolumn === null)
                        return item;
                    return item[$scope.showcolumn];
                };
            },
            link: function (scope, element, attr) {
            }
        };
    }

}).call(this);
(function () {
 angular.module("craft.widgets.templates", []).run(["$templateCache", function($templateCache) {

$templateCache.put("templates/widgets/data-grid.html",'<div class=\"clearfix\"><div class=\"pull-right tableTools-container\"><div class=\"dt-buttons btn-overlap btn-group\"><a class=\"dt-button buttons-collection buttons-colvis btn btn-white btn-primary btn-bold\" tabindex=\"0\" tooltip-placement=\"top\" uib-tooltip=\"Show/hide columns\" aria-controls=\"dynamic-table\" data-original-title=\"\" ng-click=\"vm.toggleColumnMenu()\"><span><i class=\"glyphicon glyphicon-th bigger-110 blue\"></i> <span class=\"hidden\">Show/hide columns</span> </span></a><a ng-repeat=\"button in vm.meta.topButtons\" ng-click=\"vm.executeFunctionByName(button.callback,vm.data,button.params)\" class=\"dt-button btn btn-white btn-primary btn-bold\" title=\"{{button.label}}\"><span><i class=\"bigger-110 blue\" ng-class=\"button.icon\"></i> <span class=\"display\">{{button.label}}</span></span></a><div class=\"dt-button-collection\" style=\"margin-top: 0px\" ng-show=\"vm.showColumnMenu\"><ul class=\"dropdown-menu dropdown-light dropdown-caret\"><li ng-repeat=\"column in vm.meta.columns\"><a class=\"dt-button buttons-columnVisibility\" ng-class=\"{active:column.active}\" ng-click=\"vm.toggleColumns(column)\" aria-controls=\"dynamic-table\" href=\"\"><span>{{column.label}}</span></a></li><!--<li><a class=\"dt-button buttons-columnVisibility\" tabindex=\"0\" aria-controls=\"dynamic-table\"--><!--href=\"#\"><span>Domain</span></a></li>--><!--<li><a class=\"dt-button buttons-columnVisibility active\" tabindex=\"0\" aria-controls=\"dynamic-table\"--><!--href=\"#\"><span>Price</span></a></li>--><!--<li><a class=\"dt-button buttons-columnVisibility active\" tabindex=\"0\" aria-controls=\"dynamic-table\"--><!--href=\"#\"><span>Clicks</span></a></li>--><!--<li><a class=\"dt-button buttons-columnVisibility active\" tabindex=\"0\" aria-controls=\"dynamic-table\"--><!--href=\"#\"><span>Update</span></a></li>--><!--<li><a class=\"dt-button buttons-columnVisibility active\" tabindex=\"0\" aria-controls=\"dynamic-table\"--><!--href=\"#\"><span>Status</span></a></li>--></ul></div><!--<a class=\"dt-button buttons-copy buttons-html5 btn btn-white btn-primary btn-bold\" title=\"\">--><!--<span><i class=\"fa fa-copy bigger-110 pink\"></i> <span class=\"hidden\">Copy</span></span></a>--><!--<a class=\"dt-button buttons-csv buttons-html5 btn btn-white btn-primary btn-bold\" title=\"\">--><!--<span><i class=\"fa fa-database bigger-110 orange\"></i> <span class=\"hidden\">Export to CSV</span></span></a>--><!--<a class=\"dt-button buttons-excel buttons-flash btn btn-white btn-primary btn-bold\" >--><!--<span><i class=\"fa fa-file-excel-o bigger-110 green\"></i> <span class=\"hidden\">Export to Excel</span></span></a>--><!--<a class=\"dt-button buttons-pdf buttons-flash btn btn-white btn-primary btn-bold\">--><!--<span><i class=\"fa fa-file-pdf-o bigger-110 red\"></i> <span class=\"hidden\">Export to PDF</span></span>--><!--</a>--><!--<a class=\"dt-button buttons-print btn btn-white btn-primary btn-bold\" title=\"\">--><!--<span><i class=\"fa fa-print bigger-110 grey\"></i> <span class=\"hidden\">Print</span></span>--><!--</a>--></div></div></div><div class=\"table-header\">查询结果</div><div><div class=\"dataTables_wrapper form-inline no-footer\"><div class=\"row\"><div class=\"col-xs-6\"><div class=\"dataTables_length\"><label>每页<select ng-model=\"vm.pager.pageSize\" class=\"form-control input-sm\" ng-options=\"option for option in vm.pager.pageSizeOptions\"><!--<option ng-repeat=\"option in vm.pager.pageSizeOptions\"--><!--ng-selected=\"option==vm.pager.pageSize\"--><!--value=\"{{option}}\">--><!--{{option}}--><!--</option>--></select>条记录</label></div></div><div class=\"col-xs-6\"><div class=\"dataTables_filter\"><label>Search:<input type=\"search\" class=\"form-control input-sm\" placeholder=\"\" ng-model=\"vm.searchText\"></label></div></div></div><table class=\"table table-striped table-bordered table-hover dataTable no-footer\"><thead><tr class=\"table-header\"><th><input type=\"checkbox\" ng-click=\"vm.selectAllItems()\" ng-checked=\"vm.allSelected\"></th><th ng-repeat=\"column in vm.meta.columns|filter:{active: true}\" class=\"center sorting\" ng-click=\"vm.sort(column.sort)\" ng-class=\"{\'sorting_desc\':(column.sort===vm.orderColumn) && vm.reverse,\'sorting_asc\':(column.sort===vm.orderColumn) && (!vm.reverse)}\">{{column.label}}</th><th>操作</th></tr></thead><tbody><tr ng-repeat=\"item in vm.displayData| orderBy :vm.orderColumn:vm.reverse \" class=\"table-detail\"><td><input type=\"checkbox\" ng-click=\"vm.selectOne()\" ng-model=\"item.checked\"></td><td ng-repeat=\"column in vm.meta.columns|filter:{active: true}\" class=\"hidden-480\">{{item[column.name]}}</td><td><button ng-repeat=\"button in vm.meta.inlineButtons\" ng-class=\"button.class\" ng-show=\"vm.showInLineButton(button.showFunc,item)\" ng-click=\"vm.executeFunctionByName(button.callback,item)\"><i ng-class=\"button.icon\"></i>{{button.label}}</button></td></tr></tbody></table><div class=\"row\"><div class=\"col-xs-6\"><div class=\"dataTables_info\" role=\"status\" aria-live=\"polite\">显示 ({{vm.pager.from()+1}} - {{vm.pager.to()}})条 / {{vm.pager.filteredItemSize()}} 条<label ng-if=\"vm.searchText!==\'\'\">(共{{vm.pager.totalItems}}条)</label></div></div><div class=\"col-xs-6\"><div class=\"dataTables_paginate paging_simple_numbers\"><ul uib-pagination total-items=\"vm.pager.filteredItemSize()\" items-per-page=\"vm.pager.pageSize\" ng-model=\"vm.pager.currentPage\" ng-change=\"vm.pager.pageChanged()\" max-size=\"5\" class=\"pagination-sm\" boundary-link-numbers=\"true\" boundary-links=\"true\" rotate=\"false\" first-text=\"首页\" previous-text=\"上页\" next-text=\"下页\" last-text=\"尾页\"></ul></div></div></div></div></div>');
$templateCache.put("templates/widgets/dynamic-form.html",'<div class=\"row\" ng-cloak class=\"ng-cloak\"><div class=\"col-xs-12\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><h3 class=\"panel-title\"><div ng-if=\"!vm.edit\">添加{{vm.meta.title}}</div><div ng-if=\"vm.edit\">编辑{{vm.meta.title}}</div></h3></div><form class=\"form-horizontal panel-body\" name=\"thisForm\"><div ng-repeat=\"field in vm.meta.fields\"><craft-field-render field=\"field\" current-item=\"vm.currentItem\" ng-if=\"!vm.hideLogic(field.hideFunc)\"></craft-field-render></div><div class=\"form-group\"><div class=\"col-xs-12 col-md-10 text-center\"><button ng-repeat=\"button in vm.meta.formButtons\" ng-class=\"button.class\" validation-submit=\"thisForm\" ng-click=\"vm.executeFunctionByName(button.callback,[vm.currentItem])\"><i ng-class=\"button.icon\"></i>{{button.label}}</button> <button class=\"btn btn-sm btn-primary\" ng-click=\"vm.handlers.save(vm.currentItem,vm.edit)\" validation-submit=\"thisForm\"><i class=\"glyphicon glyphicon-ok\">保存</i></button> <button class=\"btn btn-sm btn-grey\" ng-click=\"vm.handlers.cancel()\"><i class=\"glyphicon glyphicon-remove\">取消</i></button><!--{{vm.meta.formButtons}}--></div></div></form><div class=\"panel-footer\">{{vm.currentItem|json}}</div></div></div></div>');
$templateCache.put("templates/widgets/left-treenode-select.html",'<div class=\"tree-item\" ng-class=\"{true:\'tree-selected\',false:\'\'} [selectItems.indexOf(item)>=0]\" ng-if=\"item.children==undefined\"><div class=\"tree-item-name\"><a ng-click=\"select(item)\"><i ng-class=\"{true:\'fa fa-check-square-o\',false:\'fa fa-square-o\'}[selectItems.indexOf(item)>=0]\"></i> {{item.name}}</a></div></div><div class=\"tree-folder\" ng-if=\"item.children.length>=0\"><div class=\"tree-folder-header dropdown-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#lefttree{{item.id}}\"><i class=\"fa my-tree-icon\"></i><div class=\"tree-folder-name\">{{item.name}}</div></div><div class=\"tree-folder-content collapse\" ng-if=\"item.children.length>0\" id=\"lefttree{{item.id}}\"><div ng-repeat=\"item in item.children\" ng-include=\"\'templates/component/left-treenode-select.html\'\"></div></div></div>');
$templateCache.put("templates/widgets/list-viewer.html",'<div><div class=\"table-header\">查询结果</div><div class=\"dataTables_wrapper form-inline no-footer\" style=\"overflow: auto\"><div class=\"row\"><div class=\"col-xs-6\"><div class=\"dataTables_length\" id=\"DataTables_Table_0_length\"><label>Display<select ng-model=\"vm.pager.pageSize\" class=\"form-control input-sm\" ng-options=\"option for option in vm.pager.pageSizeOptions\"></select>records</label></div></div><div class=\"col-xs-6\"><div id=\"DataTables_Table_0_filter\" class=\"dataTables_filter\"><label>Search:<input type=\"search\" class=\"form-control input-sm\" placeholder=\"\" ng-model=\"vm.searchText\"></label></div></div></div></div><div class=\"dataTables_wrapper form-inline no-footer\" style=\"overflow: auto\"><table class=\"table table-striped table-bordered table-hover dataTable no-footer\"><thead><tr class=\"table-header\"><th ng-repeat=\"column in vm.meta.columns\" class=\"center sorting\" ng-click=\"vm.sort(column.name)\" ng-class=\"{\'sorting_desc\':(column.name===vm.orderColumn) && vm.reverse,\'sorting_asc\':(column.name===vm.orderColumn) && (!vm.reverse)}\">{{column.label}}</th></tr></thead><tbody><tr ng-repeat=\"item in vm.displayData| orderBy :vm.orderColumn:vm.reverse  \" class=\"table-detail\"><td ng-repeat=\"column in vm.meta.columns\" class=\"hidden-480\">{{item[column.name]}}</td></tr></tbody></table></div><div class=\"dataTables_wrapper form-inline no-footer\"><div class=\"row\"><div class=\"col-xs-4\"><div class=\"dataTables_info\" id=\"DataTables_Table_0_info\" role=\"status\" aria-live=\"polite\">显示 ({{vm.pager.from()+1}} - {{vm.pager.to()}})条 / {{vm.pager.filteredItemSize()}} 条<label ng-if=\"vm.searchText!==\'\'\">(共{{vm.pager.totalItems}}条)</label></div></div><div class=\"col-xs-8\"><div class=\"dataTables_paginate paging_simple_numbers\" id=\"DataTables_Table_0_paginate\"><ul uib-pagination total-items=\"vm.pager.filteredItemSize()\" items-per-page=\"vm.pager.pageSize\" ng-model=\"vm.pager.currentPage\" ng-change=\"vm.pager.pageChanged()\" max-size=\"5\" class=\"pagination-sm\" boundary-link-numbers=\"true\" boundary-links=\"true\" rotate=\"false\" first-text=\"首页\" previous-text=\"上页\" next-text=\"下页\" last-text=\"尾页\"></ul></div></div></div></div></div>');
$templateCache.put("templates/widgets/multi-select.html",'<div class=\"row treeselect\"><div class=\"col-xs-5\"><select name=\"from\" id=\"undo_redo\" class=\"form-control\" size=\"13\" multiple=\"multiple\" ng-model=\"toBeSelected\"><option ng-repeat=\"item in leftoptions track by $index\" value=\"{{item.value}}\">{{item.name}}</option></select></div><div class=\"col-xs-2 selectbutton\"><button type=\"button\" id=\"undo_redo_rightAll\" class=\"btn btn-primary btn-block\" ng-click=\"selectAll()\"><i class=\"glyphicon glyphicon-forward\"></i></button> <button type=\"button\" id=\"undo_redo_rightSelected\" class=\"btn btn-warning btn-block\" ng-click=\"select()\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button> <button type=\"button\" id=\"undo_redo_leftSelected\" class=\"btn btn-warning btn-block\" ng-click=\"remove()\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button> <button type=\"button\" id=\"undo_redo_leftAll\" class=\"btn btn-primary btn-block\" ng-click=\"removeAll()\"><i class=\"glyphicon glyphicon-backward\"></i></button></div><div class=\"col-xs-5\"><select name=\"to\" id=\"undo_redo_to\" class=\"form-control\" size=\"13\" multiple=\"multiple\" ng-model=\"toBeRemoved\"><option ng-repeat=\"item in rightoptions track by $index\" value=\"{{item.value}}\">{{item.name}}</option></select></div></div>');
$templateCache.put("templates/widgets/right-treenode-select.html",'<div class=\"tree-item\" ng-class=\"{true:\'tree-selected\',false:\'\'}[removeItems.indexOf(item)>=0]\" ng-if=\"item.children==undefined || item.children.length==0\"><div class=\"tree-item-name\"><a ng-click=\"remove(item)\"><i ng-class=\"{true:\'fa fa-check-square-o\',false:\'fa fa-square-o\'}[removeItems.indexOf(item)>=0]\"></i> {{show(item)}}</a></div></div><div class=\"tree-folder\" ng-if=\"item.children.length>0\"><div class=\"tree-folder-header dropdown-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#righttree{{item.id}}\"><i class=\"fa my-tree-icon\"></i><div class=\"tree-folder-name\">{{show(item)}}</div></div><div class=\"tree-folder-content collapse\" ng-if=\"item.children.length>0\" id=\"righttree{{item.id}}\"><div ng-repeat=\"item in item.children\" ng-include=\"\'templates/component/right-treenode-select.html\'\"></div></div></div>');
$templateCache.put("templates/widgets/tree-select.html",'<div class=\"row lefttree\"><div class=\"col-xs-5\"><div class=\"tree tree-selectable\" id=\"tree-select-left-div\"><div ng-repeat=\"item in lefttree\" ng-include=\"\'templates/widgets/left-treenode-select.html\'\"></div></div></div><div class=\"col-xs-2\"><button type=\"button\" id=\"undo_redo_rightAll\" class=\"btn btn-primary btn-block\" ng-click=\"rightAll()\"><i class=\"glyphicon glyphicon-forward\"></i></button> <button type=\"button\" id=\"undo_redo_rightSelected\" class=\"btn btn-warning btn-block\" ng-click=\"rightSelect()\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button> <button type=\"button\" id=\"undo_redo_leftSelected\" class=\"btn btn-warning btn-block\" ng-click=\"leftSelect()\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button> <button type=\"button\" id=\"undo_redo_leftAll\" class=\"btn btn-primary btn-block\" ng-click=\"leftAll()\"><i class=\"glyphicon glyphicon-backward\"></i></button></div><div class=\"col-xs-5\"><div class=\"tree tree-selectable\" id=\"tree-select-right-div\"><div ng-repeat=\"item in righttree\" ng-include=\"\'templates/widgets/right-treenode-select.html\'\"></div></div></div></div>');
$templateCache.put("templates/widgets/field-render/checkbox.html",'<div class=\"form-group\"><label class=\"col-xs-12 col-sm-3 control-label\">{{field.label}} <i ng-if=\"field.validator.length!==0\" class=\"glyphicon glyphicon-star\"></i></label><div class=\"col-xs-12 col-sm-9\"><input type=\"checkbox\" ng-model=\"currentItem[field.name]\" ng-if=\"field.validator.length!==0\" name=\"{{field.name}}\" validator=\"{{field.validator.join()}}\" class=\"col-xs-10 col-sm-5\" placeholder=\"{{field.label}}\" ng-true-value=\"1\" ng-false-value=\"0\"> <input type=\"checkbox\" ng-model=\"currentItem[field.name]\" ng-if=\"field.validator.length===0\" name=\"{{field.name}}\" class=\"col-xs-10 col-sm-5\" placeholder=\"{{field.label}}\" ng-true-value=\"1\" ng-false-value=\"0\"></div></div>');
$templateCache.put("templates/widgets/field-render/date.html",'<div class=\"form-group\"><label class=\"col-xs-12 col-sm-3 control-label\">{{field.label}} <i ng-if=\"field.validator.length!==0\" class=\"glyphicon glyphicon-star\"></i></label><div class=\"col-xs-12 col-sm-9\"><p class=\"input-group\"><input type=\"text\" uib-datepicker-popup ng-model=\"currentItem[field.name]\" ng-if=\"field.validator.length!==0\" validator=\"{{field.validator.join()}}\" class=\"form-control\" name=\"{{field.name}}\" placeholder=\"{{field.label}}\" is-open=\"status\"> <span class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"status.opened=true\"><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p></div></div>');
$templateCache.put("templates/widgets/field-render/dictionary.html",'<div class=\"form-group\"><label class=\"col-xs-12 col-sm-3 control-label\">{{field.label}} <i ng-if=\"field.validator.length!==0\" class=\"glyphicon glyphicon-star\"></i></label><div class=\"col-xs-12 col-sm-9\"><dict-render current-item=\"currentItem\" field=\"field\"></dict-render></div></div>');
$templateCache.put("templates/widgets/field-render/dropdown.html",'<div class=\"form-group\"><label class=\"col-xs-12 col-sm-3 control-label no-padding-right\">{{field.label}} <i ng-if=\"field.validator.length!==0\" class=\"glyphicon glyphicon-star\"></i></label><div class=\"col-xs-12 col-sm-9\"><select type=\"checkbox\" ng-model=\"currentItem[field.name]\" ng-if=\"field.validator.length!==0\" name=\"{{field.name}}\" validator=\"{{field.validator.join()}}\" class=\"col-xs-10 col-sm-5\" placeholder=\"{{field.label}}\" ng-options=\"y as x for (x,y) in field.options\"></select><select type=\"checkbox\" ng-model=\"currentItem[field.name]\" ng-if=\"field.validator.length===0\" name=\"{{field.name}}\" class=\"col-xs-10 col-sm-5\" placeholder=\"{{field.label}}\" ng-options=\"y as x for (x,y) in field.options\"></select></div></div>');
$templateCache.put("templates/widgets/field-render/email.html",'<div class=\"form-group\"><div class=\"col-xs-12 col-sm-3 control-label\">{{field.label}}</div><div class=\"col-xs-12 col-sm-9\"><input type=\"email\" placeholder=\"Email\" ng-model=\"currentItem[field.name]\" ng-if=\"field.validator.length!==0\" validator=\"{{field.validator.join()}}\" name=\"{{field.name}}\"> <input type=\"email\" placeholder=\"Email\" ng-model=\"currentItem[field.name]\" ng-if=\"field.validator.length===0\" name=\"{{field.name}}\"></div></div>');
$templateCache.put("templates/widgets/field-render/hidden.html",'<div class=\"form-group\"><label class=\"col-xs-12 col-sm-3 control-label\">{{field.label}} <i ng-if=\"field.validator.length!==0\" class=\"glyphicon glyphicon-star\"></i></label><div class=\"col-xs-12 col-sm-9\"><input type=\"hidden\" ng-model=\"currentItem[field.name]\" ng-if=\"field.validator.length!==0\" name=\"{{field.name}}\" validator=\"{{field.validator.join()}}\"> <input type=\"hidden\" ng-model=\"currentItem[field.name]\" ng-if=\"field.validator.length===0\" name=\"{{field.name}}\"></div></div>');
$templateCache.put("templates/widgets/field-render/hintsearch.html",'<div class=\"form-group\"><label class=\"col-xs-12 col-sm-3 control-label\">{{field.label}} <i ng-if=\"field.validator.length!==0\" class=\"glyphicon glyphicon-star\"></i></label><div class=\"col-xs-12 col-sm-9\"><div ng-show=\"paramExist\" style=\"top: 30px;position: absolute;z-index: 1;background-color: #ffffff;width: 200px\"><li class=\"clearfix searchLi\" ng-repeat=\"item in res\" ng-click=\"checkoutValue(item.id)\">{{item.value}}</li></div><input type=\"text\" ng-model=\"currentItem[field.name]\" validator=\"{{field.validator.join()}}\" class=\"col-xs-10 col-sm-5\" ng-change=\"valueChange()\" ng-blur=\"changeInit()\" ng-focus=\"valueChange()\" name=\"textfield-{{field.name}}\" placeholder=\"{{field.placeholder}}\"></div></div>');
$templateCache.put("templates/widgets/field-render/password.html",'<div class=\"form-group\"><label class=\"col-xs-12 col-sm-3 control-label\">{{field.label}} <i ng-if=\"field.validator.length!==0\" class=\"glyphicon glyphicon-star\"></i></label><div class=\"col-xs-12 col-sm-9\"><input type=\"password\" ng-model=\"currentItem[field.name]\" ng-if=\"field.validator.length!==0\" name=\"{{field.name}}\" validator=\"{{field.validator.join()}}\"> <input type=\"password\" ng-model=\"currentItem[field.name]\" ng-if=\"field.validator.length===0\" name=\"{{field.name}}\"></div></div>');
$templateCache.put("templates/widgets/field-render/radio.html",'<div class=\"form-group\"><label class=\"col-xs-12 col-sm-3 control-label\">{{field.label}} <i ng-if=\"field.validator.length!==0\" class=\"glyphicon glyphicon-star\"></i></label><div class=\"col-xs-12 col-sm-9\"><label ng-repeat=\"option in field.options\"><input type=\"radio\" value=\"{{option.value}}\" name=\"{{field.name}}\" ng-if=\"field.validator.length!==0\" ng-model=\"currentItem[field.name]\" validator=\"{{field.validator.join()}}\"> <span ng-bind=\"option.title\"></span>&nbsp;&nbsp;</label></div></div>');
$templateCache.put("templates/widgets/field-render/rating.html",'<div class=\"form-group\"><label class=\"col-xs-12 col-sm-3 control-label\">{{field.label}} <i ng-if=\"field.validator.length!==0\" class=\"glyphicon glyphicon-star\"></i></label><div class=\"col-xs-12 col-sm-9\"><p class=\"input-group\"><uib-rating ng-model=\"fieldValue\" max=\"{{field.settings.max}}\" readonly=\"isReadonly\" on-hover=\"hoveringOver(value)\" on-leave=\"overStar = null\" titles=\"{{field.settings.titles}}\" name=\"{{field.name}}\" state-on=\"{{field.settings.stateOn}}\" state-off=\"{{field.settings.stateOff}}\"></uib-rating><span class=\"label\" ng-class=\"{\'label-warning\': percent<30, \'label-info\': percent>=30 && percent<70, \'label-success\': percent>=70}\" ng-show=\"overStar && !isReadonly\">{{percent}}%</span></p></div></div>');
$templateCache.put("templates/widgets/field-render/service.html",'<div class=\"form-group\"><label class=\"col-xs-12 col-sm-3 control-label no-padding-right\">{{field.label}} <i ng-if=\"field.validator.length!==0\" class=\"glyphicon glyphicon-star\"></i></label><div class=\"col-xs-12 col-sm-9\"><service-render current-item=\"currentItem\" field=\"field\"></service-render></div></div>');
$templateCache.put("templates/widgets/field-render/textarea.html",'<div class=\"form-group\"><label class=\"col-xs-12 col-sm-3 control-label no-padding-right\">{{field.label}} <i ng-if=\"field.validator.length!==0\" class=\"glyphicon glyphicon-star\"></i></label><div class=\"col-xs-12 col-sm-9\"><textarea class=\"col-xs-10 col-sm-5\" ng-model=\"currentItem[field.name]\" ng-if=\"field.validator.length!==0\" placeholder=\"{{field.placeholder}}\" name=\"{{field.name}}\" validator=\"{{field.validator.join()}}\">\r\n\r\n        <textarea class=\"col-xs-10 col-sm-5\" ng-model=\"currentItem[field.name]\" ng-if=\"field.validator.length===0\" placeholder=\"{{field.placeholder}}\" name=\"{{field.name}}\">\r\n    </div>\r\n</div>');
$templateCache.put("templates/widgets/field-render/textfield.html",'<div class=\"form-group\"><label class=\"col-xs-12 col-sm-3 control-label no-padding-right\">{{field.label}} <i ng-if=\"field.validator.length!==0\" class=\"glyphicon glyphicon-star\"></i></label><div class=\"col-xs-12 col-sm-9\"><input type=\"text\" ng-model=\"currentItem[field.name]\" ng-if=\"field.validator.length!==0\" validator=\"{{field.validator.join()}}\" class=\"col-xs-10 col-sm-5\" name=\"{{field.name}}\" placeholder=\"{{field.placeholder}}\"> <input type=\"text\" ng-model=\"currentItem[field.name]\" ng-if=\"field.validator.length===0\" class=\"col-xs-10 col-sm-5\" name=\"{{field.name}}\" placeholder=\"{{field.placeholder}}\"></div></div>');
$templateCache.put("templates/widgets/tree-menu/item.html",'<a ng-if=\"!item.submenu\" ui-sref=\"{{item.state}}({{item.params}})\"><i ng-if=\"item.icon\" class=\"menu-icon\" ng-class=\"[item.icon]\"></i> <span ng-if=\"item[\'level-1\']\" class=\"menu-text\">{{::item.title}} <span ng-if=\"item.badge\" ng-class=\"[\'badge\', item[\'badge-class\'], item[\'tooltip-class\']]\" uib-tooltip-html=\"\'{{item.tooltip}}\'\" tooltip-placement=\"right\" ng-bind-html=\"::item.badge\"></span> <span ng-if=\"item.label\" ng-class=\"[\'label\', item[\'label-class\']]\" ng-attr-title=\"{{item[\'label-title\']}}\" ng-bind=\"::item.label\"></span> </span><i ng-if=\"!item.icon && item[\'level-2\']\" class=\"menu-icon fa fa-caret-right\"></i> <span ng-if=\"!item[\'level-1\']\">{{::item.title}}</span> </a><a ng-if=\"item.submenu\" href=\"\" ng-class=\"\'dropdown-toggle\'\" ng-click=\"vm.toggleSubmenu(item)\"><i ng-if=\"item.icon\" class=\"menu-icon\" ng-class=\"[item.icon]\"></i> <span class=\"menu-text\">{{::item.title}} <span ng-if=\"item.badge\" ng-class=\"[\'badge\', item[\'badge-class\'], item[\'tooltip-class\']]\" uib-tooltip-html=\"\'{{item.tooltip}}\'\" tooltip-placement=\"right\" ng-bind-html=\"::item.badge\"></span> <span ng-if=\"item.label\" ng-class=\"[\'label\', item[\'label-class\']]\" ng-attr-title=\"{{item[\'label-title\']}}\" ng-bind=\"::item.label\"></span> </span><b class=\"arrow fa fa-angle-down\"></b> </a><b class=\"arrow\"></b><ul class=\"submenu\" ng-if=\"item.submenu\" ng-attr-data-name=\"{{item.name}}\"><li ng-repeat=\"item in ::item.submenu\" ng-include=\"\'templates/widgets/tree-menu/item.html\'\" ng-class=\"{\'open\':item.submenu && vm.isSubOpen(item), \'active\': vm.isActiveItem(item), \'hover\': $parent.ace.settings.hover, \'highlight\': $parent.ace.settings.highlight}\"></li></ul>');
$templateCache.put("templates/widgets/tree-menu/shortcuts.html",'<div class=\"sidebar-shortcuts-large\" id=\"sidebar-shortcuts-large\"><button class=\"btn btn-success\"><i class=\"ace-icon fa fa-signal\"></i></button> <button class=\"btn btn-info\"><i class=\"ace-icon fa fa-pencil\"></i></button> <button class=\"btn btn-warning\"><i class=\"ace-icon fa fa-users\"></i></button> <button class=\"btn btn-danger\"><i class=\"ace-icon fa fa-cogs\"></i></button></div><div class=\"sidebar-shortcuts-mini\" id=\"sidebar-shortcuts-mini\"><span class=\"btn btn-success\"></span> <span class=\"btn btn-info\"></span> <span class=\"btn btn-warning\"></span> <span class=\"btn btn-danger\"></span></div>');
$templateCache.put("templates/widgets/tree-menu/tree-menu.html",'<ul class=\"nav nav-list\"><!--ng-class=\"{active: vm.selected===item, open: vm.opened===item}\" --><li ng-repeat=\"item in vm.treeMenuItems\" ng-include=\"\'templates/widgets/tree-menu/item.html\'\" ng-class=\"{\'open\':item.submenu && vm.isSubOpen(item), \'active\': vm.isActiveItem(item), \'hover\': vm.hover, \'highlight\': vm.highlight}\" ng-click=\"vm.active(item)\"></li></ul>'); 
 }]); 
}).call(this);
/*!
 * ngToast v2.0.0 (http://tameraydin.github.io/ngToast)
 * Copyright 2016 Tamer Aydin (http://tamerayd.in)
 * Licensed under MIT (http://tameraydin.mit-license.org/)
 */

(function(window, angular, undefined) {
    'use strict';

    angular.module('ngToast.provider', [])
        .provider('ngToast', [
            function() {
                var messages = [],
                    messageStack = [];

                var defaults = {
                    animation: false,
                    className: 'success',
                    additionalClasses: null,
                    dismissOnTimeout: true,
                    timeout: 4000,
                    dismissButton: false,
                    dismissButtonHtml: '&times;',
                    dismissOnClick: true,
                    onDismiss: null,
                    compileContent: false,
                    combineDuplications: false,
                    horizontalPosition: 'right', // right, center, left
                    verticalPosition: 'top', // top, bottom,
                    maxNumber: 0,
                    newestOnTop: true
                };

                function Message(msg) {
                    var id = Math.floor(Math.random()*1000);
                    while (messages.indexOf(id) > -1) {
                        id = Math.floor(Math.random()*1000);
                    }

                    this.id = id;
                    this.count = 0;
                    this.animation = defaults.animation;
                    this.className = defaults.className;
                    this.additionalClasses = defaults.additionalClasses;
                    this.dismissOnTimeout = defaults.dismissOnTimeout;
                    this.timeout = defaults.timeout;
                    this.dismissButton = defaults.dismissButton;
                    this.dismissButtonHtml = defaults.dismissButtonHtml;
                    this.dismissOnClick = defaults.dismissOnClick;
                    this.onDismiss = defaults.onDismiss;
                    this.compileContent = defaults.compileContent;

                    angular.extend(this, msg);
                }

                this.configure = function(config) {
                    angular.extend(defaults, config);
                };

                this.$get = [function() {
                    var _createWithClassName = function(className, msg) {
                        msg = (typeof msg === 'object') ? msg : {content: msg};
                        msg.className = className;

                        return this.create(msg);
                    };

                    return {
                        settings: defaults,
                        messages: messages,
                        dismiss: function(id) {
                            if (id) {
                                for (var i = messages.length - 1; i >= 0; i--) {
                                    if (messages[i].id === id) {
                                        messages.splice(i, 1);
                                        messageStack.splice(messageStack.indexOf(id), 1);
                                        return;
                                    }
                                }

                            } else {
                                while(messages.length > 0) {
                                    messages.pop();
                                }
                                messageStack = [];
                            }
                        },
                        create: function(msg) {
                            msg = (typeof msg === 'object') ? msg : {content: msg};

                            if (defaults.combineDuplications) {
                                for (var i = messageStack.length - 1; i >= 0; i--) {
                                    var _msg = messages[i];
                                    var _className = msg.className || 'success';

                                    if (_msg.content === msg.content &&
                                        _msg.className === _className) {
                                        messages[i].count++;
                                        return;
                                    }
                                }
                            }

                            if (defaults.maxNumber > 0 &&
                                messageStack.length >= defaults.maxNumber) {
                                this.dismiss(messageStack[0]);
                            }

                            var newMsg = new Message(msg);
                            messages[defaults.newestOnTop ? 'unshift' : 'push'](newMsg);
                            messageStack.push(newMsg.id);

                            return newMsg.id;
                        },
                        success: function(msg) {
                            return _createWithClassName.call(this, 'success', msg);
                        },
                        info: function(msg) {
                            return _createWithClassName.call(this, 'info', msg);
                        },
                        warning: function(msg) {
                            return _createWithClassName.call(this, 'warning', msg);
                        },
                        danger: function(msg) {
                            return _createWithClassName.call(this, 'danger', msg);
                        }
                    };
                }];
            }
        ]);

})(window, window.angular);

(function(window, angular) {
    'use strict';

    angular.module('ngToast.directives', ['ngToast.provider'])
        .run(['$templateCache',
            function($templateCache) {
                $templateCache.put('ngToast/toast.html',
                    '<div class="ng-toast ng-toast--{{hPos}} ng-toast--{{vPos}} {{animation ? \'ng-toast--animate-\' + animation : \'\'}}">' +
                    '<ul class="ng-toast__list">' +
                    '<toast-message ng-repeat="message in messages" ' +
                    'message="message" count="message.count">' +
                    '<span ng-bind-html="message.content"></span>' +
                    '</toast-message>' +
                    '</ul>' +
                    '</div>');
                $templateCache.put('ngToast/toastMessage.html',
                    '<li class="ng-toast__message {{message.additionalClasses}}"' +
                    'ng-mouseenter="onMouseEnter()"' +
                    'ng-mouseleave="onMouseLeave()">' +
                    '<div class="alert alert-{{message.className}}" ' +
                    'ng-class="{\'alert-dismissible\': message.dismissButton}">' +
                    '<button type="button" class="close" ' +
                    'ng-if="message.dismissButton" ' +
                    'ng-bind-html="message.dismissButtonHtml" ' +
                    'ng-click="!message.dismissOnClick && dismiss()">' +
                    '</button>' +
                    '<span ng-if="count" class="ng-toast__message__count">' +
                    '{{count + 1}}' +
                    '</span>' +
                    '<span ng-if="!message.compileContent" ng-transclude></span>' +
                    '</div>' +
                    '</li>');
            }
        ])
        .directive('toast', ['ngToast', '$templateCache', '$log',
            function(ngToast, $templateCache, $log) {
                return {
                    replace: true,
                    restrict: 'EA',
                    templateUrl: 'ngToast/toast.html',
                    compile: function(tElem, tAttrs) {
                        if (tAttrs.template) {
                            var template = $templateCache.get(tAttrs.template);
                            if (template) {
                                tElem.replaceWith(template);
                            } else {
                                $log.warn('ngToast: Provided template could not be loaded. ' +
                                    'Please be sure that it is populated before the <toast> element is represented.');
                            }
                        }

                        return function(scope) {
                            scope.hPos = ngToast.settings.horizontalPosition;
                            scope.vPos = ngToast.settings.verticalPosition;
                            scope.animation = ngToast.settings.animation;
                            scope.messages = ngToast.messages;
                        };
                    }
                };
            }
        ])
        .directive('toastMessage', ['$timeout', '$compile', 'ngToast',
            function($timeout, $compile, ngToast) {
                return {
                    replace: true,
                    transclude: true,
                    restrict: 'EA',
                    scope: {
                        message: '=',
                        count: '='
                    },
                    controller: ['$scope', 'ngToast', function($scope, ngToast) {
                        $scope.dismiss = function() {
                            ngToast.dismiss($scope.message.id);
                        };
                    }],
                    templateUrl: 'ngToast/toastMessage.html',
                    link: function(scope, element, attrs, ctrl, transclude) {
                        element.attr('data-message-id', scope.message.id);

                        var dismissTimeout;
                        var scopeToBind = scope.message.compileContent;

                        scope.cancelTimeout = function() {
                            $timeout.cancel(dismissTimeout);
                        };

                        scope.startTimeout = function() {
                            if (scope.message.dismissOnTimeout) {
                                dismissTimeout = $timeout(function() {
                                    ngToast.dismiss(scope.message.id);
                                }, scope.message.timeout);
                            }
                        };

                        scope.onMouseEnter = function() {
                            scope.cancelTimeout();
                        };

                        scope.onMouseLeave = function() {
                            scope.startTimeout();
                        };

                        if (scopeToBind) {
                            var transcludedEl;

                            transclude(scope, function(clone) {
                                transcludedEl = clone;
                                element.children().append(transcludedEl);
                            });

                            $timeout(function() {
                                $compile(transcludedEl.contents())
                                (typeof scopeToBind === 'boolean' ?
                                    scope.$parent : scopeToBind, function(compiledClone) {
                                    transcludedEl.replaceWith(compiledClone);
                                });
                            }, 0);
                        }

                        scope.startTimeout();

                        if (scope.message.dismissOnClick) {
                            element.bind('click', function() {
                                ngToast.dismiss(scope.message.id);
                                scope.$apply();
                            });
                        }

                        if (scope.message.onDismiss) {
                            scope.$on('$destroy',
                                scope.message.onDismiss.bind(scope.message));
                        }
                    }
                };
            }
        ]);

})(window, window.angular);

(function(window, angular) {
    'use strict';

    angular
        .module('craft.widgets.toast', [
            'ngSanitize',
            'ngToast.directives',
            'ngToast.provider'
        ]);

})(window, window.angular);

(function () {
    angular.module('craft.widgets.treeMenu',[]).component('craftTreeMenu', {
        templateUrl: "templates/widgets/tree-menu/tree-menu.html",
        bindings: {
            data: '<',
            hover:'<',
            highlight:'<'
        },
        controller: ['$http', function ($http) {
            var vm = this;
            vm.$onInit = function () {
                console.log(vm.data);
                $http.get(vm.data)
                    .then(function (response) {
                        vm.treeMenuItems = response.data;
                        console.log(vm.treeMenuItems);
                    });
            };
            vm.active = function (item) {
                vm.selected = item;
            };

            vm.toggleSubmenu = function (item) {
                if (vm.opened == item) {
                    vm.opened = null;
                } else {
                    vm.opened = item;
                }
            };
            vm.isSubOpen = function(item) {
                if (vm.opened == item) return true;
                else return false;
            };
            vm.isActiveItem = function(item) {
                return vm.selected ===item;
            };
        }],
        controllerAs:'vm'
    });

}).call(this);
(function () {
    "use strict";
    angular.module("craft.widgets.TreeSelect", []);
    angular.module("craft.widgets.TreeSelect").directive('craftTreeSelect',treeSelect);
    function treeSelect() {
        return {
            templateUrl: function (elements, attributes) {
                return attributes.templateUrl || 'templates/widgets/tree-select.html';
            },
            restrict: 'E',
            scope: {
                leftree: '=',
                righttree: '=',
                showcolumn: "@"
            },
            controller: function ($scope) {
                $scope.selectItems = [];
                $scope.removeItems = [];

                $scope.select = function (item) {
                    var index = $scope.selectItems.indexOf(item);

                    if (index < 0) {
                        $scope.selectItems.push(item);
                    }
                    else {
                        $scope.selectItems.splice(index, 1);
                    }
                };

                $scope.remove = function (item) {
                    var index = $scope.removeItems.indexOf(item);

                    if (index < 0) {
                        $scope.removeItems.push(item);
                    }
                    else {
                        $scope.removeItems.splice(index, 1);
                    }
                };

                $scope.leftSelect = function () {

                    if ($scope.removeItems === undefined || $scope.removeItems.length === 0 )
                        return;

                    for (var i=0 ; i<$scope.removeItems.length ; i++) {
                        var route = [];

                        //将node 从右边tree中移除，并记录route
                        treeArrayRemove($scope.righttree, $scope.removeItems[i], route);

                        //将node 根据route加入左边的tree
                        treeArrayAdd($scope.lefttree, $scope.removeItems[i], route);
                    }

                    $scope.selectItems = [];
                    $scope.removeItems = [];
                };

                $scope.rightSelect = function () {

                    if ($scope.selectItems === undefined || $scope.selectItems.length === 0 )
                        return;

                    for (var i = 0; i<$scope.selectItems.length ; i++) {
                        var route = [];

                        //将node 从左边tree中移除，并记录route
                        treeArrayRemove($scope.lefttree, $scope.selectItems[i], route);

                        //将node 根据route加入右边的tree
                        treeArrayAdd($scope.righttree, $scope.selectItems[i], route);

                    }

                    $scope.selectItems = [];
                    $scope.removeItems = [];
                };

                $scope.rightAll = function () {
                    $scope.selectItems = [];
                    $scope.removeItems = [];

                    //将左边的树合并到右边
                    combineTreeArray($scope.lefttree, $scope.righttree);
                    $scope.lefttree = [];
                };


                $scope.leftAll = function () {
                    $scope.selectItems = [];
                    $scope.removeItems= [];

                    //将右边的树合并到左边
                    combineTreeArray($scope.righttree, $scope.lefttree);
                    $scope.righttree = [];
                };

                var combineTreeArray = function (treeadd, originalTree) {
                    if (treeadd === undefined || treeadd === null)
                        return;
                    if (originalTree === undefined || originalTree === null)
                        return;

                    for (var i = 0; i < treeadd.length; i++) {
                        var treeroot = treeadd[i];
                        //将treeroot加入originalTree中
                        var find = false;
                        for (var j = 0; j < originalTree.length; j++) {
                            if (treeroot.id === originalTree[j].id) {
                                combineTreeArray(treeroot.children, originalTree[j].children);
                                find = true;
                                break;
                            }
                        }
                        if (!find) {
                            originalTree.push(treeroot);
                        }

                    }
                };

                var treeArrayRemove = function (treearray, node, route) {
                    //搜索每个tree array的元素，改元素本身是个tree
                    for (var i = 0; i < treearray.length; i++) {
                        var result = treeRemove(treearray[i], node, route);
                        if (result) {
                            //判断是否需要删除children
                            if (treearray[i].children.length === 0) {
                                treearray.splice(i, 1);
                            }
                            return true;
                        }
                    }
                };

                var treeArrayAdd = function (treearray, node, route) {
                    var topNode = route.pop();

                    //搜索每个tree array的元素，看是否已有route中的第一个node
                    for (var i = 0; i < treearray.length; i++) {
                        if (treearray[i].id === topNode.id) {
                            treeAdd(treearray[i], node, route);
                            return;
                        }
                    }

                    //都没有的情况下增加新的父节点
                    var tree = angular.copy(topNode);
                    tree.children = [];
                    treearray.push(tree);
                    treeAdd(tree, node, route);
                };

                var treeAdd = function (tree, node, route) {
                    if (route.length === 0) {
                        tree.children.push(node);
                        return;
                    }

                    //继续根据parentNode向下走
                    var parentNode = route.pop();

                    for (var i = 0; i < tree.children.length; i++) {
                        if (tree.children[i].id === parentNode.id) {
                            treeAdd(tree.children[i], node, route);
                            return;
                        }
                    }

                    //都没有的情况下增加
                    var newtreeNode = angular.copy(parentNode);
                    newtreeNode.children = [];
                    tree.children.push(newtreeNode);
                    treeAdd(newtreeNode, node, route);
                };

                var treeRemove = function (tree, node, route) {
                    //查找每个children
                    if (tree.children === undefined)
                        return false;

                    for (var i = 0; i < tree.children.length; i++) {
                        //当前children中找到了
                        if (tree.children[i].id === node.id) {
                            //从children中移除该node
                            tree.children.splice(i, 1);

                            //记录下route
                            route.push(tree);
                            return true;
                        }

                        //如果该child非子节点，继续递归查找
                        if (tree.children[i].children !== undefined) {
                            var result = treeRemove(tree.children[i], node, route);
                            //判断是否需要删除children
                            if(result&&tree.children[i].children.length === 0){
                                tree.children.splice(i, 1);
                            }
                            if (result) {
                                route.push(tree);
                                return true;
                            }
                            return false;
                        }
                    }

                    return false;
                };
                $scope.show = function (item) {
                    if ($scope.showcolumn === undefined || $scope.showcolumn === null)
                        return item;
                    return item[$scope.showcolumn];
                };
            },
            link: function (scope, element, attr) {
            }
        };
    }

}).call(this);
(function () {
    angular.module('craft.widgets', [
        'craft.widgets.dataGrid',
        'craft.widgets.dynamicForm',
        'craft.widgets.FieldRender',
        'craft.widgets.listViewer',
        'craft.widgets.treeMenu',
        'craft.widgets.templates',
        'craft.widgets.toast',
        'craft.widgets.TreeSelect',
        'craft.widgets.MultiSelect',
    ]);
}).call(this);