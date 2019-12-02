class GasStationWrapper {

	constructor(name='MexiCali', prices, coords, key) {
		this.name = name;
		// If NaN, make it an arbitrarily large value so it shows up as expensive gas
		//let priceVal = Number.parseFloat(price);
		//this.price = (Number.parseFloat(priceVal ? priceVal : 420.69)).toFixed(2);

		this.prices = {
			regular: this.parsePrice(prices.regular),
			mid: this.parsePrice(prices.mid),
			premium: this.parsePrice(prices.premium)
		};
		this.coords = {
			latitude: coords.latitude,
			longitude: coords.longitude
		};
		this.key = key;
	}

	parsePrice(value) {
		let number = Number.parseFloat(value);
		number = isNaN(number) ? Infinity : number;
		return number.toFixed(2);
	}

	get priceRegular() { return this.prices.regular; }
	get priceMid() { return this.prices.mid; }
	get pricePremium() { return this.prices.premium; }
	get latitude() { return this.coords.latitude; }
	get longitude() { return this.coords.longitude; }
}

export default GasStationWrapper;