
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
     * Function to compare stations by smart calculation efficiency.
     *
     * Sorts in ascending order by efficiency. That is, the smaller the value of
     * efficiency, the better.
     *
     * @param {Object}  stationA        An object with a coords property to
     *                                  compare.
     * @param {Object}  stationB        An object with a coords property to
     *                                  compare.
     * @param {number}  mpg             The miles per gallon to use in the
     *                                  efficiency calculation.
     * @param {number}  volumeMax       The tank size in gallons.
     * @param {number}  volumeCur       The current amount of gas as a fraction
     *                                  between 0 and 1 (inclusive).
     * @param {Object}  userLocation    An object with latitude and longitude
     *                                  properties to compare against.
     * @returns {number}    -1 if stationA has a higher efficiency than
     *                      stationB, 0 if stationA has an equivalent efficiency
     *                      to stationB, 1 if stationB has a higher efficiency
     *                      than stationA, or null if there was an invalid
     *                      calculation.
     */
    compareEfficiency(stationA, stationB, mpg, volumeMax, volumeCur, userLocation) {
        const effA = this.calcEfficiency(mpg, volumeMax, volumeCur, stationA, userLocation);
        const effB = this.calcEfficiency(mpg, volumeMax, volumeCur, stationB, userLocation);

        if (effA < 0 || effB < 0) {
            // calcEfficiency outputs an error message if a there was an invalid calculation.
            return null;
        }
        // If we want A to be first, then A will be smaller and we get a -1 from this function
        // and vice versa.
        return Math.sign(effA - effB);
    }

    /**
     * Calculate the efficiency of driving to the specified gas station.
     *
     * Function assumes the user will fill their tank when they arrive at the
     * gas station.
     *
     * Smaller efficiency values are better.
     *
     * See {@link https://drive.google.com/file/d/1_uL6mnitSZnn2MbzMCN9XM5LLKvu1r85/view}
     *
     * @param {number}  mpg             The miles per gallon.
     * @param {number}  volumeMax       The tank size in gallons.
     * @param {number}  volumeCur       The current amount of gas as a fraction
     *                                  between 0 and 1 (inclusive).
     * @param {object}  station         An object representing the gas station.
     *                                  The object must contain a coords
     *                                  property with latitude and longitude
     *                                  properties and a price property.
     * @param {object}  userLocation    An object representing the user's
     *                                  location. The object must include the
     *                                  properties latitude and longitude.
     * @returns {number}    A number representing the efficiency of driving to
     *                      the specified gas station.
     */
    calcEfficiency(mpg, volumeMax, volumeCur, station, userLocation) {
        if (mpg <= 0) {
            console.error('StationCalculation.calcEfficiency: MPG cannot be less than or equal to 0.');
            return -1;
        }
        if (volumeMax <= 0) {
            console.error('StationCalculation.calcEfficiency: Max volume cannot be less than or equal to 0.');
            return -1;
        }
        if (volumeCur > 1) {
            console.error('StationCalculation.calcEfficiency: Current volume cannot be greater than 1.');
            return -1;
        }
        if (volumeCur < 0) {
            console.error('StationCalculation.calcEfficiency: Current volume cannot be less than 0.');
            return -1;
        }

        let dist = this.calcDistance(station.coords, userLocation);
        return station.price * ((dist / mpg) + volumeMax * (1 - volumeCur));
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