/* global module */

/* Magic Mirror
 * Node Helper: MMM-COVID19-Ampel
 *
 * By Daniel Osterkamp
 * MIT Licensed.
 */

var NodeHelper = require('node_helper')
var request = require('request')

var incidentURLPrefix = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=&objectIds='
var incidentURLSuffix = '&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=OBJECTID%2CGEN%2Ccases7_per_100k%2Clast_update&returnGeometry=false&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token='
var spacer = '%2C'
var requestURL = ''

module.exports = NodeHelper.create({
  start: function () {
    console.log('Starting node helper for: ' + this.name)
  },
  getIncidents: function (key) {
    var self = this
    if (key.length === 1) {
      requestURL = incidentURLPrefix + key[0] + incidentURLSuffix;
    }
    if (key.length > 1) {
      requestURL = incidentURLPrefix + key[0]
      for (let index = 1; index < key.length; index++) {
        const element = key[index];
        requestURL += spacer + element;
      }
      requestURL += incidentURLSuffix;
    }
    var options = {
      method: 'GET',
      url: requestURL,
      headers: {
      }
    }
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body)
        self.sendSocketNotification('INCIDENTS', result.features)
      }
    })
  },
  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, payload) {
    if (notification === 'GET_INCIDENTS') {
      this.getIncidents(payload)
    }
  }
});
