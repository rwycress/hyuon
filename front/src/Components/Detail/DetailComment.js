import React from 'react';
import { Component } from 'react';

import { Jumbotron, Container } from 'reactstrap';

class DetailComment extends Component {
  render() {
    return (
      <div>
        <Jumbotron fluid>
          <Container fluid>
            <div className="rest-comment" id="rest-comment">
              <div className="d-flex justify-content-left">
                <h2>사용자 후기</h2>
              </div>
              <div className="d-flex justify-content-left">
                <h4>댓글 입력 창</h4>
                <h4>사용자 댓글</h4>
              </div>
            </div>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default DetailComment;
