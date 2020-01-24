describe('Construct valid polygons in map', () => {

  beforeEach(function () {
    cy.visit('http://localhost:3000')
  });

  it('construct a polygon', () => {
    const map = 'div.pick-a-place'; // map selector
    const w = 300; // time to wait (ms)

    /* 
     * NOT WORKING NOT WORKING NOT WORKING
     * drag the map
     *
     * TODO: not working checkout this example here
     * source: https://github.com/cypress-io/cypress/issues/2255
     * {isTrusted: true, screenX: 785, screenY: 596, clientX: 784, clientY: 451, …}
    */
    function dragMap(handler, x,y) {
      let xAxis =  x > 0 ? '{rightarrow}' : '{leftarrow}';
      let yAxis =  y > 0 ? '{uparrow}' : '{downarrow}';
      let i,j;
      handler.focus()
      for( i = 0; i < Math.abs(x); i++ ) {
        handler.type(xAxis).wait(w)
      }
      for( j = 0; j < Math.abs(y); j++ ) {
        handler.type(yAxis).wait(w)
      }
    }

    function zoom(handler, level) {
      let i;
      for (i = 0; i < level; i++) { 
        handler.click().wait(w);
      }
    }

    // drag the map
    dragMap(cy.get(map),-3,-5);

    // zoom-in
    zoom(cy.get('a.leaflet-control-zoom-in'), 11)

    // make a polygon
    let points = ['bottomLeft', 'bottom', 'right', 'left', 'bottomLeft'];
    let handler = cy.get(map);
    for (let i = 0; i < points.length; i++) {
      handler = handler.click(points[i]).wait(w);
    }

    // check the buttons panel should appear
    cy.get('.pick-a-place__button-panel').children().should('be.visible');

    // check actions buttons
    cy.get('button.pick-a-place__button').should( ($p) => {
      expect($p).to.have.length(3);
      expect($p.first()).to.contain('Cancel');
    });

    // Submit polygon and check results
    cy.get('button.pick-a-place__button:nth-child(3)').click();

  });
});
