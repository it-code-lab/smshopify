setTimeout(function () {
  updateStatus();
}, 800);


function updateStatus() {

  let currentDate = new Date();
  let weekday = [];
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  let currentDay = weekday[currentDate.getDay()];
  let currentDayID = "#" + currentDay + 'StoreHrId'; //gets todays weekday and turns it into id
  $('#MondayStoreHrId').removeClass("today"); 
  $('#TuesdayStoreHrId').removeClass("today"); 
  $('#WednesdayStoreHrId').removeClass("today"); 
  $('#ThursdayStoreHrId').removeClass("today"); 
  $('#FridayStoreHrId').removeClass("today"); 
  $('#SaturdayStoreHrId').removeClass("today"); 
  $('#SundayStoreHrId').removeClass("today"); 

  $(currentDayID).addClass("today"); //this works at hightlighting today

}

