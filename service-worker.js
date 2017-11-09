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
  if (event.tag == 'outbox') {
    //console.log('(sw)');
    console.log(heure());
    event.waitUntil(fetchRslt());
  }
/*  if (event.tag == 'test-sync') {
    console.log('test-sync');}*/

});

function fetchRslt()
{
  console.log('fonction fetchRslt');
var openRequest = indexedDB.open("db1",1);


openRequest.onsuccess = function(e) {
    console.log("acces a db1");
    db = e.target.result;
    /*var transaction = db.transaction(["students1"],"readwrite");
        var store = transaction.objectStore("students1");
  return store.delete(1);*/
    var transaction = db.transaction(["students1"], "readonly");
    var objectStore = transaction.objectStore("students1");

    var cursor = objectStore.openCursor();

    cursor.onsuccess = function(e) {
    var res = e.target.result;
//console.log("res",res);
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
      //  console.log("######################");
        var fileReader = new FileReader();
        var base64;
      //  var fileB64;
     fileReader.onload = function(fileLoadedEvent) {
            base64 = fileLoadedEvent.target.result;
            fileJSON={modified: file.lastModifiedDate,name: file.name,size: file.size,type: file.type,body:base64};
            console.log("fileJSON =",fileJSON);
            res.value['file']=fileJSON;
            var bodyJSON=JSON.stringify(res.value);
            console.log('bodyJSON :',bodyJSON);
            console.log(heure());
            //envoyer puis supprimer les données
            fetch("https://ec-tunis.com/delegate/pwa", {
                  mode: 'no-cors',
                  method: 'POST',
                //  headers: { 'Accept': 'text/plain','Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8','X-Requested-With': 'XMLHttpRequest',},
                  body:JSON.stringify(res.value)
              })./*then((response) => response.json())
              .then((responseData) => {
                  console.log(responseData);
          	if (responseData.result === 'success') {
          		var transaction = db.transaction(["students"],"readwrite");
                  var store = transaction.objectStore("students");
          	return store.delete(1);}
          })*/then(function(res){
          console.log("**********result server: status = ",res.status);
          console.log("heure d'envoi:",heure());
          var transaction = db.transaction(["students1"],"readwrite");
              var store = transaction.objectStore("students1");
        return store.delete(1);
         }).catch((error) => {
                  console.log("Error ",error);
              });
              /*var transaction = db.transaction(["students"],"readwrite");
                  var store = transaction.objectStore("students");
              return store.delete(1);*/

            }
            fileReader.readAsDataURL(file);
            res.continue();
          }
          else{
            console.log("objet vide!!")
          }
        }
      }
      openRequest.onerror = function(e) {
        //Do something for the error
      }
    }

    function heure()
    {
         var date = new Date();
         var heure = date.getHours();
         var minutes = date.getMinutes();
         if(minutes < 10)
              minutes = "0" + minutes;
         return heure + "h" + minutes;
    }
