import React, { Component } from 'react';

import { Jumbotron, Container } from 'reactstrap';

class DetailTop extends Component {
  render() {
    return (
      <div>
        <Jumbotron fluid>
          <Container fluid>
            <div className="rest-top" id="rest-top">
              <div className="d-flex justify-content-left">
                <h2>매출 TOP 5</h2>
              </div>
              <div className="d-flex justify-content-left">
                <h4>card-carousel 들어갈자리</h4>
              </div>
            </div>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default DetailTop;
