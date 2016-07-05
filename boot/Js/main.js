/**
 * Created by Administrator on 2016/4/22.
 */
app=angular.module('myApp',['ui.bootstrap','ngCookies']);
app.factory('getresService',function($http){
    var doRequest=function(getUrl){
        return $http({
            method: 'JSON',
            url: getUrl
        });
    };
    return {
        programs: function(getUrl) { return doRequest(getUrl); }
    };
});
app.factory('saveService',function($http){
    var doRequest=function(getUrl,data){
        return $http({
            method  : 'POST',
            url     : getUrl,
            params : data
        });
    };
    return {
        program: function(getUrl,data) { return doRequest(getUrl,data);}
    };
});
app.controller('loginController',function($scope,saveService,$cookieStore,$window){
    $scope.sendLogin=function(){
        localerr = $scope.checkname($scope.username);
        if(localerr!==true) { $scope.username_error=localerr; return; }
        else
            $scope.username_error=false;
        localerr = $scope.checkPassword($scope.password);
        if(localerr!==true) { $scope.password_error=localerr; return; }
        else
            $scope.password_error=false;
        var formData={
            username:$scope.username,
            password:$scope.password

        };
        saveService.program('main.php?type=login',formData)
            .success(function(data){
                if(data.isLog==1){
                    $cookieStore.put('for_tools_users_name',data.username);
                    $cookieStore.put('for_tools_users_id',data.id);
                    $cookieStore.put('for_tools_users_state',data.state);
                    $window.location.href="main.html";
                }else if(data.isLog==0){
                    $scope.password_error="密码错误";
                    return;
                }else if(data.isLog==2){
                    $scope.password_error="用户不存在";
                    return;
                }
            }
        );
    };
    $scope.checkname=function(data){
        if(data==''||data==undefined){
            return "用户名不能为空";
        }
        return true;
    };
    $scope.checkPassword=function(data){
        if(data==''||data==undefined){
            return "密码不能为空";
        }
        return true;
    };
});

app.controller('registerController',function($scope,saveService,getresService,$window){
    getresService.programs('main.php?type=users')
        .success(function(data){
            $scope.users=new Array();
            for(ii=0;ii<data.length;ii++) {
                $scope.users.push(data[ii]);
            }
        });
    $scope.sendRegister=function(){
        localerr = $scope.checkname($scope.username);
        if(localerr!==true) { $scope.username_error=localerr; return; }
        else
            $scope.username_error=false;
        localerr = $scope.checkPassword($scope.password);
        if(localerr!==true) { $scope.password_error=localerr; return; }
        else
            $scope.password_error=false;
        localerr = $scope.checkSure($scope.sure);
        if(localerr!==true) { $scope.sure_error=localerr; return; }
        else
            $scope.sure_error=false;
        var formData={
            username:$scope.username,
            password:$scope.password

        };
        saveService.program('main.php?type=register',formData)
            .success(function(data){
                if(data==1){
                    $window.location.href="index.html";
                }else{
                    $scope.sure_error="注册失败";
                    return;
                }
            }
        );
    };
    $scope.checkname=function(data){
        if(data==''||data==undefined){
            return "用户名不能为空";
        }
        for(ii=0; ii<$scope.users.length;ii++)
        {
            if(data == $scope.users[ii].username )
                return "用户名已经存在";
        }
        return true;
    };
    $scope.checkPassword=function(data){
        if(data==''||data==undefined){
            return "密码不能为空";
        }
        return true;
    };
    $scope.checkSure=function(data){
        if(data==''||data==undefined){
            return "确认密码不能为空";
        }else if(data!==$scope.password){
            return "确认密码和密码不一致";
        }
        return true;
    }
});
app.controller('rootController',function($scope,saveService,$cookieStore,getresService,$window){
    if($cookieStore.get('for_tools_users_name')==''||$cookieStore.get('for_tools_users_name')==undefined){
        alert('请登录');
        $window.location.href="index.html";
        return;
    }
    $scope.admin=$cookieStore.get('for_tools_users_name');
    $scope.logout=function(){
        $cookieStore.remove('for_tools_users_name');
        $cookieStore.remove('for_tools_users_id');
        $cookieStore.remove('for_tools_users_state');
        $window.location.href="index.html";
    }
});
app.controller('applyController',function($scope,saveService,$cookieStore,getresService,$window){

    $scope.userID=$cookieStore.get('for_tools_users_id');
    if($scope.userID==''||$scope.userID==undefined){
        alert('请重新登录');
        $window.location.href="index.html";
    };
    getresService.programs('../main.php?type=tools')
        .success(function(data){
            $scope.modulelists=new Array();
            for(ii=0;ii<data.length;ii++) {
                $scope.modulelists.push(data[ii]);
            }
        });
    $scope.saveApply=function(){
        var formData={
            userid:$scope.userID,
            proposer:$scope.proposer,
            tel:$scope.tel,
            module:$scope.module,
            versions:$scope.versions,
            mac:$scope.mac,
            address:$scope.address,
            endtime:$scope.endtime
        };
        saveService.program('../main.php?type=apply',formData)
            .success(function(data){
                if(data==1){
                    $window.location.href="../Role/index.html";
                }else{
                    $scope.sure_error="提交申请失败";
                    return;
                }
            }
        );
    }
});
app.controller('listController',function($scope,saveService,$cookieStore,getresService,$window,$modal,$filter){
    $scope.rule=$cookieStore.get('for_tools_users_state');
    if($cookieStore.get('for_tools_users_state')!=="0"){//state=1 is admin
        getresService.programs('../main.php?type=list')
            .success(function(data){
                $scope.datas=new Array();
                for(ii=0;ii<data.length;ii++) {
                                    $scope.datas.push(data[ii]);
                 }
                $scope.search($scope.datas);
            });
    }else{
        getresService.programs('../main.php?type=list&uid='+$cookieStore.get('for_tools_users_id'))
            .success(function(data){
                $scope.datas=new Array();
                for(ii=0;ii<data.length;ii++) {
                    $scope.datas.push(data[ii]);
                }
                $scope.search($scope.datas);
            });
    }
    var sortingOrder = 'name';
    $scope.sortingOrder = sortingOrder;
    $scope.reverse = false;
    $scope.filteredItems = new Array();
    $scope.groupedItems = new Array();
    $scope.itemsPerPage = 10;
    $scope.pagedItems = new Array();
    $scope.currentPage = 0;
   // $scope.items = $scope.datas;
    var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };
    // init the filtered items
    $scope.search = function (data) {
        $scope.filteredItems = $filter('filter')(data, function (item) {
            for(var attr in item) {
                //alert(attr);
                if (searchMatch(item[attr], $scope.query))
                    return true;
            }
            return false;
        });
        // take care of the sorting order
        if ($scope.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };
    // calculate page in place
    $scope.groupToPages = function () {
        $scope.pagedItems = new Array();
        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };
    $scope.range = function (start, end) {
        var ret = [];
        if (!end) {
            end = start;
            start = 0;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        return ret;
    };

    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    // functions have been describe process the data for display
     //$scope.search();
    // change sorting order
    $scope.sort_by = function(newSortingOrder) {
        if ($scope.sortingOrder == newSortingOrder)
            $scope.reverse = !$scope.reverse;
        $scope.sortingOrder = newSortingOrder;
        // icon setup
        $('th i').each(function(){
            // icon reset
            $(this).removeClass().addClass('icon-sort');
        });
        if ($scope.reverse)
            $('th.'+new_sorting_order+' i').removeClass().addClass('icon-chevron-up');
        else
            $('th.'+new_sorting_order+' i').removeClass().addClass('icon-chevron-down');
    };
    $scope.select=function(){
        if($cookieStore.get('for_tools_users_state')!=="0"){//state=1 is admin
            getresService.programs('../main.php?type=list')
                .success(function(data){
                    if($scope.state==2||$scope.state==undefined){
                        $scope.datas=new Array();
                        for(ii=0;ii<data.length;ii++) {
                            $scope.datas.push(data[ii]);
                        }
                        $scope.search($scope.datas);
                    }
                    if($scope.state==1){
                        $scope.datas=new Array();
                        for(ii=0;ii<data.length;ii++) {
                            if(data[ii].state==1){
                                $scope.datas.push(data[ii]);
                            }
                        }
                        $scope.search($scope.datas);
                    }
                    if($scope.state==0){
                        $scope.datas=new Array();
                        for(ii=0;ii<data.length;ii++) {
                            if(data[ii].state==0){
                                $scope.datas.push(data[ii]);
                            }
                        }
                        $scope.search($scope.datas);
                    }

                });
        }else{
            getresService.programs('../main.php?type=list&uid='+$cookieStore.get('for_tools_users_id'))
                .success(function(data){
                   // $scope.datas=new Array();
                    if($scope.state==2||$scope.state==undefined){
                        $scope.datas=new Array();
                        for(ii=0;ii<data.length;ii++) {
                            $scope.datas.push(data[ii]);
                        }
                        $scope.search($scope.datas);
                    }
                    if($scope.state==1){
                        $scope.datas=new Array();
                        for(ii=0;ii<data.length;ii++) {
                            if(data[ii].state==1){
                                $scope.datas.push(data[ii]);
                            }
                        }
                        $scope.search($scope.datas);
                    }
                    if($scope.state==0){
                        $scope.datas=new Array();
                        for(ii=0;ii<data.length;ii++) {
                            if(data[ii].state==0){
                                $scope.datas.push(data[ii]);
                            }
                        }
                        $scope.search($scope.datas);
                    }
                });
        }
    };
    $scope.showDetail=function(id){
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'showDetail.html',
            controller: 'showDetailController',
            size: '',
            resolve: {
                ID:function(){
                    return id;
                }
            }
        });
    };
    $scope.check=function(id){
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'check.html',
            controller: 'checkController',
            size: '',
            resolve: {
                ID:function(){
                    return id;
                }
            }
        });
         modalInstance.result.then(function(){
             if($cookieStore.get('for_tools_users_state')!=="0"){//state=1 is admin
                 getresService.programs('../main.php?type=list')
                     .success(function(data){
                         $scope.datas=new Array();
                         for(ii=0;ii<data.length;ii++) {
                             $scope.datas.push(data[ii]);
                         }
                         $scope.search($scope.datas);
                     });
             }else{
                 getresService.programs('../main.php?type=list&uid='+$cookieStore.get('for_tools_users_id'))
                     .success(function(data){
                         $scope.datas=new Array();
                         for(ii=0;ii<data.length;ii++) {
                             $scope.datas.push(data[ii]);
                         }
                         $scope.search($scope.datas);
                     });
             }
         });
    }
});

app.controller('showDetailController',function($scope,ID,getresService,$modalInstance){
    $scope.applyID=ID;
    getresService.programs('../main.php?type=apply&aid='+$scope.applyID)
        .success(function(data){
            $scope.data=data;
        });
    getresService.programs('../main.php?type=check&cid=&aid='+ID)
        .success(function(data){
            $scope.check=data;
        });
    $scope.cancel=function(){
        $modalInstance.close();
    }
})
app.controller('checkController',function($scope,ID,getresService,saveService,$cookieStore,$modalInstance){
    getresService.programs('../main.php?type=check&cid=&aid='+ID)
        .success(function(data){
            $scope.cid=data.id;
            if(data.id==''||data.id==undefined){
                getresService.programs('../main.php?type=apply&aid='+ID)
                    .success(function(apply){
                        $scope.proposer=apply.proposer;
                        $scope.tel=apply.tel;
                        $scope.versions=apply.versions;
                        $scope.mac=apply.mac;
                        $scope.createtime=apply.createtime;
                        $scope.endtime=apply.endtime;
                        $scope.module=apply.module;
                        $scope.address=apply.address;
                    });
            }else{
                $scope.proposer=data.proposer;
                $scope.tel=data.tel;
                $scope.versions=data.versions;
                $scope.mac=data.mac;
                $scope.createtime=data.checktime;
                $scope.endtime=data.endtime;
                $scope.module=data.module;
                $scope.address=data.address;
            }
        });
    $scope.saveCheck=function(){
        var formData={
            cid:$scope.cid,
            applyid:ID,
            proposer:$scope.proposer,
            tel:$scope.tel,
            module:$scope.module,
            versions:$scope.versions,
            mac:$scope.mac,
            address:$scope.address,
            checker:$cookieStore.get('for_tools_users_name'),
            endtime:$scope.endtime
        };
        saveService.program('../main.php?type=check&aid=',formData)
            .success(function(data){
                $modalInstance.close();
            });
    }
    $scope.cancel=function(){
        $modalInstance.dismiss('cancel');
    }
})
app.controller('userController',function($scope,saveService,$cookieStore,getresService,$window){

    if($cookieStore.get('for_tools_users_state')=="0"){//state=1 is admin
        alert('您没有权限浏览该项');
        $window.location.href="../Role/index.html";
        return;
    }
    getresService.programs('../main.php?type=users')
        .success(function(data){
            $scope.datas=new Array();
            for(ii=0;ii<data.length;ii++) {
                $scope.datas.push(data[ii]);
            }
        });

});
app.controller('toolsController', function($scope,saveService,$cookieStore,getresService,$window,$modal){
   if($cookieStore.get('for_tools_users_state')=="0"){
       alert('您没有权限浏览该项');
       $window.location.href="../Role/index.html";
       return;
   }
    getresService.programs('../main.php?type=tools')
        .success(function(data){
            $scope.datas=new Array();
            for(ii=0;ii<data.length;ii++) {
                $scope.datas.push(data[ii]);
            }
        });
    $scope.addTool=function(){
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'addTools.html',
            controller: 'addToolsController',
            size: '',
            resolve: {
            }
        });
        modalInstance.result.then(function(){

            getresService.programs('../main.php?type=tools')
                .success(function(data){
                    $scope.datas=new Array();
                    for(ii=0;ii<data.length;ii++) {
                        $scope.datas.push(data[ii]);
                    }
                });
        });
    }
    $scope.del=function(id){
        if(confirm("确认要删除？")){
            var fromdata={
              id:id
            };
            saveService.program('../main.php?type=tools&s=0&d=1',fromdata)
                .success(function(data){
                    if(data==1){
                        alert('删除成功');
                        getresService.programs('../main.php?type=tools')
                            .success(function(data){
                                $scope.datas=new Array();
                                for(ii=0;ii<data.length;ii++) {
                                    $scope.datas.push(data[ii]);
                                }
                            });
                    }else{
                        alert('删除失败');
                    }
                });
        }
    }
});
app.controller('addToolsController',function($scope,$modalInstance,saveService,$cookieStore,getresService,$window){
    $scope.saveApply=function(){
      var formdata={
          name:$scope.name
      }
      saveService.program('../main.php?type=tools&s=1&d=0',formdata)
          .success(function(data){
              $modalInstance.close();
          });
    };
    $scope.cancel = function() {
       $modalInstance.dismiss('cancel');
    };
});


