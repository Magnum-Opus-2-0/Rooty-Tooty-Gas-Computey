import FuelEconomyGov from "../src/data/FuelEconomyGov";

// Suppress console messages
console.error = jest.fn();

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

describe('Year data', () => {
    // Save the old XMLHTTPRequest so we can put everything back where we found it
    const oldReq = window.XMLHttpRequest;
    let mockReq = null;

    // Mock a new request before each test we run
    beforeEach(() => {
        mockReq = createMockXHR();
        window.XMLHttpRequest = jest.fn(() => mockReq);
    });

    // Put the old request back after each test we run
    afterEach(() => {
        window.XMLHttpRequest = oldReq;
    });

    test('Valid request', () => {
        let fe = new FuelEconomyGov();
        let years;

        mockReq.responseText = YEARS;

        years = fe.fetchYears();

        expect(years.length).toBe(3);
        expect(years[0]).toBe('2020');
        expect(years[1]).toBe('2019');
        expect(years[2]).toBe('2018');
    });

    test('Invalid request', () => {
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
