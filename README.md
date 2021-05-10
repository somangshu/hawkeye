# Cobhin-Tracks

After being tired of checking for vaccination slots every minute of everyday, here's presenting a simple chrome extension built to do exactly that for any given pin-code in India. This application is powered by the APIsetu open apis for covid 19 vaccine (cowin)

## Features

- Track vaccination availability on click of a button by just entering your pin code. (The feature is right now available for only 18+)
- Caching of pin code. No need to enter pin code repeatedly. Just click `track` to get updates.
- Will provide a sound alert whenever a slot is found for the pin code previously entered. (don't forget to turn that volume up) 

## Getting Started

### To install the extension in Chrome

Checkout the detailed installation steps, along with step-by-step screenshots. [here](https://docs.google.com/document/d/1kW2g2cxM8YZGmkUs7YzGF_4mhOeokP2UZkhNrrOW-L4). Thanks to [Richa Mohta](https://github.com/richamohta) for maintaning the documentation.

- Get a local copy of the codebase from [here](https://github.com/somangshu/cobhin-tracks.git).
- Download the ‘Source code.zip’ file from the assets.
- After downloading the zip folder, extract all files from the source code file and store it in any location on your local device.
- Head over to chrome://extensions
- Toggle the ‘Developer mode’ to ON from the top right corner.
- Click `Load unpacked`.
- Upload the `cobhin-tracks/dist` folder to chrome.
- The extension should now be installed.
- On your chrome browser, click on the extensions icon and pin the plug-in. 
- Once installed, you’ll need to enter a pin code for your preferred center. 


**To get started with development, follow the instructions below**

To get a local copy up and running follow these simple steps.

- git clone the repo

```
git clone https://github.com/somangshu/cobhin-tracks.git && cd cobhin-tracks
```

- Install all the required packages with

```
npm install
```

- Build from webpack

```
npm run build
```

### Automated Tests

- Currently, there are no automated tests avaailable for this project. This will be implemented at a later date.

### Roadmap

- ~~chrome.alarms for reccursive/automated tracking~~
- ~~Sound notification if a slot is avilable~~
- Publish to chrome extension store
- Automated slot of the day prediction and related notification
- Send reminder on SMS
- Tracking for all age groups 
- Tracking for multiple vaccination centers stimultaneously. This will be done district wise. 

## Authors

👤 **Somangshu Goswami**

- Github: [@somangshu](https://github.com/somangshu)
- StackOverflow: [@somangshu-goswami](https://stackoverflow.com/users/5826265/somangshu-goswami?tab=profile)
- Linkedin: [somangshu-goswami](https://www.linkedin.com/in/somangshu-goswami/)
