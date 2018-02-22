
  var doThisWork = function() {
      console.info('Work Created!');
      var i = 0;
      var refId = setInterval(function() {
          if((i%2) === 0){
            postMessage({evenNumber: i, shouldKillWorker: false}); // communicates with main application
          }

          if(i === 50){
            clearInterval(refId);
            postMessage({evenNumber: i, shouldKillWorker: true}); // communicates with main application  
          }
          
          i++;
      }, 100);
  };

var blobForWork = new window.Blob(['(' + doThisWork.toString() + ')()'],
                            { type: "text/javascript" } );

var urlForWorkerBlob = window.URL.createObjectURL(blobForWork);


function startWorker() {
   
    if(typeof(Worker) !== "undefined") {
        if (typeof (yourWorker) == "undefined") {
          console.info('Starting your Worker!');
          yourWorker = new Worker(urlForWorkerBlob);
          
          yourWorker.onmessage = function(event) {
            document.getElementById("your_worker_result").innerHTML = 'Great!, your worker started now and sending data... <div id="data">'+event.data.evenNumber+'</div>';
            if(event.data.shouldKillWorker){
              killWorker();
            }
          }
        }
        return;
    } 
        document.getElementById("your_worker_result").innerHTML = "Sorry!, your browser does not support Web Workers!";
}

function killWorker() {
   if(yourWorker){
    console.info('Killing your Worker!');
    yourWorker.terminate();
    yourWorker = undefined;
    document.getElementById("your_worker_result").innerHTML = 'Sorry!, your worker is no longer alive! <div id="data" class="killed">Killed!<div>';
   }
}