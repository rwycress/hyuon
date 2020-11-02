import React, { Component } from 'react';

// router-dom
import { Link } from 'react-router-dom';

// reactstrap
import { Row, Col } from 'reactstrap';

// css
import './LogIn.css';

class LogIn extends Component {
  render() {
    return (
      <form onSubmit={this.handleSubmit} noValidate>
        <div className="userid">
          <label htmlFor="userid">아이디</label>
          <input
            type="userid"
            name="userid"
            onChange={this.handleChange}
            noValidate
          />
        </div>
        <div className="password">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            name="password"
            onChange={this.handleChange}
            noValidate
          />
        </div>
        <div className="submit">
          <Row style={{ width: '100%' }}>
            <Col style={{ padding: '0 10px 0 0' }}>
              <Link
                to="/SignUp"
                style={{ textDecoration: 'none', color: 'white' }}
              >
                <button type="button">회원가입</button>
              </Link>
            </Col>
            <Col style={{ padding: '0 0 0 10px' }}>
              <button type="submit">로그인</button>
            </Col>
          </Row>
        </div>
      </form>
    );
  }
}

export default LogIn;
