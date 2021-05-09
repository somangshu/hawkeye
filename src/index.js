import axios from "axios";
const api = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByPin";
const body = document.querySelector(".container");
const errors = document.querySelector(".errors");
const loading = document.querySelector(".loading");
const cases = document.querySelector(".cases");
const noSlots = document.querySelector(".noSlots");
const recovered = document.querySelector(".recovered");
const deaths = document.querySelector(".deaths");
const results = document.querySelector(".result-container");
const tracking = document.querySelector(".tracking");
const trackingControl = document.querySelector(".stop-tracking");
results.style.display = "none";
loading.style.display = "none";
errors.textContent = "";
// grab the form
const form = document.querySelector(".form-data");
// grab the pin code
const pin = document.querySelector(".pin-code");

// load settings from chrome.storage
// remember the pin code which is added once
chrome.storage.sync.get(
  ["pin_code", "last_run", "darkMode", "alarm_active", "last_found_slot"],
  function (items) {
    if (items) {
      const { pin_code, last_run, darkMode, alarm_active, last_found_slot } = items;

      // load pin code from cache
      if (pin_code) {
        pin.value = pin_code;
        results.style.display = "block";
      }

      // Load last run job timestamp
      if (last_run) {
        noSlots.textContent = last_run;

        tracking.textContent = alarm_active ? "Tracking in progress ✅" : "Tracking stopped ❎";
      }

      if (!alarm_active) trackingControl.style.display = "none";

      // load dark mode preference
      if (!darkMode) {
        body.classList.remove("dark-mode");
        darkControl.textContent = "Dark mode: Off";
      } else {
        body.classList.add("dark-mode");
        darkControl.textContent = "Dark mode: On";
      }

      if (last_found_slot) {
        const { center, session } = last_found_slot;
        recovered.textContent =
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
          ")";
        deaths.textContent = session.slots;
      }
    }
  }
);

const getToday = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();

  today = dd + "-" + mm + "-" + yyyy;
  return today;
};

// searching slots by pin code
const searchForStock = async (pin) => {
  const today = getToday();
  console.log("Date today -> " + today);
  loading.style.display = "block";
  errors.textContent = "";
  try {
    const response = await axios.get(api, {
      params: {
        pincode: pin,
        date: today,
      },
    });
    loading.style.display = "none";
    let found = false;
    response.data.centers.forEach((center) => {
      center.sessions.forEach((session) => {
        if (session.min_age_limit == 18 && session.available_capacity > 0) {
          cases.textContent = "A slot was found";
          recovered.textContent =
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
            ")";
          deaths.textContent = session.slots;
          found = true;
        }
      });
    });

    // we will be using chrome alarms to run a scheduled job untill vaccine is found
    // when the entry is found the alarm will be stopped and bell needs to ring
    // https://developer.chrome.com/docs/extensions/reference/alarms/

    chrome.alarms.create("myAlarm", { delayInMinutes: 1, periodInMinutes: 1 });
    chrome.storage.sync.set({ alarm_active: true });
    trackingControl.style.display = "block";
    tracking.textContent = "Tracking in progress ✅";
    chrome.storage.sync.get(["last_run"], function (items) {
      if (items.last_run && found) {
        noSlots.textContent = "";
      } else {
        noSlots.textContent = "No slots found yet. Last run on: " + new Date();
      }
    });
    results.style.display = "block";
  } catch (error) {
    console.log(error);
    loading.style.display = "none";
    results.style.display = "none";
    errors.textContent = "There was an error processing the request";
  }
};

// declare a function to handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  //validate if pin code is correct
  if (pin.value.length != 6) {
    errors.textContent = "Invalid pin entered";
    return;
  }

  // save pin code before submiting form
  chrome.storage.sync.set({ pin_code: pin.value }, function () {
    console.log("Pin cached");
  });

  searchForStock(pin.value);
};

form.addEventListener("submit", (e) => handleSubmit(e));

// enable dark mode :)
const changeTheme = (e) => {
  chrome.storage.sync.get(["darkMode"], function (items) {
    if (items.darkMode) {
      chrome.storage.sync.set({ darkMode: false });
      body.classList.remove("dark-mode");
      darkControl.textContent = "Dark mode: Off";
    } else {
      chrome.storage.sync.set({ darkMode: true });
      body.classList.add("dark-mode");
      darkControl.textContent = "Dark mode: On";
    }
  });
};

var darkControl = document.querySelector(".dark-control");
darkControl.addEventListener("click", (e) => changeTheme(e));

// stop tracking
const stopTracker = (e) => {
  chrome.alarms.clear("myAlarm");
  tracking.textContent = "Tracking stopped ❎";
  trackingControl.style.display = "none";
  chrome.storage.sync.set({ alarm_active: false });
};

trackingControl.addEventListener("click", (e) => stopTracker(e));
