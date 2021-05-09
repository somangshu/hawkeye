const api = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByPin";

const getToday = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();

  today = dd + "-" + mm + "-" + yyyy;
  return today;
};

// searching slots by pin code
// this function exists in the popup script too
// need to find a way to make this modular
// not able to find backgound using popup function
const searchForStock = (pin) => {
  const today = getToday();
  const params = "?pincode=" + pin + "&date=" + today;
  try {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        let responseText = xhr.response;
        let response = JSON.parse(responseText);
        response.centers.forEach((center) => {
          center.sessions.forEach((session) => {
            if (session.min_age_limit == 18 && session.available_capacity > 0) {
              // alert sound
              var myAudio = new Audio(chrome.runtime.getURL("/notification.mp3"));
              myAudio.play();

              chrome.storage.sync.set({ last_found_slot: { center: center, session: session } });

              //   alert and make a sound
              if (
                window.confirm(
                  "A new slot was found!" +
                    "\n" +
                    center.name +
                    " (" +
                    session.available_capacity +
                    ") " +
                    " - on " +
                    session.date +
                    " - " +
                    session.vaccine +
                    " (" +
                    center.fee_type +
                    ")" +
                    "\n" +
                    "Click ok to open covin login page"
                )
              ) {
                chrome.browserAction.onClicked.addListener(function (activeTab) {
                  var newURL = "https://selfregistration.cowin.gov.in/";
                  chrome.tabs.create({ url: newURL });
                });
              }
            }
          });
        });
      }
    };
    xhr.open("GET", api + params, true);
    xhr.send(null);
    chrome.storage.sync.set(
      { last_run: "No slots found yet. Last run on: " + new Date() },
      function () {
        console.log("Last run saved");
      }
    );
  } catch (error) {
    console.log(error);
    chrome.storage.sync.set(
      {
        last_run:
          "There was an error in the last check. No slots found yet. Last run on: " + new Date(),
      },
      function () {
        console.log("Last run saved");
      }
    );
  }
};

chrome.alarms.onAlarm.addListener(function (alarm) {
  chrome.storage.sync.get(["pin_code"], function (items) {
    if (items) {
      if (items.pin_code) searchForStock(items.pin_code);
    }
  });
});
