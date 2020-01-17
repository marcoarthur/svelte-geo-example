/*
 * Server defines communication channels with the server
 *
 */

import Reactive from './Reactive';
import GeoWorker from './GeoWorker';

export default class Server extends Reactive {

	constructor(params) {
		super();
		this.prop('rw', 'url', params.url || '');
	}

	process_area(geom) {

		let worker = new GeoWorker({geometry: geom, server: this});
		return worker;
	}
}
