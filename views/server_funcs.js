// var items = [];
// console.log("here");

// function clear(){
//     localStorage.clear();
// }

// function addItem(item){
//     items.push(item);
//     //localStorage.setItem(item, 0);
//     var temp;
//     temp = document.createElement('h3');
//     temp.className = 'item';
//     temp.innerHTML = item;
//     document.getElementsByClassName('order')[0].appendChild(temp);
//     temp.onclick = function(){
//         this.parentElement.removeChild(this);
//         // localStorage.removeItem(item);
//         for(var i = 0; i < items.length; i++){
//             if(this.className == items[i]){
//                 // remove item at index i
//                 items.splice(i,1);
//                 localStorage.setItem('myItem', JSON.stringify(items));
//                 break;
//             }
//         }
//     }
//     if(JSON.parse(localStorage.getItem('myItem')) != null){
//         var old = JSON.parse(localStorage.getItem('myItem'));
//         for(var i = 0; i < old.length; i++){
//             items.push(old[i]);
//         }
//     }
//     localStorage.setItem('myItem', JSON.stringify(items));
//     // item_count++;
//     // console.log('-----');
// }

// // not used yet


// document.addEventListener('DOMContentLoaded', function() {
//     // for each item in order
//     if(JSON.parse(localStorage.getItem('myItem')) != null){
        
//     var val = JSON.parse(localStorage.getItem('myItem'));
//     // console.log(localStorage.length);
//     for(var i = 0; i < val.length; i++){
//         console.log(val[i]);
//         var name = val[i];
//         var temp;
//         temp = document.createElement('h3');
//         temp.className = 'item';
//         temp.innerHTML = name;
//         document.getElementsByClassName('order')[0].appendChild(temp);
//         temp.onclick = function(){
//             this.parentElement.removeChild(this);
//             //localStorage.removeItem(name);
//             val.splice(i,1);
//             localStorage.setItem('myItem', JSON.stringify(val));
//         }
        
//     }
//     localStorage.setItem('myItem', JSON.stringify(val));
// }
//     // for(var i = 0; i < items.length; i++){
//     //     console.log('hi');
//     //     var temp;
//     //     temp = document.createElement('h3');
//     //     temp.className = items[i];
//     //     temp.innerHTML = "item";
//     //     document.getElementsByClassName('order1')[0].appendChild(temp);
//     //     temp.onclick = function(){
//     //         this.parentElement.removeChild(this);
//     //         for(var i = 0; i < items.length; i++){
//     //             if(this.className == items[i]){
//     //                 // remove item at index i
//     //                 items.splice(i,1);
//     //                 break;
//     //             }
//     //         }
//     //     }
//     //     item_count++;
//     // }
//  }, false);

// // ignore
// {/* <div class="buttons" id="entrees" style="display: none;">
//             <div class="grid-container">
//                 <% for (var i in entree_items) {%>
//                     <div class="grid-item"> <h1> <%=entree_items[i].name%> </h1> </a> </div>
//                 <% } %>
//             </div>
//         </div>

//         <div class="buttons" id="waf" style="display: none;">
//             <div class="grid-container">
//                 <% for (var i in waf_items) {%>
//                     <div class="grid-item"> <h1> <%=waf_items[i].name%> </h1> </a> </div>
//                 <% } %>
//             </div>
//         </div>
        
//         <div class="buttons" id="sides" style="display: none;">
//             <div class="grid-container">
//                 <% for (var i in sides) {%>
//                     <div class="grid-item"> <h1> <%=sides[i].name%> </h1> </a> </div>
//                 <% } %>
//             </div>
//         </div> */}
