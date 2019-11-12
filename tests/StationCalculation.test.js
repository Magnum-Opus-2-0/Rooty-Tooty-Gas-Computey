import StationCalculation from "../src/data/StationCalculation";

// Save the old console.error so we can put everything back where we found it
const oldErr = console.error;
// We need to save the console error data
let outputData = "";
let storelog = inputs => {outputData += inputs};

beforeEach(() => {
    // Mock the console error before each and reset outputData
    outputData = "";
    console.error = jest.fn(storelog);
});

// Put the everything back after each test we run
afterEach(() => {
    console.error = oldErr;
});

describe('Efficiency', () => {
    describe('Calculation', () => {
        test('Valid', () => {
            let sc = new StationCalculation();

            // toFixed returns a rounded string representation of the number
            expect(sc.calcEfficiency(23, 12, .75, debugGasData[0], userLocation).toFixed(2)).toBe('11.64');
        });

        describe('Invalid', () => {
            test('MPG', () => {
                let sc = new StationCalculation();

                expect(sc.calcEfficiency(0, 15, .47, debugGasData[1], userLocation)).toBe(-1);
                expect(outputData).toBe('StationCalculation.calcEfficiency: MPG cannot be less than or equal to 0.');
            });

            describe('Current volume out of range', () => {
                test('Too small', () => {
                    let sc = new StationCalculation();

                    expect(sc.calcEfficiency(50, 10, -.3, debugGasData[2], userLocation)).toBe(-1);
                    expect(outputData).toBe('StationCalculation.calcEfficiency: Current volume cannot be less than 0.');
                });

                test('Too big', () => {
                    let sc = new StationCalculation();

                    expect(sc.calcEfficiency(42, 11, 4, debugGasData[3], userLocation)).toBe(-1);
                    expect(outputData).toBe('StationCalculation.calcEfficiency: Current volume cannot be greater than' +
                        ' 1.');
                });
            });

            test('Max volume', () => {
                let sc = new StationCalculation();

                expect(sc.calcEfficiency(12, 0, .4, debugGasData[4], userLocation)).toBe(-1);
                expect(outputData).toBe('StationCalculation.calcEfficiency: Max volume cannot be less than or' +
                    ' equal to 0.');
            });
        });
    });
});

// 400 W Big Springs Rd
const userLocation = {
    latitude: 33.976450,
    longitude: -117.320160
};

const debugGasData = [
    {
        name: 'Arco',
        price: 3.82,
        coords: {
            latitude: 33.976067,
            longitude: -117.339343
        },
        key: 'key-arco-iowa',
    },
    {
        name: 'Shell',
        price: 4.00,
        coords: {
            latitude: 33.975381,
            longitude: -117.340335
        },
        key: 'key-shell-university',
    },
    {
        name: '76',
        price: 4.12,
        coords: {
            latitude: 33.983209,
            longitude: -117.341269
        },
        key: 'key-76-blaine',
    },
    {
        name: 'Arco',
        price: 3.80,
        coords: {
            latitude: 33.982567,
            longitude: -117.341772
        },
        key: 'key-arco-blaine',
    },
    {
        name: 'Shell',
        price: 4.38,
        coords: {
            latitude: 33.983350,
            longitude: -117.340284
        },
        key: 'key-arco-iowa',
    },
    {
        name: 'Chevron',
        price: 4.20,
        coords: {
            latitude: 33.955115,
            longitude: -117.332514
        },
        key: 'key-chevron-canyoncrest',
    },
    {
        name: 'Mobil',
        price: 4.05,
        coords: {
            latitude: 33.977036,
            longitude: -117.336895
        },
        key: 'key-mobil-university',
    }];
