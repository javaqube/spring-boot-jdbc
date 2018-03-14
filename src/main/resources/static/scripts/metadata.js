(function () {
    angular.module('metadata', []).run(['$templateCache', function ($templateCache) {
        $templateCache.put("meta/app-config.json",{
            RootPath:'http://localhost:9000',
            authTokenName:"JWT-TOKEN"
        });

        $templateCache.put("meta/app-module-config.json",{
            "report-list": {
                "repo": "report",
                "ctrl": "ReportCtrl",
                "tpl": "views/list.html",
                "modules": [{name:"ReportCtrl",
                    files: ['scripts/controllers/report-controller.js']
                }]
            },

            "data-source-list": {
                "repo": "reportDataSource",
                "ctrl": "DataSourceCtrl",
                "tpl": "views/list.html",
                "modules": [{name:"DataSourceCtrl",
                    files: ['scripts/controllers/data-source-controller.js']
                }]
            },
            "dict-list": {
                "repo": "dictionary",
                "ctrl": "DictCtrl",
                "tpl": "views/list.html",
                "modules": [{name:"DictCtrl",
                    files: ['scripts/controllers/dict-controller.js']
                }]
            },
            "form-designer-list": {
                "repo": "forms",
                "ctrl": "FormDesignerCtrl",
                "tpl": "views/list.html",
                "modules": [{name:'FormDesignerCtrl',
                    files: ['scripts/controllers/form-designer-controller.js']
                }]
            },

            "dict-detail": {
                "repo": "dictionary",
                "findMethod": "findById",
                "ctrl": "DictCtrl",
                "tpl": "views/form-view/dynamic-form.html",
                "modules": [{name:"DictCtrl",
                    files: ['scripts/controllers/dict-controller.js']
                }]
            },

            "report-detail": {
                "repo": "report",
                "ctrl": "ReportCtrl",
                "tpl": "views/form-view/report-designer.html",
                "modules": [{
                    files: ['scripts/controllers/report-controller.js']
                }, 'ReportDesigner'
                ]
            },

            "data-source-detail": {
                "repo": "reportDataSource",
                "ctrl": "DataSourceCtrl",
                "tpl": "views/form-view/dynamic-form.html",
                "modules": [{
                    files: ['scripts/controllers/data-source-controller.js']
                }]
            },

            "form-designer-detail": {
                "repo": "forms",
                "ctrl": "FormDesignerCtrl",
                "tpl": "views/form-view/form-designer.html",
                "modules": [{
                    files: ['scripts/controllers/form-designer-controller.js']
                }]
            },
            "Line-chart":{
                "ctrl": "LineChartCtrl",
                "tpl": "views/charts-template.html",
                "modules": [{
                    files: ['scripts/controllers/chart/line-chart-controller.js']
                }]
            },
            "Bar-chart":{
                "ctrl": "BarChartCtrl",
                "tpl": "views/charts-template.html",
                "modules": [{
                    files: ['scripts/controllers/chart/bar-chart-controller.js']
                }]
            },
            "Pie-chart":{
                "ctrl": "PieChartCtrl",
                "tpl": "views/charts-template.html",
                "modules": [{
                    files: ['scripts/controllers/chart/pie-chart-controller.js']
                }]
            },
            "Radar-chart":{
                "ctrl": "RadarChartCtrl",
                "tpl": "views/charts-template.html",
                "modules": [{
                    files: ['scripts/controllers/chart/radar-chart-controller.js']
                }]
            },
            "Polar-chart":{
                "ctrl": "PolarChartCtrl",
                "tpl": "views/charts-template.html",
                "modules": [{
                    files: ['scripts/controllers/chart/polar-chart-controller.js']
                }]
            },
            "Doughnut-chart":{
                "ctrl": "DoughnutChartCtrl",
                "tpl": "views/charts-template.html",
                "modules": [{
                    files: ['scripts/controllers/chart/doughnut-chart-controller.js']
                }]
            },
            "uib-modules": {
                "wizard": {
                    files: ['scripts/controllers/uib/wizard-controller.js', '../bower_components/angular-wizard/dist/angular-wizard.js']
                },
                "accordion": {
                    files: ['scripts/controllers/uib/AccordionDemoCtrl.js']
                },
                "alert": {
                    files: ['scripts/controllers/uib/AlertDemoCtrl.js']
                },
                "buttons": {
                    files: ['scripts/controllers/uib/ButtonsDemoCtrl.js']
                },
                "carousel": {
                    files: ['scripts/controllers/uib/CarouselDemoCtrl.js']
                },
                "collapse": {
                    files: ['scripts/controllers/uib/CollapseDemoCtrl.js']
                },
                "DateParser": {
                    files: ['scripts/controllers/uib/DateParserDemoCtrl.js']
                },
                "Datepicker": {
                    files: ['scripts/controllers/uib/DatepickerDemoCtrl.js']
                },
                "DatepickerPopup": {
                    files: ['scripts/controllers/uib/DatepickerPopupDemoCtrl.js']
                },
                "Dropdown": {
                    files: ['scripts/controllers/uib/DropdownCtrl.js']
                },
                "modal": {
                    files: ['scripts/controllers/uib/ModalDemoCtrl.js']
                },
                "pager": {
                    files: ['scripts/controllers/uib/PagerDemoCtrl.js']
                },
                "pagination": {
                    files: ['scripts/controllers/uib/PaginationDemoCtrl.js']
                },
                "popover": {
                    files: ['scripts/controllers/uib/PopoverDemoCtrl.js']
                },
                "position": {
                    files: ['scripts/controllers/uib/PositionDemoCtrl.js']
                },
                "Progress": {
                    files: ['scripts/controllers/uib/ProgressDemoCtrl.js']
                },
                "rating": {
                    files: ['scripts/controllers/uib/RatingDemoCtrl.js']
                },
                "rating": {
                    files: ['scripts/controllers/uib/RatingDemoCtrl.js']
                },
                "tabs": {
                    files: ['scripts/controllers/uib/TabsDemoCtrl.js']
                },
                "timepicker": {
                    files: ['scripts/controllers/uib/TimepickerDemoCtrl.js']
                },
                "tooltip": {
                    files: ['scripts/controllers/uib/TooltipDemoCtrl.js']
                },
                "typeahead": {
                    files: ['scripts/controllers/uib/TypeaheadCtrl.js']
                },
                "tables": {
                    files: [
                        '../bower_components/jquery/dist/jquery.js',
                        '../bower_components/datatables/media/js/jquery.dataTables.js',
                        '../bower_components/datatables/media/js/dataTables.bootstrap.js',
                        '../bower_components/angular-datatables/dist/angular-datatables.js',
                        'scripts/controllers/uib/table-controller.js',
                    ]
                }

            }
        });

        $templateCache.put("meta/form-designer-list.json",{
            "repo":"forms",
            "columns": [
                {"name": "id", "label": "ID", "sort": "id"},
                {"name": "formName", "label": "表单名称", "sort": "formName"}
            ],
            "topButtons": [
                {
                    "callback": "new",
                    "params": {"docName":"form-designer"},
                    "label": "添加",
                    "class": "btn btn-sm btn-primary",
                    "icon": "glyphicon glyphicon-plus-sign"
                }
            ],
            "inlineButtons": [
                {
                    "callback": "edit",
                    "label": "编辑",
                    "class": "btn btn-xs btn-primary",
                    "icon": "glyphicon glyphicon-edit"
                },
                {
                    "callback": "preview",
                    "label": "预览",
                    "class": "btn btn-xs btn-info",
                    "icon": "glyphicon glyphicon-signal"
                },
                {
                    "callback": "delete",
                    "label": "删除",
                    "class": "btn btn-xs btn-danger",
                    "icon": "glyphicon glyphicon-trash"
                }
            ]
        });
        $templateCache.put("meta/report-list.json",{
            "repo":"report",
            "columns": [
                // {"type":"checkbox","name": "id","model":"selectedIds"},
                {"name": "id", "label": "ID", "sort": "id"},
                {"name": "reportName", "label": "报表名称", "sort": "reportName"}
            ],
            "topButtons": [
                {
                    "callback": "export",
                    "params": {"docName":"report"},
                    "label": "导出",
                    "class": "btn btn-sm btn-primary",
                    "icon": "glyphicon glyphicon-export"
                },
                {
                    "callback": "import",
                    "params": {"docName":"report"},
                    "label": "导入",
                    "class": "btn btn-sm btn-primary",
                    "icon": "glyphicon glyphicon-import"
                },
                {
                    "callback": "new",
                    "params": {"docName":"report"},
                    "label": "添加",
                    "class": "btn btn-sm btn-primary",
                    "icon": "glyphicon glyphicon-plus-sign"
                }
            ],
            "inlineButtons": [
                {
                    "callback": "edit",
                    "label": "编辑",
                    "class": "btn btn-xs btn-primary",
                    "icon": "glyphicon glyphicon-edit"
                },
                {
                    "callback": "preview",
                    "label": "预览",
                    "class": "btn btn-xs btn-info",
                    "icon": "glyphicon glyphicon-signal"
                },
                {
                    "callback": "delete",
                    "label": "删除",
                    "class": "btn btn-xs btn-danger",
                    "icon": "glyphicon glyphicon-trash"
                }
            ]
        });
        $templateCache.put("meta/data-source-list.json",{
            "repo":"reportDataSource",
            "columns": [
                {"name": "id", "label": "ID", "sort": "id"},
                {"name": "name", "label": "数据源名称", "sort": "name"}
            ],
            "topButtons": [
                {
                    "callback": "export",
                    "params": {"docName":"data-source"},
                    "label": "导出",
                    "class": "btn btn-sm btn-primary",
                    "icon": "glyphicon glyphicon-export"
                },
                {
                    "callback": "import",
                    "params": {"docName":"data-source"},
                    "label": "导入",
                    "class": "btn btn-sm btn-primary",
                    "icon": "glyphicon glyphicon-import"
                },
                {
                    "callback": "new",
                    "params": {"docName":"data-source"},
                    "label": "添加",
                    "class": "btn btn-sm btn-primary",
                    "icon": "glyphicon glyphicon-plus-sign"
                }
            ],
            "inlineButtons": [
                {
                    "callback": "edit",
                    "label": "编辑",
                    "class": "btn btn-xs btn-primary",
                    "icon": "glyphicon glyphicon-edit"
                },
                {
                    "callback": "delete",
                    "label": "删除",
                    "class": "btn btn-xs btn-danger",
                    "icon": "glyphicon glyphicon-trash"
                }
            ]
        });
        $templateCache.put("meta/dict-list.json",{
            "repo": "dictionary",
            "columns": [
                {"name": "id", "label": "ID", "sort": "id"},
                {"name": "name", "label": "字典名称", "sort": "name"}
            ],
            "topButtons": [
                {
                    "callback": "export",
                    "params": {"docName":"dict"},
                    "label": "导出",
                    "class": "btn btn-sm btn-primary",
                    "icon": "glyphicon glyphicon-export"
                },
                {
                    "callback": "import",
                    "params": {"docName":"dict"},
                    "label": "导入",
                    "class": "btn btn-sm btn-primary",
                    "icon": "glyphicon glyphicon-import"
                },
                {
                    "callback": "new",
                    "params": {"docName":"dict"},
                    "label": "添加",
                    "class": "btn btn-sm btn-primary",
                    "icon": "glyphicon glyphicon-plus-sign"
                }
            ],
            "inlineButtons": [
                {
                    "callback": "edit",
                    "label": "编辑",
                    "class": "btn btn-xs btn-primary",
                    "icon": "glyphicon glyphicon-edit"
                },
                {
                    "callback": "delete",
                    "label": "删除",
                    "class": "btn btn-xs btn-danger",
                    "icon": "glyphicon glyphicon-trash"
                }
            ]
        });

        $templateCache.put("meta/dict-detail.json",{
            "name": "dictForm",
            "title": "字典信息",
            "fields": [
                {"type": "textfield", "name": "name", "label": "字典名称", "validator": ["required"]},
                {"type": "dropdown", "name": "type", "label": "类型", "validator": ["required"],
                    "options":{
                        "Dictionary":"1",
                        "HintSearch":"2"
                    }},
                {"type": "service", "name": "dataSourceName", "label": "数据源", "validator": ["required"],
                    "service":"http://localhost:9000/service/dataSourceService/getAllDataSource",
                    "optionLabel":"name","optionValue":"name"},

                {"type": "textarea", "name": "sql", "label": "查询语句", "validator": ["required"]},

                {"type": "textfield", "name": "realColumn", "label": "值列", "validator": ["required"],"hideFunc":"hideDictionary"},
                {"type": "textfield", "name": "displayColumn", "label": "显示列", "validator": ["required"],"hideFunc":"hideDictionary"},
                {"type": "textfield", "name": "limitCount", "label": "联想长度", "validator": ["required"],"hideFunc":"hideHintSearch"}
            ],
            "formButtons":[
                // {
                //     "callback": "save",
                //     "label": "保存",
                //     "class": "btn btn-sm btn-primary",
                //     "icon": "glyphicon glyphicon-ok"
                // },
                // {
                //     "callback": "cancel",
                //     "label": "取消",
                //     "class": "btn btn-sm btn-grey",
                //     "icon": "glyphicon glyphicon-remove"
                // }
            ]
        });
        $templateCache.put("meta/data-source-detail.json",{
            "name": "dataSourceForm",
            "title": "数据源信息",
            "fields": [
                {"type": "textfield", "name": "name", "label": "Name", "validator": ["required"]},
                {"type": "dropdown", "name": "driverType", "label": "driverType",
                    "options":{
                        "MySQL":"MySQL",
                        "Oracle":"Oracle",
                        "SqlServer":"SqlServer",
                        "Sybase":"Sybase",
                        "DB2":"DB2",
                        "PostgreSql":"PostgreSql"
                    },
                    "validator": ["required"]},
                {"type": "textfield", "name": "driverClass", "label": "driverClass", "validator": ["required"]},
                {"type": "textfield", "name": "host", "label": "host", "validator": ["required"]},
                {"type": "textfield", "name": "port", "label": "port", "validator": ["required"]},
                {"type": "textfield", "name": "schema", "label": "schema", "validator": ["required"]},
                {"type": "textfield", "name": "jdbcUrl", "label": "jdbcUrl", "validator": ["required"]},
                {"type": "textfield", "name": "user", "label": "username", "validator": ["required"]},
                {"type": "textfield", "name": "password", "label": "password", "validator": ["required"]}
            ],
            "formButtons":[
                {
                    "callback": "testConnection",
                    "params": {"docName":"dict"},
                    "label": "测试链接",
                    "class": "btn btn-sm btn-primary",
                    "icon": "glyphicon glyphicon-ok"
                },
                // {
                //     "callback": "save",
                //     "params": {"docName":"dict"},
                //     "label": "保存",
                //     "class": "btn btn-sm btn-primary",
                //     "icon": "glyphicon glyphicon-ok"
                // },
                // {
                //     "callback": "cancel",
                //     "params": {"docName":"dict"},
                //     "label": "取消",
                //     "class": "btn btn-sm btn-grey",
                //     "icon": "glyphicon glyphicon-remove"
                // }
            ]
        });
    }]);
}).call(this);