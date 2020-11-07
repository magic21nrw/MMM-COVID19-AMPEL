# MMM-COVID19-AMPEL
A [MagicMirror²](https://magicmirror.builders) helper module to display the COVID 19 INCIDENCE Value in form of the four stages in Germany (Green, Yellow, Red and Dark - Red).

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://raw.githubusercontent.com/magic21nrw/MMM-COVID19-AMPEL/master/LICENSE)

![Example](screenshot.png) 

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/magic21nrw/MMM-COVID19-AMPEL.git
````

Add the module to the modules array in the `config/config.js` file:
````javascript
  {
    module: "MMM-COVID19-AMPEL"
  },
````

## Configuration options

The following properties can be configured:


| Option                       | Description
| ---------------------------- | -----------
| `header`                     | The header text <br><br> **Default value:** `'COVID-19 Inzidenzwert'`
| `cityID`                     | The ObjectID of the GEN City from this database in an array: `'https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0/data'` <br><br> **Possible values:** Array: `["224" , "223"]` for Ingolstadt and München <br> **Default value:** `["224"]`
| `infoRowClass`               | The font size of data <br><br> **Possible values:** `'small'`, `'medium'` <br> **Default value:** `'small'`
| `showUpdateDateInHeader`     | Show date of update in Header (of last received item) <br><br> **Possible bool values:** `true`, `false` <br> **Default value:** `true`
| `showUpdateDateInRow`        | Show date of update in each row  <br><br> **Possible bool values:** `true`, `false` <br> **Default value:** `false`
| `updateInterval`             | How often does the content needs to be fetched? (Milliseconds) <br><br> **Possible values:** `1000` - `86400000` <br> **Default value:** `3600000` (60 minutes)
| `fadeSpeed`                  | Fading speed when module is updating. No need to change it... <br><br> **Possible values:** `1000` - `86400000` <br> **Default value:** `4000`

## Config Example

````javascript
{
  module: 'MMM-COVID19-AMPEL',
  position: 'top_center',
  config:	{
    header: 'COVID-19 Inzidenzwert', // Header Title of Display on MagicMirror
    cityID: ["224","223"], // City ID from  https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0/data
    infoRowClass: "small", // small, medium
    showUpdateDateInHeader: true, //Show update date in header
    showUpdateDateInRow: false, //Show update date in each row
    updateInterval: 3600000, // update interval in milliseconds // 1 Hour - Values are only refreshed every 24 H on Server
    fadeSpeed: 4000
	}
},
````
## Updating to Version 0.2
Attention, the format of the City ID has changed. This must also be reflected in your config.js. It needs now to be an array to support multiple cities. Change `"223"` to `["223"]` to  make it work.
The order on the mirror is the same as in the config file array.


## Updating

To update the module to the latest version, use your terminal to go to your MMM-COVID19-AMPEL module folder and type the following command:

````
git pull
```` 


Feel free to open any Issue :smiley:
