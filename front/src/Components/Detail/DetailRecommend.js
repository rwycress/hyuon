import React, { Component } from 'react';

import { Jumbotron, Container } from 'reactstrap';
import { Card, CardImg, CardBody, CardTitle } from 'reactstrap';

class DetailRecommend extends Component {
  render() {
    return (
      <div>
        <Jumbotron fluid>
          <Container fluid>
            <div className="rest-daepyo" id="rest-daepyo">
              <div className="d-flex justify-content-left">
                <h2>대표음식</h2>
              </div>
              <div className="d-flex justify-content-left">
                <div>
                  <Card>
                    <CardImg
                      // top
                      // width="200px"
                      src="https://recipe1.ezmember.co.kr/cache/recipe/2015/06/19/8dc726d73e927712f28bc1e06c9bdab0.jpg"
                      alt="Card image cap"
                    />
                    <CardBody>
                      <CardTitle>대표음식 소떡소떡</CardTitle>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default DetailRecommend;
