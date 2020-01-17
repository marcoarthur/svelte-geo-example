import Reactive from './Reactive';

export default class GeoWorker extends Reactive {

	constructor(params) {
		super();
		this.prop('ro', 'bbox', params.geometry);
    this.prop('ro', 'server', params.server);

    try {
      let ws = new WebSocket(this.server.geom_url);
    } catch(e) {
      console.log('Error' + e.message);
      throw e;
    }
    this.prop('ro', 'ws', ws);
	}

  execute() {
    this.ws.onmessage( (event) => {
      let res = JSON.parse(event.data);
      console.log('Received from geo_worker handler');
    });

    this.ws.send(this.bbox);
  }

}
