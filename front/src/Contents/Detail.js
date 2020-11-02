import React, { Component } from 'react';

import './Detail.css';

// import DetailNavbar from '../Components/Navbar/DetailNavbar';
import DetailRest from '../Components/Detail/DetailRest';
import DetailExfood from '../Components/Detail/DetailExfood';
import DetailTop from '../Components/Detail/DetailTop';
import DetailRecommend from '../Components/Detail/DetailRecommend';
import DetailConvenience from '../Components/Detail/DetailConvenience';
import DetailTime from '../Components/Detail/DetailTime';
import DetailComment from '../Components/Detail/DetailComment';

// import axios from 'axios';

// scrollspy
window.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute('id');
      if (entry.intersectionRatio > 0) {
        document
          .querySelector(`nav li a[href="#${id}"]`)
          .parentElement.classList.add('active');
      } else {
        document
          .querySelector(`nav li a[href="#${id}"]`)
          .parentElement.classList.remove('active');
      }
    });
  });

  // Track all sections that have an `id` applied
  document.querySelectorAll('section[id]').forEach((section) => {
    observer.observe(section);
  });
});

class Detail extends Component {
  constructor() {
    super();
    this.state = {
      rest_name: '',
      rest_address: '',
      // like axios 구현시 status: "" 변경해야함
      status: '',
    };
  }

  render() {
    return (
      <div className="detailbox">
        {/* <DetailNavbar /> */}
        <nav className="category">
          <ul>
            <li>
              <a href="#info">기본정보</a>
            </li>
            <li>
              <a href="#exfood">exFood</a>
            </li>
            <li>
              <a href="#top5">매출T5</a>
            </li>
            <li>
              <a href="#recommend">추천음식</a>
            </li>
            <li>
              <a href="#service">서비스</a>
            </li>
            <li>
              <a href="#comment">후기</a>
            </li>
          </ul>
        </nav>

        <div className="detail-section">
          <section id="info">
            <DetailRest />
          </section>
          <section id="exfood">
            <DetailExfood />
          </section>
          <section id="top5">
            <DetailTop />
          </section>
          <section id="recommend">
            <DetailRecommend />
          </section>
          <section id="service">
            <DetailTime />
          </section>
          <section id="service">
            <DetailConvenience />
          </section>
          <section id="comment">
            <DetailComment />
          </section>
        </div>

        {/* <h3>디테일페이지</h3> */}
      </div>
    );
  }
}

export default Detail;
