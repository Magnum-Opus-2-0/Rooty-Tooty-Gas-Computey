import FuelEconomyGov from "../src/data/FuelEconomyGov";

// Because the tests are being run using Node.js, we must use a package that provides it for us.
window.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// Suppress console messages
console.error = jest.fn();

// Save the old XMLHTTPRequest so we can put everything back where we found it
const oldReq = window.XMLHttpRequest;
// Global mocked request so we don't have to create a new one for each test/describe
let mockReq = null;

// Save the old console.error so we can put everything back where we found it
const oldErr = console.error;
// We need to save the console error data
let outputData = "";
let storelog = inputs => {outputData += inputs};

/**
 * Factory to create mock XML HTTP Request objects.
 * @param responseXML  {string} A string representing the XML response.
 */
const createMockXHR = responseXML => {
    const mockXHR = {
        open: jest.fn(),
        // We want to simulate immediately returning the requested data
        send: jest.fn(function() { this.onload() }),
        readyState: 4,
        status: 200,
        responseText: (responseXML || ''),
        onload: jest.fn()
    };
    return mockXHR;
};

beforeEach(() => {
    // Mock a new request before each test we run
    mockReq = createMockXHR();
    window.XMLHttpRequest = jest.fn(() => mockReq);
    // Mock the console error before each and reset outputData
    outputData = "";
    console.error = jest.fn(storelog);
});

// Put the everything back after each test we run
afterEach(() => {
    window.XMLHttpRequest = oldReq;
    console.error = oldErr;
});

describe('Year data', () => {
    test('Valid request', () => {
        let fe = new FuelEconomyGov();
        let years;

        mockReq.responseText = YEARS;

        years = fe.fetchYears();

        expect(years).toHaveLength(3);
        expect(years[0]).toBe('2020');
        expect(years[1]).toBe('2019');
        expect(years[2]).toBe('2018');
    });

    test('Request failure', () => {
        let fe = new FuelEconomyGov();

        // Mock a send function that never gets data
        mockReq.send = jest.fn();
        mockReq.responseText = YEARS;

        expect(fe.fetchYears()).toBeFalsy();
        expect(outputData).toBe('FuelEconomyGov.fetchYears: XML http request failed.')
    });

    test('Parsing failure', () => {
        let fe = new FuelEconomyGov();
        let years;

        mockReq.responseText = 'not xml';

        expect(fe.fetchYears()).toBeFalsy();
        expect(outputData).toBe('FuelEconomyGov.fetchYears: XML parsing failed.')
    });

    test('Real HTTP request', () => {
        let fe = new FuelEconomyGov();
        let years;

        // Switch to the original XML request rather than the mocked one
        window.XMLHttpRequest = oldReq;

        years = fe.fetchYears();

        expect(years).toBeTruthy();
        expect(years.length).toBeDefined();
        expect(years.length).toBeGreaterThan(0);

        // This should always be true unless the website update their database to contain more older car data
        expect(years[years.length - 1]).toBe('1984');
    });
});

describe('Make data', () => {
    test('Valid request', () => {
        let fe = new FuelEconomyGov();
        let makes;

        mockReq.responseText = MAKES;

        makes = fe.fetchMakesBy(2012);

        expect(makes).toHaveLength(4);
        expect(makes[0]).toBe('Honda');
        expect(makes[1]).toBe('Tesla');
        expect(makes[2]).toBe('Acura');
        expect(makes[3]).toBe('Chevrolet');
    });

    test('Invalid year', () => {
        let fe = new FuelEconomyGov();

        mockReq.responseText =  INVALID_REQUEST;

        expect(fe.fetchMakesBy(1)).toBeFalsy();
        expect(outputData).toBe('FuelEconomyGov.fetchMakesBy: XML parsing failed.')
    });

    test('Request failure', () => {
        let fe = new FuelEconomyGov();

        mockReq.responseText = MAKES;
        mockReq.send = jest.fn();

        expect(fe.fetchMakesBy()).toBeFalsy();
        expect(outputData).toBe('FuelEconomyGov.fetchMakesBy: XML http request failed.')
    });

    test('Real HTTP request', () => {
        let fe = new FuelEconomyGov();
        let makes;

        window.XMLHttpRequest = oldReq;

        makes = fe.fetchMakesBy(2020);

        expect(makes).toBeTruthy();
        expect(makes.length).toBeDefined();
        expect(makes.length).toBeGreaterThan(0);

        // This should never change because we will always access the 2020 year
        expect(makes[0]).toBe('Acura');
    });
});

describe('Model data', () => {
    test('Valid models', () => {
        let fe = new FuelEconomyGov();
        let models;

        mockReq.responseText = MODELS;

        models = fe.fetchModelsBy(2020, 'Honda');

        expect(models).toHaveLength(3);
        expect(models[0]).toBe('Civic');
        expect(models[1]).toBe('Accord');
        expect(models[2]).toBe('Fit');
    });

    test('Invalid year', () => {
        let fe = new FuelEconomyGov();

        mockReq.responseText = INVALID_REQUEST;

        expect(fe.fetchModelsBy(10, 'Tesla')).toBeFalsy();
        expect(outputData).toBe('FuelEconomyGov.fetchModelsBy: XML parsing failed.')
    });

    test('Invalid make', () => {
        let fe = new FuelEconomyGov();

        mockReq.responseText = INVALID_REQUEST;

        expect(fe.fetchModelsBy(2020, 'Monda')).toBeFalsy();
        expect(outputData).toBe('FuelEconomyGov.fetchModelsBy: XML parsing failed.')
    });

    test('Request failure', () => {
        let fe = new FuelEconomyGov();

        mockReq.send = jest.fn();

        expect(fe.fetchModelsBy(2019, 'Acura')).toBeFalsy();
        expect(outputData).toBe('FuelEconomyGov.fetchModelsBy: XML http request failed.')
    });

    test('Real HTTP request', () => {
        let fe = new FuelEconomyGov();
        let models;

        window.XMLHttpRequest = oldReq;

        models = fe.fetchModelsBy(2019, 'Honda');

        expect(models).toBeTruthy();
        expect(models.length).toBeDefined();
        expect(models.length).toBeGreaterThan(0);

        // Hopefully this will not change since we're accessing a past year
        expect(models[0]).toBe('Accord');
    });
});


const YEARS =
    `<menuItems>
        <menuItem>
            <text>
                2020
            </text>
            <value>
                2020
            </value>
        </menuItem>
        <menuItem>
            <text>
                2019
            </text>
            <value>
                2019
            </value>
        </menuItem>
        <menuItem>
            <text>
                2018
            </text>
            <value>
                2018
            </value>
        </menuItem>
    </menuItems>`;

const MAKES =
    `<menuItems>
        <menuItem>
            <text>
                Honda
            </text>
            <value>
                Honda
            </value>
        </menuItem>
        <menuItem>
            <text>
                Tesla
            </text>
            <value>
                Tesla
            </value>
        </menuItem>
        <menuItem>
            <text>
                Acura
            </text>
            <value>
                Acura
            </value>
        </menuItem>
        <menuItem>
            <text>
                Chevrolet
            </text>
            <value>
                Chevrolet
            </value>
        </menuItem>
    </menuItems>`;

const MODELS =
    `<menuItems>
        <menuItem>
            <text>
                Civic
            </text>
            <value>
                Civic
            </value>
        </menuItem>
        <menuItem>
            <text>
                Accord
            </text>
            <value>
                Accord
            </value>
        </menuItem>
        <menuItem>
            <text>
                Fit
            </text>
            <value>
                Fit
            </value>
        </menuItem>
    </menuItems>`;

const INVALID_REQUEST = `</menuItems>`;
