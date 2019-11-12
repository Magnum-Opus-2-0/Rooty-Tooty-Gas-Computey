import StationCalculation from "../src/components/StationCalculation";

describe('Chass tests', () => {
    describe('Calculations', () => {
        test('Valid', () => {
            let sc = new StationCalculation();

            // toFixed returns a string
            expect(sc.calcChass(10, debugGasData[0], userLocation).toFixed(2)).toBe("2.38");
        });

        describe('Invalid', () =>{
            test('Divide by zero', () => {
                let sc = new StationCalculation();

                expect(sc.calcChass(15, debugGasData[1], debugGasData[1].coords)).toBe(-1);
            });

            test('Negative Chass', () => {
                let sc = new StationCalculation();

                expect(sc.calcChass(-20, debugGasData[1], userLocation)).toBe(-1);
            });
        });
    });

    describe('Comparisons', () => {
        test('Higher A', () => {
            let sc = new StationCalculation();

            expect(sc.compareChass(debugGasData[0], debugGasData[1], 15, userLocation)).toBe(-1);
        });

        test('Higher B', () => {
            let sc = new StationCalculation();

            expect(sc.compareChass(debugGasData[2], debugGasData[0], 50, userLocation)).toBe(1);
        });

        test('Equivalent', () => {
            let sc = new StationCalculation();

            expect(sc.compareChass(debugGasData[5], debugGasData[5], 23, userLocation)).toBe(0);
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
