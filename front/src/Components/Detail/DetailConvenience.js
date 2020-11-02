import React, { Component } from 'react';

import { Jumbotron, Container } from 'reactstrap';

class DetailConvenience extends Component {
  render() {
    return (
      <div>
        <Jumbotron fluid>
          <Container fluid>
            <div className="rest-pyuneui" id="rest-pyuneui">
              <div className="d-flex justify-content-left">
                <h2>편의시설</h2>
              </div>
              <div className="d-flex justify-content-left">
                <h4>편의시설 이모티콘 들어갈 자리</h4>
              </div>
            </div>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default DetailConvenience;
