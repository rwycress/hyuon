import React, { Component } from 'react';

// router-dom
import { Link } from 'react-router-dom';

// css
import './Home.css';
import LogIn from './LogIn';

class Home extends Component {
  render() {
    return (
      <div className="mainbox">
        <div className="d-flex justify-content-center">
          <h3>홈 화면입니다.</h3>
        </div>
        <div className="img-box d-flex justify-content-center">
          <img className="mainImg" src={require('../Assets/Images/highway.jpg')} alt="highway" />
        </div>
        <div className="btnbox">
          {/* <div> */}
          <Link
            to="/Search"
            className="btn-3d"
            style={{ textDecoration: 'none', color: 'white' }}
          >
            휴게소 검색
          </Link>
          <Link
            to="/Highway"
            className="btn-3d"
            style={{ textDecoration: 'none', color: 'white' }}
          >
            고속도로 선택
          </Link>
          <Link
            to="/Root"
            className="btn-3d"
            style={{ textDecoration: 'none', color: 'white' }}
          >
            경로 탐색
          </Link>
        </div>
        <div className="loginbox">
          <LogIn />
        </div>
      </div>
    );
  }
}

export default Home;
