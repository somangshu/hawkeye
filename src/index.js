import axios from "axios";
const api = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByPin";
const errors = document.querySelector(".errors");
const loading = document.querySelector(".loading");
const cases = document.querySelector(".cases");
const noSlots = document.querySelector(".noSlots");
const recovered = document.querySelector(".recovered");
const deaths = document.querySelector(".deaths");
const results = document.querySelector(".result-container");
results.style.display = "none";
loading.style.display = "none";
errors.textContent = "";
// grab the form
const form = document.querySelector(".form-data");
// grab the pin code
const pin = document.querySelector(".pin-code");

// remember the pin code which is added once
chrome.storage.sync.get(['pin_code'], function(items) {
  if (items && items.pin_code) {
    pin.value = items.pin_code
  }
});

const getToday = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();

  today = dd + '-' + mm + '-' + yyyy;
  return today
}


// searching slots by pin code
const searchForCountry = async pin => {
  const today = getToday()
  console.log(today)
  loading.style.display = "block";
  errors.textContent = "";
  try {
    const response = await axios.get(api, {params: {
      pincode: pin,
      date: today
    }});
    loading.style.display = "none";
    response.data.centers.forEach(center => {
      center.sessions.forEach(session => {
        if (session.min_age_limit == 18 && session.available_capacity > 0) {
          cases.textContent = 'A slot was found';
          recovered.textContent = center.name + ' (' + session.available_capacity + ') ' + ' - on ' + session.date + ' - ' + session.vaccine + ' (' + center.fee_type + ')';
          deaths.textContent = session.slots
        }
      });
    });

    // we will be using chrome alarms to run a scheduled job untill vaccine is found
    // when the entry is found the alarm will be stopped and bell needs to ring
    // https://stackoverflow.com/questions/17727734/how-to-use-chrome-alarms-for-google-chrome-extension
    // chrome.alarms.create("myAlarm", {delayInMinutes: 0.1, periodInMinutes: 0.2} );
    
    noSlots.textContent = 'No slots found yet. Last run on: ' + new Date();
    results.style.display = "block";
  } catch (error) {
    loading.style.display = "none";
    results.style.display = "none";
    errors.textContent = "There was an error processing the request";
  }
};

// declare a function to handle form submission
const handleSubmit = async e => {
  e.preventDefault();

  //validate if pin code is correct
  if (pin.value.length != 6) {
    errors.textContent = "Invalid pin entered";
    return
  }

  // save pin code before submiting form
  chrome.storage.sync.set({'pin_code': pin.value}, function() {
    console.log('Pin saved');
  });

  searchForCountry(pin.value);
  console.log(pin.value);
};

form.addEventListener("submit", e => handleSubmit(e));
