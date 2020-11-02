import React, { Component } from 'react';

import { Jumbotron, Container } from 'reactstrap';

class DetailRest extends Component {
  render() {
    return (
      <div>
        <Jumbotron fluid>
          <Container fluid>
            <div className="rest-main ml-auto" id="rest-main">
              <div className="d-flex justify-content-left">
                <h2>싸피 휴게소</h2>
              </div>
              <div className="d-flex justify-content-left">
                <h4>주소 : 경상북도 구미시 진평동</h4>
              </div>
            </div>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default DetailRest;
