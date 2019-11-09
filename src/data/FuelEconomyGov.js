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
 *
 * XML PARSER EXPLANATION:
 * After the XML data has been returned from FuelEconomy.gov, and it has been
 * parsed, it will be in one of the following formats:
 *      - If there are multiple objects
 *          {
 *              menuItems: {
 *                  menuItem: {
 *                      [
 *                          data_0,
 *                          data_1,
 *                          ...
 *                          data_n
 *                      ]
 *                  }
 *              }
 *          }
 *      - If there is only one object
 *          {
 *              menuItems: {
 *                  data
 *              }
 *          }
 *
 * The object 'data' will always have the following format:
 *      {
 *          text: text_data,
 *          value: value_data
 *      }
 *
 * The value property will differ depending on what is fetched. Years, makes,
 * and models will always contain the same value for both text and value, i.e.
 * the year, make, or model respectively. Options' value property will contain
 * the car ID.
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
     * Pulls the array of fetched data out of the parsed XML object.
     *
     * If the data in the parsed XML object is not an array, it is converted to
     * one.
     *
     * @param data  {object}    The parsed XML object.
     * @returns {Array} An array representing the fetched data, without the
     *                  menuItems.menuItem wrapping object. I.e. the data can be
     *                  accessed from the returned array directly.
     */
    getArray(data) {
        let ret = data.menuItems.menuItem;

        if (ret instanceof Array) {
            return ret;
        }

        return [ret];
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
                ret = this.getArray(ret);
                // This function is supposed to return only an array of years, so discard the extra stuff
                return ret.map(value => { return value.value.toString(); });
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
                // In the case that we only got one element back, we want to make sure we return the data as an array.
                ret = this.getArray(ret);
                return ret.map(value => { return value.value; });
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
     * @param make  {string}        The make for which to search for models.
     * @returns {Array} An array containing all the models for the given year
     *                  and make or null if the request or parsing failed.
     */
    fetchModelsBy(year, make) {
        let ret;
        let xml = this.makeRequest('menu/model?year=' + year + '&make=' + make);

        if (xml) {
            ret = xml_parser.parse(xml);
            if (ret) {
                // In the case that we only got one element back, we want to make sure we return the data as an array.
                ret = this.getArray(ret);
                return ret.map(value => { return value.value; });
            } else {
                console.error('FuelEconomyGov.fetchModelsBy: XML parsing failed.');
            }
        } else {
            console.error('FuelEconomyGov.fetchModelsBy: XML http request failed.');
        }

        return null;
    }

    /**
     * Get the available options for the given year, make, and model from
     * FuelEconomy.gov.
     *
     * This is done synchronously so it will probably need to be changed.
     *
     * @param year  {string|number} The year in which to search for options.
     * @param make  {string}        The make for which to search for options.
     * @param model {string}        The model for which to search for options.
     * @returns {Array} An array containing objects with the properties opt
     *                  and id.
     */
    fetchOptionsBy(year, make, model) {
        let ret;
        let xml = this.makeRequest('menu/options?year=' + year + '&make=' + make + '&model=' + model);

        if (xml) {
            ret = xml_parser.parse(xml);
            if (ret) {
                // In the case that we only got one element back, we want to make sure we return the data as an array.
                ret = this.getArray(ret);
                // We want to remap the properties to ones that are more descriptive
                return ret.map(value => {
                    return {
                        opt: value.text,
                        id: value.value
                    };
                });
            } else {
                console.error('FuelEconomyGov.fetchOptionsBy: XML parsing failed.');
            }
        } else {
            console.error('FuelEconomyGov.fetchOptionsBy: XML http request failed.');
        }

        return null;
    }


    fetchCarBy(id) {
        let ret;
        let xml = this.makeRequest('/' + id);

        if (xml) {
            ret = xml_parser.parse(xml).vehicle;
            if (ret) {
                return ret;
            } else {
                console.error('FuelEconomyGov.fetchCarBy: XML parsing failed.');
            }
        } else {
            console.error('FuelEconomyGov.fetchCarBy: XML http request failed.');
        }

        return null;
    }
}

export default FuelEconomyGov;