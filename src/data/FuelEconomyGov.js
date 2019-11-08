var xml_parser = require('fast-xml-parser');
var he = require('he');

/**
 * The root URL for FuelEconomy.gov's API calls.
 * @type {string}
 */
const API_ROOT = 'https://www.fueleconomy.gov/ws/rest/vehicle/';

/**
 * A class to pull data from the FuelEconomy.gov website.
 *
 * This class does not directly inherit from CarData, but has all of the same
 * functions.
 */
class FuelEconomyGov {

    /**
     * Make an XMLHttpRequest at the given API_ROOT and given apiExtension.
     *
     * This is currently done synchronously and this is wrong. I'd like to first
     * see how this effects the performance of the website, and if it is totally
     * unbearable, we will need to change the way we store the fetched data.
     *
     * @see API_ROOT
     *
     * @param apiExtension  {string}    The extension of the API_ROOT at which
     *                                  to make the request.
     * @returns {string}    A string representation of the XML data returned from
     *                      FuelEconomy.gov
     */
    makeRequest(apiExtension) {
        let ret = null;
        let req = new XMLHttpRequest();
        req.open('GET', API_ROOT + apiExtension, false);
        req.onload = () => {
            if (req.readyState === 4 && req.status === 200) {
                // Getting as text because parser takes string not XML
                ret = req.responseText;
            }
        };
        req.send(null);
        return ret;
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
        let ret;
        let xml = this.makeRequest('menu/year');

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
     * @param year  {string|number} The year in which to search for makes.
     *
     * @returns {Array} An array containing all makes for the given year or null
     *                  if the request or parsing failed.
     */
    fetchMakesBy(year) {
        let ret;
        let xml = this.makeRequest('menu/make?year=' + year);

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

    /**
     * Get the available models for the given year and make from
     * FuelEconomy.gov.
     *
     * This is currently done synchronously and this is wrong. I'd like to first
     * see how this effects the performance of the website, and if it is totally
     * unbearable, we will need to change the way we retrieve data.
     *
     * @param year  {string|number} The year in which to search for models.
     * @param make  {string}        The make in which to search for models.
     * @returns {Array} An array containing all the models for the given year
     *                  and make or null if the request or parsing failed.
     */
    fetchModelsBy(year, make) {
        let ret;
        let xml = this.makeRequest('menu/model?year=' + year + '&make=' + make);

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