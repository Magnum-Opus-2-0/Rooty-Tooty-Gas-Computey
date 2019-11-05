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
     * Get the years available to us from FuelEconomy.gov.
     *
     * This is done synchronously so should only be done once, when the page
     * loads. Make sure this is NOT called in a render function, otherwise the
     * page will freeze every time the component is re-rendered.
     *
     * @returns {Array} The array of available years as strings or null if the
     *                  request failed.
     */
    fetchYears() {
        let xml;
        let ret;
        let req = new XMLHttpRequest();
        // Using synchronous open because we shouldn't load the page without the years
        req.open('GET', API_ROOT + 'menu/year', false);
        req.onload = () => {
            if (req.readyState === 4 && req.status === 200) {
                // Getting as text because parser takes string not XML
                xml = req.responseText;
            }
        };

        req.send(null);

        if (xml) {
            ret = xml_parser.parse(xml);
            if (ret) {
                // This function is supposed to return only an array of years, so discard the extra stuff
                return ret.menuItems.menuItem.map(value => { return value.value.toString() });
            } else {
                console.error('FuelEconomyGov.fetchYears: XML parsing failed.');
            }
        } else {
            console.error('FuelEconomyGov.fetchYears: XML http request Failed.');
        }
        return null;
    }
}

export default FuelEconomyGov;