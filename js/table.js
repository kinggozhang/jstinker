var g_rid = 1;

var tableClasses={};
var requestData={type:"",data:"",result:""};
var requests={};
var appIdKey={appId:'2a4bKP0e9Gw28Q3moW30YzK3-gzGzoHsz', appKey:'i7loDJ18a49onwsfMH876uCf', serverURLs: 'https://avoscloud.com'};
function initialize(id, key)
{
	var appIdkey={appId:id, appKey:key};

	if(!AV.applicationId)
	{
	AV.init(appIdKey);
	}
}
function ele(id)
{
	return document.getElementById(id);
}
function currentUser()
{
	return AV.User.current();
}
function updateRequest(requestId, value)
{
	var result = "";
	if(value === 1)
		result = "成功";
	else if(value === -1)
		result = "失败";
    else result = value;
	if(ele(requestId))
	{
		ele(requestId).innerText = result;
	}
}
function appendRequest(reqid, reqtext)
{
    var rdata = getRequestData(reqid);
	var pele = document.createElement("p");
	pele.className='w3-border-left w3-left-align w3-text-green';
	
    var nodehtml= reqtext;
	nodehtml += "......<span id=";
	nodehtml += reqid;
	nodehtml += ">";
	nodehtml += "</span>";
	pele.innerHTML = nodehtml;
    
	ele("requestResult").appendChild(pele);
}
function getRequestData(requestId)
{
	return requests[requestId];
}

function getTableClass(tablename)
{
	var tclass = tableClasses[tablename];
	if(!tclass)
	{ 
	tclass = AV.Object.extend(tablename);
	tableClasses[tablename] = tclass;
	}
	return tclass;
}
function findItemsByQuery(tablename, query, onResult, onError, selectFields)
{
   let requestId=new Date().getTime();
	if(requestId <= g_rid)
	{
	requestId = (g_rid+1);  
	}
	g_rid = requestId;
    requests[requestId]={type:"findItemsByQuery", "data":"",result:0};

    if(selectFields.length == 0)
    {
        selectFields.push('ObjectId');
    }
    query.select(selectFields);
    query.find().then(function(results)
		{
			updateRequest(requestId, 1);
			if(onResult)
			{
				onResult(tablename, results);
			}
		},
		function(error){
			updateRequest(requestId, -1);
			if(onError)
			{
				onError(tablename, error);
			}
		});
        
    return requestId;
}
function findItems(tablename, cond1,cond1value, cond2,cond2value,type, onResult, onError, selectFields=[])
{
    let requestId=new Date().getTime();
	if(requestId <= g_rid)
	{
	requestId = (g_rid+1);  
	}
	g_rid = requestId;
    requests[requestId]={type:"findItems", "data":"",result:0};
    var query = new AV.Query(tablename);
	query.equalTo(cond1, cond1value);
    var query2 = new AV.Query(tablename);
	query2.equalTo(cond2, cond2value);
	var comboQuery;
	if(type == "and")
       comboQuery = AV.Query.and(query, query2);
    else if(type == "or")
	   comboQuery = AV.Query.or(query, query2);
    if(selectFields.length == 0)
    {
        selectFields.push('ObjectId');
    }
    comboQuery.select(selectFields);
    comboQuery.find().then(function(results)
		{
			updateRequest(requestId, 1);
			if(onResult)
			{
				onResult(tablename, results);
			}
		},
		function(error){
			updateRequest(requestId, -1);
			if(onError)
			{
				onError(tablename, error);
			}
		});
        
    return requestId;
    
}
function findItemsEqualTo(tablename, field, value, onResult,onError)
{
    let requestId=new Date().getTime();
	if(requestId <= g_rid)
	{
	requestId = (g_rid+1);  
	}
	g_rid = requestId;
	requests[requestId]={type:"findItemsEqualTo", "data":"",result:0};
	var query = new AV.Query(tablename);
	query.descending('createdAt');
	query.equalTo(field, value)
	query.find().then(function(results)
		{
			updateRequest(requestId, 1);
			if(onResult)
			{
				onResult(tablename, results);
			}
		},
		function(error){
			updateRequest(requestId, -1);
			if(onError)
			{
				onError(tablename, error);
			}
		});
	return requestId;
}
function findItemById(tablename, objId, onSuccess, onError)
{
	var query = new AV.Query(tablename);
	
	let requestId=new Date().getTime();
	if(requestId <= g_rid)
	{
	requestId = (g_rid+1);  
	}
	g_rid = requestId;

	requests[requestId]={type:"findItemById", "data":objId,result:0};	
	query.get(objId).then(function (tobj) {
        updateRequest(requestId, 1);	
		if(onSuccess)
		{
			onSuccess(tablename, tobj);
		}
	}, function (error) {
		updateRequest(requestId, -1);
		if(onError)
		{
			onError(tablename, tobj, error);
		}
	});
	return requestId;
}
function updateTableItem(tablename, itemId, data, onSuccess, onError)
{
    var tobj = AV.Object.createWithoutData(tablename, itemId);
    if(tobj)
    {
	let requestId=new Date().getTime();
	if(requestId <= g_rid)
	{
	requestId = (g_rid+1);  
	}
	g_rid = requestId;	
	requests[requestId]={"type":"updateTable", "data":data,"result":0};        
        for(var key in data)
        {
        if(key && data[key])
            tobj.set(key, data[key]);
        }
        
        tobj.save().then(
        function(tobj){
		 updateRequest(requestId, 1);	
		 if(onSuccess)
			onSuccess(tablename, tobj);
        }
        ,function(error){
		updateRequest(requestId, -1);
		if(onError)
			onError(tablename, tobj, error);
        }
        );
        return requestId;
    }
    return 0;
    
}
function increTableItem(tablename, id, col, delta, onSuccess, onError)
{
    let requestId=new Date().getTime();
	if(requestId <= g_rid)
	{
	requestId = (g_rid+1);  
	}
    let todo = AV.Object.createWithoutData(tablename, id);
    todo.increment(col, delta);
    todo.fetchWhenSave(true);
    todo.save().then(
        function (todo) {
        // 使用了 fetchWhenSave 选项，save 成功之后即可得到最新的 views 值
           updateRequest(requestId, 1);
           if(onSuccess)
           {
               onSuccess(todo);
           }
        }, function (error) {
           updateRequest(requestId, -1);
           console.log("increTableItem error:"+error.message);
           if(onError)
           {
               onError(error);
           }
        });
    return requestId;
        
}

function removeTableItem(tablename, id, onSuccess, onError)
{
    let requestId=new Date().getTime();
    if(requestId <= g_rid)
    {
        requestId = (g_rid+1);
    }
    var todo = AV.Object.createWithoutData(tablename, id);
    todo.destroy().then(function (success) {
                        updateRequest(requestId, 1);
                        if(onSuccess)
                        onSuccess(success);
                        }, function (error) {
                        updateRequest(requestId, -1);
                        if(onError)
                        onError(error);
                        });
    return requestId;
}
function createTableItem(tablename, data, onSuccess, onError,aclReadUsers=[],aclWriteUsers=[])
{
	var tclass = getTableClass(tablename);

	var tobj = new tclass();
	let requestId=new Date().getTime();
	if(requestId <= g_rid)
	{
	requestId = (g_rid+1);  
	}
	g_rid = requestId;
	
	requests[requestId]={"type":"createTable", "data":data,"result":0};
	for(var key in data)
	{
        if(data[key])
        tobj.set(key, data[key]);
	}
    var acl = new AV.ACL();
	if(aclReadUsers.length > 0)
    {    
        for(let i=0;i<aclReadUsers.length;i++)
        {
            acl.setReadAccess(aclReadUsers[i],true);
        }
    }
    else
	{
		acl.setPublicReadAccess(true); 
	}	
    if(aclWriteUsers.length > 0)
    {    
        for(let i=0;i<aclWriteUsers.length;i++)
        {
            acl.setWriteAccess(aclWriteUsers[i],true);
        }
    }
    else
    {
        acl.setPublicWriteAccess(true); 
    }
    tobj.setACL(acl);
	tobj.save().then(function(tobj){
		 updateRequest(requestId, 1);	
		 if(onSuccess)
			onSuccess(tablename, tobj);
	}
	,function(error){
		updateRequest(requestId, -1);
		if(onError)
			onError(tablename, tobj, error);
	}
	);
	return requestId;
}
	function getParameter(param)
	{
		var query = window.location.search;//获取URL地址中？后的所有字符
		var iLen = param.length;//获取你的参数名称长度
		var iStart = query.indexOf(param);//获取你该参数名称的其实索引
		if (iStart == -1)//-1为没有该参数
			return "";
		iStart += iLen + 1;
		var iEnd = query.indexOf("&", iStart);//获取第二个参数的其实索引
		if (iEnd == -1)//只有一个参数
			return query.substring(iStart);//获取单个参数的参数值
		return query.substring(iStart, iEnd);//获取第二个参数的值
	}
