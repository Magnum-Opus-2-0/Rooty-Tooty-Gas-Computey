import FuelEconomyGov from "../src/data/FuelEconomyGov";

// Suppress console messages
console.error = jest.fn();

// Save the old XMLHTTPRequest so we can put everything back where we found it
const oldReq = window.XMLHttpRequest;
// Global mocked request so we don't have to create a new one for each test/describe
let mockReq = null;

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

// Mock a new request before each test we run
beforeEach(() => {
    mockReq = createMockXHR();
    window.XMLHttpRequest = jest.fn(() => mockReq);
});

// Put the old request back after each test we run
afterEach(() => {
    window.XMLHttpRequest = oldReq;
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
    });

    test('Parsing failure', () => {
        let fe = new FuelEconomyGov();
        let years;

        mockReq.responseText = 'not xml';

        expect(fe.fetchYears()).toBeFalsy();
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
    });

    test('Request failure', () => {
        let fe = new FuelEconomyGov();

        mockReq.responseText = MAKES;
        mockReq.send = jest.fn();

        expect(fe.fetchYears()).toBeFalsy();
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
    });

    test('Invalid make', () => {
        let fe = new FuelEconomyGov();

        mockReq.responseText = INVALID_REQUEST;

        expect(fe.fetchModelsBy(2020, 'Monda')).toBeFalsy();
    });

    test('Request failure', () => {
        let fe = new FuelEconomyGov();

        mockReq.send = jest.fn();

        expect(fe.fetchModelsBy(2019, 'Acura')).toBeFalsy();
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
