/* global Module */

/* Magic Mirror
 * Module: MMM-COVID19-AMPEL
 *
 * By Daniel Osterkamp
 * MIT Licensed.
 */

Module.register("MMM-COVID19-AMPEL", {
  defaults: {
    header: "COVID-19 Inzidenzwert",
    cityID: ["224"], // City ID from  https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0/data
    infoRowClass: "small", // small, medium
    showUpdateDateInHeader: true,
    showUpdateDateInRow: false,
    showTitle: true,
    showSKLK: true,
    showStatusLightLeft: true,
    showStatusLightRight: true,
    showCases: true,
    showCasesPerPeople: true,
    showDeathRatePerPeople: true,
    show7DayIncidence: true,
    landModeOnly: false,
    numberOfDigits: 2,
    updateInterval: 3600000, // update interval in milliseconds
    fadeSpeed: 4000,
    updateDate: "no update received yet",
  },

  getStyles: function () {
    return ["MMM-COVID19-AMPEL.css"];
  },

  getTranslations: function () {
    return {
      en: "translations/en.json",
      de: "translations/de.json",
      it: "translations/it.json",
      fr: "translations/fr.json",
      es: "translations/es.json"
    }
  },

  start: function () {
    this.getInfo();
    this.scheduleUpdate();
  },

  scheduleUpdate: function (delay) {
    var nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }
    var self = this;
    setInterval(function () {
      self.getInfo();
    }, nextLoad);
  },

  getInfo: function () {
    this.sendSocketNotification("GET_INCIDENTS", this.config.cityID);
  },

  socketNotificationReceived: function (notification, payload) {
    var self = this;
    if (notification === "INCIDENTS") {
      this.globalIncidents = payload;
      this.updateDom(self.config.fadeSpeed);
    }
  },

  getHeader: function () {
    var headerTitle = this.config.header;
    if (this.config.showUpdateDateInHeader)
      headerTitle += " - " + this.config.updateDate;
    return headerTitle;
  },

  getDom: function () {
    var wrapper = document.createElement("table");
    if (this.globalIncidents === null || this.globalIncidents === undefined)
      return wrapper;
    if (Object.entries(this.globalIncidents).length === 0) return wrapper;

    var globalStats = this.globalIncidents;
    //globalStats is array with attributes and ITEMS

    wrapper.className = this.config.tableClass || "covidAmpel";

    if (this.config.showTitle) {
      let tableRow = document.createElement("tr");
      let incidentStateColora = document.createElement("td");
      let incidentCityName = document.createElement("td");
      let incidentSKLK = document.createElement("td");
      let incidentBLName = document.createElement("td");
      let incidentUpdateDate = document.createElement("td");
      let totalCases = document.createElement("td");
      let casesPerCapita = document.createElement("td");
      let deathPerInfection = document.createElement("td");
      let incident7DayNumber = document.createElement("td");
      let incidentStateColorb = document.createElement("td");

      incidentCityName.innerHTML = this.translate('Location');
      incidentCityName.className = this.config.infoRowClass;

      incidentSKLK.innerHTML = this.translate('Region');
      incidentSKLK.className = this.config.infoRowClass;

      incidentBLName.innerHTML = this.translate('Land');
      incidentBLName.className = this.config.infoRowClass;

      incidentUpdateDate.innerHTML = this.translate('Updated on');
      incidentUpdateDate.className = this.config.infoRowClass;

      totalCases.innerHTML = this.translate('Infections');
      totalCases.className = this.config.infoRowClass;

      casesPerCapita.innerHTML = this.translate('Infection rate %');
      casesPerCapita.className = this.config.infoRowClass;

      deathPerInfection.innerHTML = this.translate('Death rate %');
      deathPerInfection.className = this.config.infoRowClass;

      incident7DayNumber.innerHTML = this.translate('Incidence value');
      incident7DayNumber.className = this.config.infoRowClass;

      if (this.config.showStatusLightLeft) {
        tableRow.appendChild(incidentStateColora);
      }
      if (!this.config.landModeOnly) {
        tableRow.appendChild(incidentCityName);
        if (this.config.showSKLK) tableRow.appendChild(incidentSKLK);
      }
      if (this.config.landModeOnly) tableRow.appendChild(incidentBLName);

      if (this.config.showUpdateDateInRow) {
        tableRow.appendChild(incidentUpdateDate);
      }
      if (this.config.showCases && !this.config.landModeOnly) {
        tableRow.appendChild(totalCases);
      }
      if (this.config.showCasesPerPeople && !this.config.landModeOnly) {
        tableRow.appendChild(casesPerCapita);
      }
      if (this.config.showDeathRatePerPeople && !this.config.landModeOnly) {
        tableRow.appendChild(deathPerInfection);
      }
      if (this.config.show7DayIncidence) {
        tableRow.appendChild(incident7DayNumber);
      }
      if (this.config.showStatusLightRight) {
        tableRow.appendChild(incidentStateColorb);
      }

      wrapper.appendChild(tableRow);
    }

    globalStats.sort((a, b) => (a.attributes.GEN > b.attributes.GEN) ? 1 : -1)

    for (let i = 0; i < globalStats.length; i++) {
      const element = globalStats[i].attributes;

      let tableRow = document.createElement("tr");
      let incidentStateColora = document.createElement("td");
      let incidentCityName = document.createElement("td");
      let incidentSKLK = document.createElement("td");
      let incidentBLName = document.createElement("td");
      let incidentUpdateDate = document.createElement("td");
      let totalCases = document.createElement("td");
      let casesPerCapita = document.createElement("td");
      let deathPerInfection = document.createElement("td");
      let incident7DayNumber = document.createElement("td");
      let incidentStateColorb = document.createElement("td");

      incidentCityName.innerHTML = element.GEN;
      incidentCityName.className = this.config.infoRowClass;
      incidentSKLK.innerHTML = element.BEZ;
      incidentSKLK.className = this.config.infoRowClass;
      incidentBLName.innerHTML = element.BL;
      incidentBLName.className = this.config.infoRowClass;

      this.config.updateDate = element.last_update;
      if (this.config.showUpdateDateInRow) {
        incidentUpdateDate.innerHTML = element.last_update;
        incidentUpdateDate.className = this.config.infoRowClass;
      }
      if (this.config.showCases && !this.config.landModeOnly) {
        var cs = element.cases;
        totalCases.innerHTML = cs.toLocaleString();
        totalCases.className = this.config.infoRowClass;
      }
      if (this.config.showCasesPerPeople && !this.config.landModeOnly) {
        casesPerCapita.innerHTML =
          element.cases_per_population.toFixed(this.config.numberOfDigits) + "%";
        casesPerCapita.className = this.config.infoRowClass;
      }
      if (this.config.showDeathRatePerPeople && !this.config.landModeOnly) {
        deathPerInfection.innerHTML = element.death_rate.toFixed(this.config.numberOfDigits) + "%";
        deathPerInfection.className = this.config.infoRowClass;
      }
      if (this.config.show7DayIncidence && !this.config.landModeOnly) {
        incident7DayNumber.className = this.config.infoRowClass;
        incident7DayNumber.innerHTML = (
          Math.round(element.cases7_per_100k * 100) / 100
        ).toFixed(this.config.numberOfDigits);
      }
      if (this.config.show7DayIncidence && this.config.landModeOnly) {
        incident7DayNumber.className = this.config.infoRowClass;
        incident7DayNumber.innerHTML = (
          Math.round(element.cases7_bl_per_100k * 100) / 100
        ).toFixed(this.config.numberOfDigits);
      }
      incidentStateColora.innerHTML = "__";
      incidentStateColorb.innerHTML = "__";

      if (parseFloat(element.cases7_per_100k) < 35) {
        incidentStateColora.className = incidentStateColorb.className = "green";
      }
      if (parseFloat(element.cases7_per_100k) >= 35) {
        incidentStateColora.className = incidentStateColorb.className =
          "yellow";
      }
      if (parseFloat(element.cases7_per_100k) >= 50) {
        incidentStateColora.className = incidentStateColorb.className = "red";
      }
      if (parseFloat(element.cases7_per_100k) >= 100) {
        incidentStateColora.className = incidentStateColorb.className =
          "darkred";
      }
      if (parseFloat(element.cases7_per_100k) >= 200) {
        incidentStateColora.className = incidentStateColorb.className =
          "purple";
      }
      if (this.config.landModeOnly) {
        if (parseFloat(element.cases7_bl_per_100k) < 35) {
          incidentStateColora.className = incidentStateColorb.className = "green";
        }
        if (parseFloat(element.cases7_bl_per_100k) >= 35) {
          incidentStateColora.className = incidentStateColorb.className =
            "yellow";
        }
        if (parseFloat(element.cases7_bl_per_100k) >= 50) {
          incidentStateColora.className = incidentStateColorb.className = "red";
        }
        if (parseFloat(element.cases7_bl_per_100k) >= 100) {
          incidentStateColora.className = incidentStateColorb.className =
            "darkred";
        }
        if (parseFloat(element.cases7_bl_per_100k) >= 200) {
          incidentStateColora.className = incidentStateColorb.className =
            "purple";
        }
      }
      if (this.config.showStatusLightLeft) {
        tableRow.appendChild(incidentStateColora);
      }

      if (!this.config.landModeOnly) {
        tableRow.appendChild(incidentCityName);
        if (this.config.showSKLK) tableRow.appendChild(incidentSKLK)
      }
      if (this.config.landModeOnly) tableRow.appendChild(incidentBLName);

      if (this.config.showUpdateDateInRow) {
        tableRow.appendChild(incidentUpdateDate);
      }
      if (this.config.showCases && !this.config.landModeOnly) {
        tableRow.appendChild(totalCases);
      }
      if (this.config.showCasesPerPeople && !this.config.landModeOnly) {
        tableRow.appendChild(casesPerCapita);
      }
      if (this.config.showDeathRatePerPeople && !this.config.landModeOnly) {
        tableRow.appendChild(deathPerInfection);
      }
      if (this.config.show7DayIncidence && !this.config.landModeOnly) {
        tableRow.appendChild(incident7DayNumber);
      }
      if (this.config.show7DayIncidence && this.config.landModeOnly) {
        tableRow.appendChild(incident7DayNumber);
      }
      if (this.config.showStatusLightRight) {
        tableRow.appendChild(incidentStateColorb);
      }

      wrapper.appendChild(tableRow);
    }
    return wrapper;
  },
});
