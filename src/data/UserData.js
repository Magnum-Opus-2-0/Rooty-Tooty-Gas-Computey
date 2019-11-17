
export default {
    /**
     * The data for the user's car.
     *
     * Defaults to null if data has not yet been retrieved.
     *
     * @type {object}
     */
    car: null,

    /**
     * The user's location.
     *
     * An object with two properties: latitude and longitude.
     *
     * @type {object}
     */
    location: {
        /**
         * The latitude coordinate of the user's position.
         *
         * @type {number}
         */
        latitude: 0,

        /**
         * The longitude coordinate of the user's position.
         *
         * @type {number}
         */
        longitude: 0
    },

    /**
     * The user's tank size in gallons.
     *
     * Defaults to -1 if input has not yet been received.
     *
     * @type {number}
     */
    tankSize: -1,

    /**
     * The current fill of the user's tank represented as a fraction between 0
     * and 1 inclusive.
     *
     * Defaults to -1 if input has not yet been received.
     *
     * @type {number}
     */
    tankFill: -1
}