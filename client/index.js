"use strict";

_loadData();

function _loadData() {

    var ajax = new XMLHttpRequest();
    ajax.open("GET", "http://localhost:9000/data", false);
    ajax.send();
    gantt.init("gantt");
    gantt.parse(ajax.responseText);
    var dp = new gantt.dataProcessor("http://localhost:9000/data");
    dp.init(gantt);
    dp.setUpdateMode("off");
    dp.setTransactionMode("REST");
};

//task
gantt.attachEvent("onBeforeTaskAdd", function (id, item) {

    var xhr = gantt.ajax;
    var formdata = _serialize("task", item);

    // HTTP POST
    xhr.post("http://localhost:9000/data/task", formdata, function (r) {
        var t = JSON.parse(r.xmlDoc.responseText);
        if (t && t.status == "ok") {
            _loadData();
        }
    });
    return true;
});

gantt.attachEvent("onBeforeTaskUpdate", function (id, new_item) {
    //any custom logic here
    console.log("new_item", new_item);
    return true;
});

gantt.attachEvent("onBeforeTaskDelete", function (id, item) {
    //any custom logic here
    console.log("new_item", item);
    return true;
});

//link
gantt.attachEvent("onBeforeLinkAdd", function(id,link){
    //any custom logic here
    console.log(link);
    return true;
});

gantt.attachEvent("onBeforeLinkUpdate", function(id,link){
    //any custom logic here
    return true;
});

gantt.attachEvent("onBeforeLinkDelete", function(id,link){
    //any custom logic here
    return true;
});



gantt.attachEvent("onAjaxError", function (request) {
    console.log(request);
    gantt.clearAll();
    _loadData();
    return true;
});

function _serialize(type, item) {
    var serializeString = "";
    if (type === "task") {
        if (item.progress == null || item.progress == undefined) {
            item.progress = 0;
        }
        serializeString = "text=" + item.text + "&start_date=" + item.start_date + "&duration=" + item.duration + "&progress=" + item.progress + "&parent=" + item.parent;
    }
    return serializeString;
}

