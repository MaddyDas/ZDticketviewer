<!DOCTYPE html>
<html lang="en">
   
<head>
    <meta charset="UTF-8">
    <title>Ticket Viewer</title>
  <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js"></script>
</head>

<h1>Ticket Viewer</h1>

<body>

  <table id="table" style="border: 1px solid black;  padding: 15px; border-spacing: 5px; text-align: left; width:100%;">
   </table>
   <button  onclick="prev()" id="btn_prev">Prev</button>
   <button onclick="next()" id="btn_next">Next</button>
 </body>

<script>
  let currentPage = 1;
  let nextLink = ""; 
  let prevLink = ""; 
  let more = "";
  
  getTickets(); 

    function getTickets() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/about');
    xhr.send();
    xhr.onload = ticketsTable; 
      xhr.onerror = function() {
      alert(`Error retrieving tickets`);
      };    
    }

    function extract(info) {
        let picked = []; 
        for (var i = 0; i < info.length; i++) {
          let subset = _.pick(info[i], ['subject', 'created_at','requester_id', 'type']);
          picked.push(subset);
        }
        return picked;
     } 

     function generateTableHead(table, data) {
        let thead = table.createTHead();
        let row = thead.insertRow();
        for (let key of data) {
          let th = document.createElement("th");
          let text = document.createTextNode(key);
          th.appendChild(text);
          row.appendChild(th);
        }
      } 
      function generateTable(table, data) {
        for (let element of data) {
        let row = table.insertRow();
          for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
          }
        }
      }

    function ticketsTable() {
      let info = JSON.parse(this.response);
      nextLink = info.links.next; 
      prevLink = info.links.prev; 
      more = info.meta.has_more; 
      info = info.tickets;
      info = extract(info);
  
    let table = document.querySelector("table");
    let data = Object.keys(info[0]);
    generateTableHead(table, data);
    generateTable(table, info);
    buttonVisiblity();
    }; 
  

function buttonVisiblity(){
  if (currentPage == 1 ) {
    btn_prev.style.visibility = "hidden";
  } else {
      btn_prev.style.visibility = "visible";
      if (more == false){
        btn_next.style.visibility = "hidden";
      }
    }
}

function deleteTable(){
  var table = document.getElementById("table");
  table.deleteTHead();
  for(var i = table.rows.length - 1; i > 0; i--){
    table.deleteRow(i);
  }
}

function next(){
  if (more == true){
    deleteTable();
    var xh = new XMLHttpRequest();
    xh.open('GET', '/page?page=' + nextLink);
    xh.send();
    xh.onload =  ticketsTable; 
    xh.onerror = function() {
      alert(`Error retrieving tickets`);
      };   
    currentPage++;
  }
 }

function prev(){
  deleteTable();
  var xh = new XMLHttpRequest();
  xh.open('GET', '/page?page=' + prevLink);
  xh.send();
  xh.onload = ticketsTable; 
  xh.onerror = function() {
      alert(`Error retrieving tickets`);
      };   
  currentPage--;
}
</script>
