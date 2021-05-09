# Cobhin-Tracks

A simple chrome extension built to which tracks covid 19 vaccine for a given pin-code in India. This application is powered by the APIsetu open apis for covid 19 vaccine (cowin)

## Features

- Track vaccination availability on click of a button by just entering your pin code. (The feature is right now available for only 18+)
- Caching of pin code. No need to enter pin code repeatedly. Just click `track` to get updates.


## Getting Started

### To install in Chrome

- Get a local copy of the codebase from [here](https://github.com/somangshu/cobhin-tracks.git)
- Head over to chrome://extensions
- Toggle "Developer mode" on.
- Click `Load unpacked`.
- Upload the `cobhin-tracks/dist` folder to chrome
- The extension should now be available for use

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
- ~~Sound notification if a slot is avilable ~~
- Publish to chrome extension store
- Automated slot of the day prediction and related notification
- Send reminder on SMS

## Authors

👤 **Somangshu Goswami**

- Github: [@somangshu](https://github.com/somangshu)
- StackOverflow: [@somangshu-goswami](https://stackoverflow.com/users/5826265/somangshu-goswami?tab=profile)
- Linkedin: [somangshu-goswami](https://www.linkedin.com/in/somangshu-goswami/)
