import React, { Component } from 'react';

import { Jumbotron, Container } from 'reactstrap';
import { Button } from 'reactstrap';

class DetailTop extends Component {
  render() {
    return (
      <div>
        <Jumbotron fluid>
          <Container fluid>
            <div className="rest-time" id="rest-time">
              <div className="d-flex justify-content-left">
                <h2>영업시간</h2>
              </div>
              <div className="d-flex justify-content-left">
                <div h4>식당가 : 00:00 ~ 24:00</div>
                <div h4>스낵코너 : 10:00 ~ 18:00</div>
              </div>
              <div className="d-flex justify-content-center">
                <Button color="primary">전체 메뉴 확인</Button>
              </div>
            </div>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default DetailTop;
