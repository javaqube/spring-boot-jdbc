(function () {
    'use strict';
    /**
     * ========================================================================
     * ConfigService
     * ========================================================================
     */
    angular.module('craft.api.config',[]).factory('ConfigService', ConfigServiceFunc);
    ConfigServiceFunc.$inject = ['$templateCache'];
    function ConfigServiceFunc($templateCache) {
        var ConfigService=angular.extend({});
        ConfigService.getAppConfig=function () {
            return $templateCache.get("meta/app-config.json");
        };

        return ConfigService;
    }
}).call(this);
(function () {
    'use strict';
    /**
     * ========================================================================
     * DownloadService
     * ========================================================================
     */
    angular.module('craft.api.download',[]).factory('DownloadService', DownloadServiceFun);
    DownloadServiceFun.$inject=[];
    function DownloadServiceFun(){
        var downloadService = angular.extend({});
        downloadService.strMimeType = 'application/octet-stream;charset=utf-8';
        downloadService.setMimeType = function (mimeType) {
            this.strMimeType = mimeType;
        };

        downloadService.isIE = function () {
            var match = navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
            return match ? parseInt(match[1]) : false;
        };
        downloadService.isSafari = function () {
            var match = navigator.userAgent.match('(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?.*Safari/');
            return match ? parseInt(match[2]) : false;
        };
        downloadService.downloadFile = function (fileName, content) {
            var D = document;
            var a = D.createElement('a');
            var rawFile;
            var ieVersion;

            ieVersion = this.isIE();
            if (ieVersion && ieVersion < 10) {
                var frame = D.createElement('iframe');
                document.body.appendChild(frame);

                frame.contentWindow.document.open("text/html", "replace");
                frame.contentWindow.document.write('sep=,\r\n' + content);
                frame.contentWindow.document.close();
                frame.contentWindow.focus();
                frame.contentWindow.document.execCommand('SaveAs', true, fileName);

                document.body.removeChild(frame);
                return true;
            }

            // IE10+
            if (navigator.msSaveBlob) {
                return navigator.msSaveBlob(
                    new Blob([content], {
                        type: this.strMimeType
                    }),
                    fileName
                );
            }

            //html5 A[download]
            if ('download' in a) {
                var blob = new Blob(
                    [content], {
                        type: this.strMimeType
                    }
                );
                rawFile = URL.createObjectURL(blob);
                a.setAttribute('download', fileName);
            } else {
                rawFile = 'data:' + this.strMimeType + ',' + encodeURIComponent(content);
                a.setAttribute('target', '_blank');
            }

            a.href = rawFile;
            a.setAttribute('style', 'display:none;');
            D.body.appendChild(a);
            setTimeout(function () {
                if (a.click) {
                    a.click();
                    // Workaround for Safari 5
                } else if (document.createEvent) {
                    var eventObj = document.createEvent('MouseEvents');
                    eventObj.initEvent('click', true, true);
                    a.dispatchEvent(eventObj);
                }
                D.body.removeChild(a);
            }, this.delay);
        };

        return downloadService;
    }
}).call(this);
(function(angular, window){
    'use strict';
    angular.module('craft.api.cap', ['craft.api.config','craft.api.download','craft.api.http.cap','craft.api.crud.cap']);

})(angular, window);
(function () {
    'use strict';
    angular.module('craft.api.crud.cap', []);
    angular.module('craft.api.crud.cap').factory('CrudService', CrudServiceFun);
    CrudServiceFun.$inject = [ 'HttpService', 'ConfigService' ];
    function CrudServiceFun(HttpService, ConfigService) {
        var CrudService = angular.extend({});
        CrudService.list = function (repoName) {
            var url = ConfigService.getAppConfig().RootPath + '/repository/' + repoName + "/findAll";
            return HttpService.get(url);
        };
        CrudService.find = function (repoName, id) {
            //var formData = new Array(id);
            var params = 'params=[' + JSON.stringify(id) + ']';
            var url = ConfigService.getAppConfig().RootPath + '/repository/' + repoName + "/findById?" + params;
            return HttpService.get(url);
        };
        /**
         * findByCriteria
         * @param repoName
         * @param method
         * @param params: [1,2,3,"test"]
         * @returns {*}
         */
        CrudService.findByCriteria = function (repoName, method, params) {
            var url = ConfigService.getAppConfig().RootPath + '/repository/' + repoName
                + "/" + (method ? method : 'findAll')
                + (params ? '?params=' + params  : '');
            return HttpService.get(url, false);
        };
        /**
         * findByCriteriaPageable
         * @param repoName : newsRepository
         * @param method : findAll
         * @param params: [1,2,3,"test"]
         * @param pageSize : 10
         * @param pageIndex : 0
         * @param sortFields: [{field:'field1', type:cffex.repository.SORT_TYPE_ASC},{...},...]
         * @returns {*}
         */
        CrudService.findByCriteriaPageable = function (repoName, method, pageSize, pageIndex, params, sortFields) {
            var url = ConfigService.getAppConfig().RootPath + '/repository/' + repoName
                + "/" + (method ? method : 'findAll')
                + "/" + pageSize + "/" + pageIndex
                + (params ? '?params=' + params : '')
                + (sortFields ? '&sort=' + sortFields : '');
            return HttpService.get(url, false);
        };
        CrudService.update = function (repoName, id, formData) {
            var url = ConfigService.getAppConfig().RootPath + '/repository/' + repoName + '/' + id;
            var params = 'params=' + JSON.stringify(formData);
            return HttpService.post(url, formData);
        };
        CrudService.create = function (repoName, formData) {
            var url = ConfigService.getAppConfig().RootPath + '/repository/' + repoName;
            return HttpService.put(url, formData);
        };
        CrudService.delete = function (repoName, id) {
            // var params = 'params=[' + JSON.stringify(id)+']';
            var url = ConfigService.getAppConfig().RootPath + '/repository/' + repoName + "/" + id;
            return HttpService.delete(url);
        };
        CrudService.service = function (serviceName, funcName) {
            var url = ConfigService.getAppConfig().RootPath + '/service/' + serviceName + "/" + funcName;
            var data = new Array();
            var argsCount = arguments.length;
            for (var i = 2; i < argsCount; i++) {
                data.push(arguments[i]);
            }
            var params = 'params=' + JSON.stringify(data);
            return HttpService.post(url, params);
        };

        return CrudService;
    }
}).call(this);


(function () {
    'use strict';
    angular.module('craft.api.http.cap', []).factory('HttpService', HttpServiceFunc);
    HttpServiceFunc.$inject = ['$q', '$http' ];
    function HttpServiceFunc($q, $http) {
        var HttpService = angular.extend({});
        HttpService.get = function (url, useCache) {
            //console.log("url=" + url);
            var promise = $http({
                method: 'GET',
                url: url,
                cache: useCache ? useCache : false
            });

            return this.handlePromise(promise);
        };
        HttpService.post = function (url, formData) {
            var promise = $http({
                withCredentials: true,//in order to send cookie with CORS requests.
                method: 'POST',
                url: url,
                data: formData
            });

            return this.handlePromise(promise);
        };
        HttpService.put = function (url, formData) {
            var promise = $http({
                method: 'PUT',
                url: url,
                data: formData
            });
            return this.handlePromise(promise);
        };
        HttpService.delete = function (url) {
            var promise = $http({
                method: 'DELETE',
                url: url
            });
            return this.handlePromise(promise);
        };

        HttpService.handlePromise = function (promise) {
            var deferred = $q.defer();
            promise.success(function (response, status, headers, config) {
                if (response.errorCode === "0") {
                    console.log("response data===========================");
                    console.log(response);
                    console.log("response data===========================");
                    deferred.resolve(response.data);
                } else {
                    console.log("response data===========================");
                    console.log(response);
                    console.log("response data===========================");
                    deferred.reject(response.errorMsg);
                }
            }).error(function (response, status, headers, config) {
                console.log("response data===========================");
                console.log(response);
                console.log("response data===========================");
                deferred.reject("request error with :" + status);
            });
            return deferred.promise;
        };
        return HttpService;
    }
}).call(this);