/**
 * An interface for all classes that will reference a car info database.
 *
 * Interfaces aren't really a thing in JS, so this is really more of a template
 * describing the functions that each class should have.
 *
 * All functions describe what they should return, but in reality will return either
 * null or empty arrays depending upon their types.
 */
class CarData {

    /**
     * Gets the available years from a database.
     *
     * @returns {Array} An array of years. The type of representation is not
     *                  important as long as it can be displayed in a dropdown.
     */
    fetchYears() {
        return [];
    }

    /**
     * Gets the available makes for a given year from a database.
     *
     * @param {*}   year The year in which to search for makes. Type is database
     *                   dependent.
     * @returns {Array} An array of makes.
     */
    fetchMakesBy(year) {
        return [];
    }

    /**
     * Gets the available models for a given make and year from a database.
     *
     * @param {*}   year    The year in which to search for makes. Type is database
     *                      dependent.
     * @param {*}   make    The make of which to search for models. Type is database
     *                      dependent.
     * @returns {Array} An array of models.
     */
    fetchModelsBy(year, make) {
        return [];
    }

    /**
     * Gets the available options for a given make, model and year from a
     * database.
     *
     * @param {*}   year    The year in which to search for options. Type is
     *                      database dependent.
     * @param {*}   make    The make of which to search for options. Type is
     *                      database dependent.
     * @param {*}   model   The model of which to search for options. Type is
     *                      database dependent.
     * @returns {Array} An array of options.
     */
    fetchOptionsBy(year, make, model) {
        return [];
    }

    /**
     * Gets the car data from a database using the given id.
     *
     * @param {*}   id  The id of the car in the database.
     * @returns {object}    The car represented as an object.
     */
    fetchCarBy(id) {
        return null;
    }
}

export default CarData;