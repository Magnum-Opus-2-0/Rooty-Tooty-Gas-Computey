import user from '../src/data/UserData';

function resetUser() {
    user.mpg = -1;
    user.carID = "";
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
    test('MPG', () => {
        expect(user.mpg).toBe(-1);
    });

    test('Car ID', () => {
        expect(user.carID).toBe("");
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
    test('MPG', () => {
        user.mpg = 34;

        expect(user.mpg).toBe(34);
    });

    test('Car ID', () => {
        user.carID = '1232';

        expect(user.carID).toBe('1232');
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
