console.log("service worker");
self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    if (self.clients && clients.claim) {
        clients.claim();
    }
});


self.addEventListener('sync', function(event) {
  console.log("event sync");
  console.log('firing: sync');
  if (event.tag == 'outbox') {
    console.log('sync event fired');
    event.waitUntil(fetchRslt());
  }
});

function fetchRslt()
{
  console.log('firing: doSomeStuff()');
var openRequest = indexedDB.open("db1",1);


openRequest.onsuccess = function(e) {
    console.log("running onsuccess");
    db = e.target.result;
    var transaction = db.transaction(["students"], "readonly");
    var objectStore = transaction.objectStore("students");

    var cursor = objectStore.openCursor();

    cursor.onsuccess = function(e) {
    var res = e.target.result;
//console.log(res);
    if(res) {
        console.log("Key", res.key);
	//console.log("id",res.id);
        console.log("Data", res.value);
        /*var props=""
for (prop in res.value){console.log(prop);}// props+= prop +  " => " +res.value[prop] + "\n"; }
//console.log(props);*/
        var f=res.value["file"];
      //console.log("f['name']",f['name']);
        console.log("typeof f ",typeof(f));
        var file = new File([f], f['name'], {type:"application/pdf"});
        console.log("file converted:",file);
        console.log("######################");
        var fileReader = new FileReader();
        var base64;
      //  var fileB64;
     fileReader.onload = function(fileLoadedEvent) {
            base64 = fileLoadedEvent.target.result;
            // Print data in console

            console.log(base64);
            //fileB64=file['name']+'$'+base64;
            //console.log(fileB64);
            fileJSON={modified: file.lastModifiedDate,name: file.name,size: file.size,type: file.type,body:base64};
            console.log("fileJSON =",fileJSON);
            res.value['file']=fileJSON;
            console.log(JSON.stringify(res.value));
            }
            fileReader.readAsDataURL(file);
        console.log("###########################");
        console.log("typeof file",typeof(file));
        console.log(JSON.stringify(res.value));
        res.continue();

//envoyer puis supprimer les données

	/*fetch("hostURL", {
        method: 'POST',
        headers: { 'Accept': 'application/json','Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8','X-Requested-With': 'XMLHttpRequest',},
        body: JSON.stringify(res.value)
    }).then((response) => response.json())
    .then((responseData) => {
        console.log(responseData);
	if (responseData.result === 'success') {
		var transaction = db.transaction(["students"],"readwrite");
        var store = transaction.objectStore("students");
	return store.delete(1);}
    }).catch((error) => {
        console.log("Error");
    });*/

}
}
}
openRequest.onerror = function(e) {
    //Do something for the error
}
}
