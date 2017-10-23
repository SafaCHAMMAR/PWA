console.log("hello");
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
    //console.log(document.getElementById('name').value);
    //alert("hello connection");
    console.log('sync event fired');
    event.waitUntil(fetchRslt());
  }
});

function fetchRslt()
{
  console.log('firing: doSomeStuff()');
var openRequest = indexedDB.open("l8",1);


openRequest.onsuccess = function(e) {
    console.log("running onsuccess");
    db = e.target.result;
    var transaction = db.transaction(["students"], "readonly");
    var objectStore = transaction.objectStore("students");

    var cursor = objectStore.openCursor();

    cursor.onsuccess = function(e) {
    var res = e.target.result;
    if(res) {
        console.log("Key", res.key);
        console.log("Data", res.value);
        console.log(JSON.stringify(res.value));
        res.continue();
    }
}
}
openRequest.onerror = function(e) {
    //Do something for the error
}
}

