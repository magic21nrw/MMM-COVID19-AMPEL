/* global module */

/* Magic Mirror
 * Node Helper: MMM-COVID19-Ampel
 *
 * By Daniel Osterkamp
 * MIT Licensed.
 */

var NodeHelper = require('node_helper')
var request = require('request')

var incidentURLPrefix = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=OBJECTID+%3D+'
var incidentURLSuffix = '&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=OBJECTID%2CBEZ%2Ccases7_per_100k%2Ccases7_bl_per_100k%2CGEN%2Clast_update&returnGeometry=false&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token='
module.exports = NodeHelper.create({
  start: function () {
    console.log('Starting node helper for: ' + this.name)
  },
  getIncidents: function(key) {
    var self = this
    var options = {
      method: 'GET',
      url: incidentURLPrefix + key + incidentURLSuffix,
      headers: {
      }
    }
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body)
        self.sendSocketNotification('INCIDENTS', result.features[0].attributes)
      }
    })
  },
  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'GET_INCIDENTS') {
      this.getIncidents(payload)
    }
  }
});
