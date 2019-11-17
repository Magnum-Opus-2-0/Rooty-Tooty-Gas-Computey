class GasStationWrapper {

	constructor(name='MexiCali', price, lat, lng, key) {

		this.name = name;
		// If NaN, make it an arbitrarily large value so it shows up as expensive gas
		let priceVal = Number.parseFloat(price);
		this.price = (Number.parseFloat(priceVal ? priceVal : 420.69)).toFixed(2);
		this.coords = { latitude: lat,
						longitude: lng};
		this.key = key;
	}



	name;
	price;
	coords;
	key;
}

export default GasStationWrapper;