var xml_parser = require('fast-xml-parser');
var he = require('he');

const API_ROOT = 'https://www.fueleconomy.gov/ws/rest/vehicle/';
/**
 * A class to pull data from the FuelEconomy.gov website.
 *
 * This class does not directly inherit from CarData, but has all of the same
 * functions.
 */
class FuelEconomyGov {

    /**
     * The functionality that should take place when we get our response.
     *
     * @access private
     *
     * @param req   {XMLHttpRequest}    The request object to check and retrieve
     *                                  data from.
     * @returns {string}    The XML response data as a string.
     */
    onload(req) {
        if (req.readyState === 4 && req.status === 200) {
            // Getting as text because parser takes string not XML
            return req.responseText;
        }
    }

    /**
     * Get the years available to us from FuelEconomy.gov.
     *
     * This is done synchronously so should only be done once, when the page
     * loads. Make sure this is NOT called in a render function, otherwise the
     * page will freeze every time the component is re-rendered.
     *
     * @returns {Array} The array of available years as strings or null if the
     *                  request or parsing failed.
     */
    fetchYears() {
        let xml;
        let ret;
        let req = new XMLHttpRequest();
        // Using synchronous open because we shouldn't load the page without the years
        req.open('GET', API_ROOT + 'menu/year', false);
        req.onload = () => { xml = this.onload(req); };
        req.send(null);

        if (xml) {
            ret = xml_parser.parse(xml);
            if (ret) {
                // This function is supposed to return only an array of years, so discard the extra stuff
                return ret.menuItems.menuItem.map(value => { return value.value.toString(); });
            } else {
                console.error('FuelEconomyGov.fetchYears: XML parsing failed.');
            }
        } else {
            console.error('FuelEconomyGov.fetchYears: XML http request failed.');
        }
        return null;
    }

    /**
     * Get the available makes for the given year from FuelEconomy.gov.
     *
     * This is currently done synchronously and this is wrong. I'd like to first
     * see how this effects the performance of the website, and if it is totally
     * unbearable, we will need to change the whole way we retrieve data.
     *
     * @param year  {string}    The string representation of the year to be
     *                          queried.
     * @returns {Array} An array containing all makes for the given year or null
     *                  if the request or parsing failed.
     */
    fetchMakesBy(year) {
        let xml;
        let ret;
        let req = new XMLHttpRequest();

        // This is sychronous for now. It should be asychronous, but I'm not sure what the best way to implement
        // that is.
        req.open('GET', API_ROOT + 'menu/make?year=' + year, false);
        req.onload = () => { xml = this.onload(req); };
        req.send(null);

        if (xml) {
            ret = xml_parser.parse(xml);
            if (ret) {
                return ret.menuItems.menuItem.map(value => { return value.value; });
            } else {
                console.error('FuelEconomyGov.fetchMakesBy: XML parsing failed.');
            }
        } else {
            console.error('FuelEconomyGov.fetchMakesBy: XML http request failed.');
        }

        return null;
    }

    fetchModelsBy(year, make) {
        let xml;
        let ret;
        let req = new XMLHttpRequest();

        req.open('GET', API_ROOT + 'menu/model?year=' + year + '&make=' + make, false);
        req.onload = () => { xml = this.onload(req); };
        req.send(null);

        if (xml) {
            ret = xml_parser.parse(xml);
            if (ret) {
                return ret.menuItems.menuItem.map(value => { return value.value; });
            } else {
                console.error('FuelEconomyGov.fetchModelsBy: XML parsing failed.');
            }
        } else {
            console.error('FuelEconomyGov.fetchModelsBy: XML http request failed.');
        }

        return null;
    }
}

export default FuelEconomyGov;