import StationCalculation from "../src/data/StationCalculation";
import user from "../src/data/UserData";

// Save the old console.error so we can put everything back where we found it
const oldErr = console.error;
// We need to save the console error data
let outputData = "";
let storelog = inputs => {outputData += inputs};

function resetUser() {
    user.car = null;
    user.location.latitude = 0;
    user.location.longitude = 0;
    user.tankSize = -1;
    user.tankFill = -1;
}

beforeEach(() => {
    // Mock the console error before each and reset outputData
    outputData = "";
    console.error = jest.fn(storelog);
});

// Put the everything back after each test we run
afterEach(() => {
    console.error = oldErr;
    resetUser();
});

describe('Compare Price', () => {
    test('A < B', () => {
        let sc = new StationCalculation();
        console.log(debugGasData[0])
        expect(sc.comparePrice(debugGasData[0], debugGasData[2])).toBe(-1);
    });

    test('A = B', () => {
        let sc = new StationCalculation();

        expect(sc.comparePrice(debugGasData[4], debugGasData[4])).toBe(0);
    });

    test('A > B', () => {
        let sc = new StationCalculation();

        expect(sc.comparePrice(debugGasData[6], debugGasData[3])).toBe(1);
    });
});

describe('Distance', () => {
    describe('Calculate', () => {
        test('Valid', () => {
            let sc = new StationCalculation();

            expect(sc.calcDistance(debugGasData[5].coords, userLocation).toFixed(2)).toBe('1.64');
        });

        test('Invalid', () => {
            let sc = new StationCalculation();

            expect(sc.calcDistance(undefined, userLocation)).toBe(-1);
            expect(outputData).toBe('StationCalculation.calcDistance: Received undefined location.');
        });
    });

    describe('Compare', () => {
        test('A < B', () => {
            let sc = new StationCalculation();

            expect(sc.compareDistance(debugGasData[6], debugGasData[0], userLocation)).toBe(-1);
        });

        test('A = B', () => {
            let sc = new StationCalculation();

            expect(sc.compareDistance(debugGasData[4], debugGasData[4], userLocation)).toBe(0);
        });

        test('A > B', () => {
            let sc = new StationCalculation();

            expect(sc.compareDistance(debugGasData[2], debugGasData[0], userLocation)).toBe(1);
        });
    });
});

describe('Cost', () => {
    describe('Calculation', () => {
        describe('Valid', () => {
            test('All params', () => {
                let sc = new StationCalculation();

                // toFixed returns a rounded string representation of the number
                expect(sc.calcCost(23, 12, .75, debugGasData[0], userLocation).toFixed(2)).toBe('11.64');
            });

            test('User Data', () => {
                let sc = new StationCalculation();

                user.mpg = 30;
                user.tankSize = 15;
                user.tankFill = .12;
                user.location = userLocation;

                expect(sc.calcCostUser(debugGasData[0], user).toFixed(2)).toBe('50.56');
            });
        });


        describe('Invalid', () => {
            test('MPG', () => {
                let sc = new StationCalculation();

                expect(sc.calcCost(0, 15, .47, debugGasData[1], userLocation)).toBe(-1);
                expect(outputData).toBe('StationCalculation.calcCost: MPG cannot be less than or equal to 0.');
            });

            describe('Current volume out of range', () => {
                test('Too small', () => {
                    let sc = new StationCalculation();

                    expect(sc.calcCost(50, 10, -.3, debugGasData[2], userLocation)).toBe(-1);
                    expect(outputData).toBe('StationCalculation.calcCost: Current volume cannot be less than 0.');
                });

                test('Too big', () => {
                    let sc = new StationCalculation();

                    expect(sc.calcCost(42, 11, 4, debugGasData[3], userLocation)).toBe(-1);
                    expect(outputData).toBe('StationCalculation.calcCost: Current volume cannot be greater than' +
                        ' 1.');
                });
            });

            test('Max volume', () => {
                let sc = new StationCalculation();

                expect(sc.calcCost(12, 0, .4, debugGasData[4], userLocation)).toBe(-1);
                expect(outputData).toBe('StationCalculation.calcCost: Max volume cannot be less than or' +
                    ' equal to 0.');
            });
        });
    });

    describe('Compare', () => {
        describe('Valid', () => {
            describe('All parameters', () => {
                test('Station A more cost than B', () => {
                    let sc = new StationCalculation();

                    // debugGas[0]: 13.67
                    // debugGas[1]: 14.33
                    expect(sc.compareCost(debugGasData[0], debugGasData[1], 14, 10, .75, userLocation)).toBe(-1);
                });

                test('Station A is exactly as cost as B', () => {
                    let sc = new StationCalculation();

                    expect(sc.compareCost(debugGasData[2], debugGasData[2], 15, 11, .23, userLocation)).toBe(0);
                });

                test('Station A is less cost than B', () => {
                    let sc = new StationCalculation();

                    // debugGas[4]: 19.26
                    // debugGas[5]: 18.57
                    expect(sc.compareCost(debugGasData[4], debugGasData[5], 16, 8, .46, userLocation)).toBe(-1);
                });
            });

            test('User Data', () => {
                let sc = new StationCalculation();

                user.mpg = 20;
                user.tankSize = 11;
                user.tankFill = .62;
                user.location = userLocation;

                expect(sc.compareCostUser(debugGasData[0], debugGasData[4], user)).toBe(-1);
            });
        });

        test('Invalid calculation', () => {
                let sc = new StationCalculation();

                expect(sc.compareCost(debugGasData[0], debugGasData[1], 0, 14, .5, userLocation)).toBeNull();
                // Both calculations fail because mpg is 0, so we get two console errors
                expect(outputData).toBe('StationCalculation.calcCost: MPG cannot be less than or equal to 0.' +
                    'StationCalculation.calcCost: MPG cannot be less than or equal to 0.');
            });
    });
});

test('Degree to radians', () => {
    let sc = new StationCalculation();

    expect(sc.degToRad(360)).toBe(2 * Math.PI);
});

// 400 W Big Springs Rd
const userLocation = {
    latitude: 33.976450,
    longitude: -117.320160
};

const debugGasData = [
    {
        name: 'Arco',
        prices: {
            regular: 3.82, // distance 1.10 miles to userLocation
            mid: 4.06,
            premium: 4.18
        },
        coords: {
            latitude: 33.976067,
            longitude: -117.339343
        },
        key: 'key-arco-iowa',
    },
    {
        name: 'Shell',
        prices: {
            regular: 4.00,
            mid: 4.26,
            premium: 4.38
        },
        coords: {
            latitude: 33.975381,
            longitude: -117.340335
        },
        key: 'key-shell-university',
    },
    {
        name: '76',
        prices: {
            regular: 4.12,
            mid: 4.38,
            premium: 4.51
        },
        coords: {
            latitude: 33.983209,
            longitude: -117.341269
        },
        key: 'key-76-blaine',
    },
    {
        name: 'Arco',
        prices: {
            regular: 3.80,
            mid: 4.05,
            premium: 4.16
        },
        coords: {
            latitude: 33.982567,
            longitude: -117.341772
        },
        key: 'key-arco-blaine',
    },
    {
        name: 'Shell',
        prices: {
            regular: 4.20,
            mid: 4.47,
            premium: 4.60
        },
        coords: {
            latitude: 33.983350,
            longitude: -117.340284
        },
        key: 'key-arco-iowa',
    },
    {
        name: 'Chevron',
        prices: {
            regular: 4.20,
            mid: 4.47,
            premium: 4.60
        },
        coords: {
            latitude: 33.955115,
            longitude: -117.332514
        },
        key: 'key-chevron-canyoncrest',
    },
    {
        name: 'Mobil',
        prices: {
            regular: 4.05,
            mid: 4.31,
            premium: 4.43
        },
        coords: {
            latitude: 33.977036,
            longitude: -117.336895
        },
        key: 'key-mobil-university',
    }];
