// var list = ['a', 'b', 'c'];
// console.log(list);

// list.insert(1, 'd');
// console.log(list);

// var today = new Date();
// var pcOffset = (today.getTimezoneOffset()/60); 
// var state = "표준 시간(PC 시간): " + today.toLocaleString() + "\n";

// today.setHours(today.getHours() + pcOffset);
// state = state + "그리니치 시간: " + today.toLocaleString() + "\n";

// today.setHours(today.getHours() + 9);
// state = state + "한국 시간: " + today.toLocaleString();
// console.log(state);

// var date = new Date();
//   console.log(`date.toLocaleString() : ${date.toLocaleString()}`);  // 2019-12-02T04:32:14.600Z

{/* <td>
  <span style="color:red"><%= dbData[i].leaveTime.toISOString().slice(0, 10).replace('T', ' ') %></span>
  <%= dbData[i].leaveTime.toISOString().slice(11, 16).replace('T', ' ') %>~<%= dbData[i].comebackTime.toISOString().slice(11, 16).replace('T', ' ') %>
</td> */}
            
  // var date = new Date();
  // console.log(date.toISOString());
  // date.setHours(date.getHours() + 9);
  // console.log(date.toISOString());

  var start = new Date();
  console.log(start.toLocaleString())           // 2019-12-22 16:38:46
  console.log(start.toLocaleDateString())       // 2019-12-22
  console.log(new Date().toLocaleDateString())  // 2019-12-22
  console.log(start.toLocaleTimeString())       // 16:38:46
  console.log(start.toLocaleTimeString().slice(0,5))
  console.log(new Date().toLocaleTimeString().slice(0,5))
  

  console.log(start.toISOString())          // 2019-12-22T07:39:34.654Z
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  console.log(start.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }));