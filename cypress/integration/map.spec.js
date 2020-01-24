describe('Construct valid polygons in map', () => {

	beforeEach(function () {
		cy.visit('http://localhost:3000')
	});

	it('construct a polygon', () => {
		// map selector
		let map = 'div.pick-a-place';

		// drag the map
		// TODO: not working checkout this example here
		// https://github.com/cypress-io/cypress/issues/2255
		function dragMap(x,y) {
			cy.get(map).trigger('mouseover')
			.trigger('mousedown', { force: true }).wait(500)
			.trigger('mousemove', { which: 1, clientX: x, clientY: y, force: true })
			.trigger('mouseup', {force: true});
		}
		dragMap(100,100);

		// zoom-in
		const w = 800;
		var i;
		let handler;
		handler = cy.get('a.leaflet-control-zoom-in');
		for (i = 0; i < 5; i++) { 
			handler.click().wait(w);
		}

		// make a polygon
		let points = ['bottomLeft', 'bottom', 'right', 'left', 'bottomLeft'];
		handler = cy.get(map);
		for (i = 0; i < points.length; i++) {
			handler = handler.click(points[i]).wait(w);
		}

		// the buttons panel should appear
		handler.get('.pick-a-place__button-panel').children().should('be.visible');

  });
});
