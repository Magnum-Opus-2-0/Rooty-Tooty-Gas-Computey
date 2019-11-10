
class StationCalculation {

    /**
     * Function to compare stations by price.
     *
     * Sorts in ascending order by an object's price property. Used by
     * Array.prototype.sort().
     *
     * @param {Object}  stationA    A gas station data object to compare.
     * @param {Object}  stationB    A gas station data object to compare.
     *
     * @returns {number}    -1 if priceA < priceB, 0 if priceA == priceB, or 1
     *                      otherwise.
     */
    comparePrice(stationA, stationB) {
        if (stationA.price < stationB.price) {
            return -1;
        } else if (stationA.price === stationB.price) {
            return 0;
        }

        return 1;
    }

    /**
     * Function to compares stations by distance.
     *
     * Sorts in ascending order by distance between stations and the user.
     *
     * @param {Object}  stationA        An object with a coords property to
     *                                  compare.
     * @param {Object}  stationB        An object with a coords property to
     *                                  compare.
     * @param {Object}  userLocation    An object with latitude and longitude
     *                                  properties to compare against.
     * @returns {number}    -1 if stationA is closer than stationB, 0 if
     *                      stationA is the same distance as stationB, or 1
     *                      otherwise.
     */
    compareDistance(stationA, stationB, userLocation) {
        const distA = this.calcDistance(stationA.coords, userLocation);
        const distB = this.calcDistance(stationB.coords, userLocation);
        if (distA < distB) {
            return -1;
        } else if (distA === distB) {
            return 0;
        }

        return 1;
    }

    /**
     * Calculate the distance in miles between two coordinates
     * (latitude, longitude).
     *
     * @param {Object}  locationA   An object with the properties latitude and
     *                              longitude to calculate.
     * @param {Object}  locationB   An object with the properties latitude and
     *                              longitude to calculate.
     * @returns {number}    The distance in miles between the coordinates, or -1
     *                      if either locationA or locationB is undefined.
     */
    calcDistance(locationA, locationB) {
        const RADIUS = 3958.8; // Miles
        if(typeof locationA === 'undefined' || typeof locationB === 'undefined'){
            return -1;
        }
        else {
            let lat1 = this.degToRad(locationA.latitude);
            let lon1 = this.degToRad(locationA.longitude);
            let lat2 = this.degToRad(locationB.latitude);
            let lon2 = this.degToRad(locationB.longitude);

            let dlon = lon2 - lon1;
            let dlat = lat2 - lat1;

            let a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return RADIUS * c;
        }
    }

    /**
     * Function to compare stations by Chass's.
     *
     * Sorts in descending order by Chass's. 1 Chass is defined as the
     * efficiency of driving to the specified gas station, or the inverse of
     * money (1/$).
     *
     * @param {Object}  stationA        An object with a coords property to
     *                                  compare.
     * @param {Object}  stationB        An object with a coords property to
     *                                  compare.
     * @param {number}  mpg             The miles per gallon to use in the Chass
     *                                  calculation.
     * @param {Object}  userLocation    An object with latitude and longitude
     *                                  properties to compare against.
     * @returns {number}    -1 if stationA has a higher Chass than stationB, 0
     *                      if stationA has an equivalent Chass to stationB, or
     *                      1 otherwise.
     */
    compareChass(stationA, stationB, mpg, userLocation) {
        const chassA = this.calcChass(mpg, stationA, userLocation);
        const chassB = this.calcChass(mpg, stationB, userLocation);

        if (chassA > chassB) {
            return -1;
        } else if (chassA === chassB) {
            return 0;
        }

        return 1;
    }

    /**
     * Calculate the Chass's between the user and a given station.
     *
     * 1 Chass is defined as the efficiency of driving to the specified gas
     * station, or the inverse of money (1/$).
     *
     * @see calcDistance
     *
     * @param {number} mpg              The miles per gallon to use for this
     *                                  calculation.
     * @param {object} station          The station data to use for this
     *                                  calculation. It must have the property
     *                                  coord which contains latitude and
     *                                  longitude properties.
     * @param {object} userLocation     The user's location. It must have the
     *                                  properties latitude and longitude.
     *
     * @returns {number}    The Chass's for the given gas station, station, and
     *                      mpg or -1 if the calculated distance or price is
     *                      zero.
     */
    calcChass(mpg, station, userLocation) {
        let dist = this.calcDistance(station.coords, userLocation);
        if (dist <= 0 || station.price <= 0 || mpg <= 0) {
            return -1;
        }
        return mpg / (dist * station.price);
    }

    /**
     * Convert degrees to radians.
     *
     * @param {number}  degrees An angle in degrees.
     * @returns {number}    The converted angle in radians.
     */
    degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
}

export default StationCalculation;