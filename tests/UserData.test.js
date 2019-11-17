import user from '../src/data/UserData';

function resetUser() {
    user.car = null;
    user.location.latitude = 0;
    user.location.longitude = 0;
    user.tankSize = -1;
    user.tankFill = -1;
}

afterEach(() => {
    resetUser();
});

describe('Continuity check', () => {
    test('Change some values', () => {
        user.tankSize = 10;

        expect(user.tankSize).toBe(10);
    });

    test('Check previously changed values', () => {
        // user should maintain its default values between tests
        expect(user.tankSize).toBe(-1);
    });
});

describe('Default values', () => {
    test('Car', () => {
        expect(user.car).toBeNull();
    });

    test('Location', () => {
        expect(user.location.latitude).toBe(0);
        expect(user.location.longitude).toBe(0);
    });

    test('Tank Size', () => {
        expect(user.tankSize).toBe(-1);
    });

    test('Tank Fill', () => {
        expect(user.tankFill).toBe(-1);
    });
});

describe('Change values', () => {
    test('Car', () => {
        user.car = { make: 'Honda', model: 'Civic', year: 2020, mpg: 32 };

        expect(user.car).toEqual({ make: 'Honda', model: 'Civic', year: 2020, mpg: 32 });
    });

    describe('Location', () => {
        test('Latitude', () => {
            user.location.latitude = 32.48523;

            expect(user.location.latitude).toBe(32.48523);
        });

        test('Longitude', () => {
            user.location.longitude = -143.57392;

            expect(user.location.longitude).toBe(-143.57392);
        });
    });

    test('Tank Size', () => {
        user.tankSize = 25;

        expect(user.tankSize).toBe(25);
    });

    test('Tank Fill', () => {
        user.tankFill = .5;

        expect(user.tankFill).toBe(.5);
    });
});
