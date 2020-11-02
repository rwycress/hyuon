import React, { Component } from 'react';

// router-dom
import { Link } from 'react-router-dom';

// Naver Map
import { NaverMap, Marker, Polyline } from 'react-naver-maps';

// Axios
import axios from 'axios';

// Papaparse
import Papa from 'papaparse';

// Ant Design
import { Input, Select } from 'antd';
import 'antd/dist/antd.css';

// css
import './Root.css';

class Root extends Component {
  constructor() {
    super();
    this.state = {
      // 좌표 관련
      currentLat: '',
      currentLng: '',
      startX: '출발점을 선택하세요',
      startY: '출발점을 선택하세요',
      endX: '도착점을 선택하세요',
      endY: '도착점을 선택하세요',
      path: [],
      status: 'view',
      selecting: '',
      showMyPosition: false,

      // 도로 데이터 관련
      data: [],
      newData: [],
      roadSelection: '',
      searchOption: 0,

      // 주소-좌표 변환 요청
      startAddress: '',
      startSido: '',
      startGugun: '',
      startDong: '',
      startFlag: '',
      startDetailAddress: '',
      startBunji: '',
      endAddress: '',
      endSido: '',
      endGugun: '',
      endDong: '',
      endFlag: '',
      endDetailAddress: '',
      endBunji: '',

      // 네이버 지도 옵션
      // defaults
      zoomControl: false, //줌 컨트롤의 표시 여부
      zoomControlOptions: {
        //줌 컨트롤의 옵션
        position: window.naver.maps.Position.TOP_RIGHT,
      },

      // interaction
      draggable: true,
      pinchZoom: true,
      scrollWheel: true,
      keyboardShortcuts: true,
      disableDoubleTapZoom: false,
      disableDoubleClickZoom: false,
      disableTwoFingerTapZoom: false,

      // controls
      scaleControl: true,
      logoControl: true,
      mapDataControl: true,
      mapTypeControl: false,
    };

    this.toggleInteraction = this.toggleInteraction.bind(this);
    this.toggleControl = this.toggleControl.bind(this);
    this.callTmap = this.callTmap.bind(this);
    this.getData = this.getData.bind(this);
    this.filterRoad = this.filterRoad.bind(this);
    this.onRoadFilter = this.onRoadFilter.bind(this);

    this.onDaumPostStart = this.onDaumPostStart.bind(this);
    this.onDaumPostEnd = this.onDaumPostEnd.bind(this);
    this.getStartCoordinate = this.getStartCoordinate.bind(this);
    this.getEndCoordinate = this.getEndCoordinate.bind(this);
  }

  toggleInteraction() {
    if (this.state.draggable) {
      this.setState({
        draggable: false,
        pinchZoom: false,
        scrollWheel: false,
        keyboardShortcuts: false,
        disableDoubleTapZoom: true,
        disableDoubleClickZoom: true,
        disableTwoFingerTapZoom: true,
      });
    } else {
      this.setState({
        draggable: true,
        pinchZoom: true,
        scrollWheel: true,
        keyboardShortcuts: true,
        disableDoubleTapZoom: false,
        disableDoubleClickZoom: false,
        disableTwoFingerTapZoom: false,
      });
    }
  }

  toggleControl() {
    if (this.state.scaleControl) {
      this.setState({
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
        zoomControl: false,
        mapTypeControl: false,
      });
    } else {
      this.setState({
        scaleControl: true,
        logoControl: true,
        mapDataControl: true,
        zoomControl: true,
        mapTypeControl: true,
      });
    }
  }

  componentDidMount() {
    // 도로 데이터 CSV 불러오기
    this.getCsvData();

    // 현재 위치 정보 읽어옴
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            currentLat: position.coords.latitude,
            currentLng: position.coords.longitude,
          });
        },
        function (error) {
          console.log(error);
        },
        { enableHighAccuracy: true },
      );
    } else {
    }
  }

  // import CSV
  async getCsvData() {
    let csvData = [];
    await fetch('../../data/HighwayData_2019.csv')
      .then((response) => response.text())
      .then((text) => {
        csvData = text;
      });
    Papa.parse(csvData, {
      encoding: 'utf-8',
      complete: this.getData,
    });
  }
  getData(result) {
    this.setState({ data: result.data });
  }

  // 고속도로 보기
  async onRoadFilter(e) {
    await this.setState({
      roadSelection: e,
    });
    this.filterRoad(this.state.roadSelection);
  }

  filterRoad(roadName) {
    const navermaps = window.naver.maps;
    let newData = [];
    for (var d of this.state.data) {
      if (d[1] === roadName) {
        newData.push(new navermaps.LatLng(d[3], d[4]));
      }
    }
    this.setState({
      newData: newData,
    });
  }

  // 출발지 ~ 도착지 경로 탐색 요청 보내는 함수
  async callTmap() {
    const navermaps = window.naver.maps;
    const data = {
      startX: Number(this.state.startX),
      startY: Number(this.state.startY),
      endX: Number(this.state.endX),
      endY: Number(this.state.endY),
      searchOption: this.state.searchOption,
      // "roadType": 1,
    };
    try {
      const response = await axios.post(
        'https://apis.openapi.sk.com/tmap/routes?version=1&callback=result',
        data,
        {
          headers: {
            appKey: 'l7xxa4ca1e56f9614f3bbbf05f44db1fe38d',
          },
        },
      );
      let hwPts = [];
      let hwLine = [];
      let hwJcs = [];
      let hwIcs = [];
      for (var m of response.data.features) {
        if (
          (m.properties.nextRoadName &&
            m.properties.nextRoadName.includes('고속도로')) ||
          (m.properties.name && m.properties.name.includes('고속도로'))
        ) {
          if (m.geometry.type === 'Point') {
            hwPts.push({
              nextHighway: m.properties.nextRoadName,
              coordinates: m.geometry.coordinates,
            });
          } else {
            for (var cds of m.geometry.coordinates) {
              hwLine.push({ highway: m.properties.name, coordinates: cds });
            }
          }
        }
        if (m.properties.name && m.properties.name.includes('JC')) {
          hwJcs.push({
            jc: m.properties.name,
            coordinates: m.geometry.coordinates,
          });
        }
        if (m.properties.name && m.properties.name.includes('IC')) {
          hwIcs.push({
            ic: m.properties.name,
            coordinates: m.geometry.coordinates,
          });
        }
      }

      // 응답 GeoJSON에서 위도, 경도 데이터 추출1: features에서 좌표 정보 들어있는 배열 추출
      let pathPoints = [];
      for (var i of response.data.features) {
        pathPoints.push(i.geometry.coordinates);
      }

      // 응답 GeoJSON에서 위도, 경도 데이터 추출2: 배열 길이가 불규칙적이기 때문에 하나의 좌표 쌍으로 구성된 배열들로 재정렬
      let polyPoints = [];
      for (var pts of pathPoints) {
        if (Array.isArray(pts) && pts.length === 2) {
          polyPoints.push(pts);
        } else if (
          Array.isArray(pts) &&
          Array.isArray(pts[0]) &&
          pts.length > 2
        ) {
          for (var pt of pts) {
            polyPoints.push(pt);
          }
        } else {
        }
      }
      let polyPointss = [];
      for (var pp of polyPoints) {
        if (Array.isArray(pp[0])) {
          for (var ppp of pp) {
            polyPointss.push(ppp);
          }
        } else {
          polyPointss.push(pp);
        }
      }
      // 응답 GeoJSON에서 위도, 경도 데이터 추출3: 네이버 지도의 점 요소로 변환(위도: y, 경도: x)
      let linePoints = [];
      for (var p of polyPointss) {
        var pointObject = new navermaps.LatLng(p[1], p[0]);
        if (linePoints.includes(pointObject) === false) {
          linePoints.push(pointObject);
        }
      }
      // State에 저장
      this.setState({
        path: linePoints,
      });
    } catch (error) {
      console.log(error);
    }
  }

  // 다음 도로명 주소 검색창 팝업
  onDaumPostStart() {
    const that = this;
    new window.daum.Postcode({
      oncomplete: 
        function(data){
          if (data.userSelectedType === "R") {
            if (data.buildingName) {
              that.setState({
                startAddress: data.roadAddress,
                startSido: data.sido,
                startGugun: data.sigungu,
                startDong: data.roadname,
                startFlag: "F02",
                startDetailAddress: data.buildingName,
              })
            } else {
              that.setState({
                startAddress: data.roadAddress,
                startSido: data.sido,
                startGugun: data.sigungu,
                startDong: data.roadname,
                startFlag: "F02",
                startDetailAddress: data.roadAddressEnglish.split(',')[0],
            })}
          } else if (data.userSelectedType === "J") {
            that.setState({
              startAddress: data.jibunAddress,
              startSido: data.sido,
              startGugun: data.sigungu,
              startDong: data.bname,
              startFlag: "F01",
              startBunji: data.jibunAddressEnglish.split(',')[0]
            })
          } else {}
          that.getStartCoordinate()
        }
    }).open()
  }

  async getStartCoordinate() {
    const rQuery = {
      city_do: this.state.startSido,
      gu_gun: this.state.startGugun,
      dong: this.state.startDong,
      addressFlag: this.state.startFlag,
      bunji: this.state.startBunji,
      detailAddress: this.state.startDetailAddress
    }
    try {
      const response = await axios.get(`https://apis.openapi.sk.com/tmap/geo/geocoding?version=1&city_do=${rQuery.city_do}&gu_gun=${rQuery.gu_gun}&dong=${rQuery.dong}&bunji=${rQuery.bunji}&detailAddress=${rQuery.detailAddress}&addressFlag=${rQuery.addressFlag}&appKey=l7xxa4ca1e56f9614f3bbbf05f44db1fe38d`)
      if (response.data.coordinateInfo.newLat && response.data.coordinateInfo.newLon) {
        this.setState({
          startX: response.data.coordinateInfo.newLon,
          startY: response.data.coordinateInfo.newLat
        })
      } else {
        this.setState({
          startX: response.data.coordinateInfo.Lon,
          startY: response.data.coordinateInfo.Lat
        })
      }

    } catch (err) {
      console.log(err)
    }
  }

  onDaumPostEnd() {
    const that = this;
    new window.daum.Postcode({
      oncomplete: 
        function(data){
          if (data.userSelectedType === "R") {
            if (data.buildingName) {
              that.setState({
                endAddress: data.roadAddress,
                endSido: data.sido,
                endGugun: data.sigungu,
                endDong: data.roadname,
                endFlag: "F02",
                endDetailAddress: data.buildingName,
              })
            } else {
              that.setState({
                endAddress: data.roadAddress,
                endSido: data.sido,
                endGugun: data.sigungu,
                endDong: data.roadname,
                endFlag: "F02",
                endDetailAddress: data.roadAddressEnglish.split(',')[0],
            })}
          } else if (data.userSelectedType === "J") {
            that.setState({
              endAddress: data.jibunAddress,
              endSido: data.sido,
              endGugun: data.sigungu,
              endDong: data.bname,
              endFlag: "F01",
              endBunji: data.jibunAddressEnglish.split(',')[0]
            })
          } else {}
          that.getEndCoordinate()
        }
    }).open()
  }

  async getEndCoordinate() {
    const rQuery = {
      city_do: this.state.endSido,
      gu_gun: this.state.endGugun,
      dong: this.state.endDong,
      addressFlag: this.state.endFlag,
      bunji: this.state.endBunji,
      detailAddress: this.state.endDetailAddress
    }
    try {
      const response = await axios.get(`https://apis.openapi.sk.com/tmap/geo/geocoding?version=1&city_do=${rQuery.city_do}&gu_gun=${rQuery.gu_gun}&dong=${rQuery.dong}&bunji=${rQuery.bunji}&detailAddress=${rQuery.detailAddress}&addressFlag=${rQuery.addressFlag}&appKey=l7xxa4ca1e56f9614f3bbbf05f44db1fe38d`)
      if (response.data.coordinateInfo.newLat && response.data.coordinateInfo.newLon) {
        this.setState({
          endX: response.data.coordinateInfo.newLon,
          endY: response.data.coordinateInfo.newLat
        })
      } else {
        this.setState({
          endX: response.data.coordinateInfo.Lon,
          endY: response.data.coordinateInfo.Lat
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const navermaps = window.naver.maps;

    const searchOptions = [
      { key: 2, value: '최소시간' },
      { key: 10, value: '최단거리' },
    ];

    return (
      <>
        <div className="homebox my-5 w-100">
          <div className="w-100 mx-0">
            <div className="recom-root-header">
              <div>
                <Link to="/" style={{ height: '100%' }}>
                  <i
                    className="text-black-50 fas fa-chevron-left"
                    style={{ fontSize: '1.8rem' }}
                  ></i>
                </Link>
              </div>
              <div className="root-title">고속도로 경로 탐색</div>
            </div>

            <div className="start-end-input my-3">
              <Input
                className="mb-3"
                placeholder="여기를 클릭하여 출발지를 선택해주세요."
                value={this.state.startAddress}
                onClick={(e) => {
                  this.onDaumPostStart()
                }}
              />
              <Input
                className="mb-3"
                placeholder="여기를 클릭하여 목적지를 선택해주세요."
                value={this.state.endAddress}
                onClick={(e) => {
                  this.onDaumPostEnd()
                }}
              />
              <div className="recom-root-box">
                <div className="choiceroot">
                  <Select
                    className="mb-3"
                    options={searchOptions}
                    style={{ width: '100%' }}
                    placeholder="경로 탐색 기준을 선택해주세요."
                    onChange={(e) => {
                      if (e === '최소시간') {
                        this.setState({
                          searchOption: 2,
                        });
                      } else {
                        this.setState({
                          searchOption: 10,
                        });
                      }
                    }}
                  />
                </div>
                <div className="mylocation">
                  {this.state.showMyPosition ? (
                    <>
                      <button
                        className="btn btn-info mylocation-btn"
                        title="내 위치"
                        onClick={(e) => {
                          if (this.state.showMyPosition === false) {
                            this.setState({
                              showMyPosition: true,
                            });
                          } else {
                            this.setState({
                              showMyPosition: false,
                            });
                          }
                        }}
                      >
                        <i className="fas fa-map-marker-alt"></i>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-outline-info mylocation-btn"
                        title="내 위치"
                        onClick={(e) => {
                          if (this.state.showMyPosition === false) {
                            this.setState({
                              showMyPosition: true,
                            });
                          } else {
                            this.setState({
                              showMyPosition: false,
                            });
                          }
                        }}
                      >
                        <i className="fas fa-map-marker-alt"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>
              {this.state.startX &&
              this.state.startY &&
              this.state.endX &&
              this.state.endY &&
              this.state.searchOption ? (
                <>
                  <a
                    role="button"
                    className="w-100 btn btn-danger"
                    href="#pablo"
                    onClick={this.callTmap}
                  >
                    경로 검색
                  </a>
                </>
              ) : (
                <>
                  <a
                    role="button"
                    className="disabled w-100 btn btn-danger"
                    href="#pablo"
                    onClick={this.callTmap}
                  >
                    경로 검색
                  </a>
                </>
              )}
            </div>

            <div className="mapDiv d-flex text-center">
              <NaverMap
                mapDivId={'react-naver-map'}
                style={{
                  width: '100%',
                  height: '75vh',
                }}
                defaultCenter={{ lat: 36.3504119, lng: 127.8845475 }}
                defaultZoom={8}
                minZoom={7}
                {...this.state}
              >
                {/* 현재 위치 마커 */}
                {this.state.showMyPosition === true ? (
                  <>
                    <Marker
                      position={
                        new navermaps.LatLng(
                          Number(this.state.currentLat),
                          Number(this.state.currentLng),
                        )
                      }
                      title="내 위치"
                      icon={{
                        url:
                          'https://navermaps.github.io/maps.js/docs/img/example/pin_default.png',
                        size: new navermaps.Size(24, 37),
                        anchor: new navermaps.Point(12, 37),
                      }}
                      animation={navermaps.Animation.BOUNCE}
                    />
                  </>
                ) : (
                  <></>
                )}

                {/* 출발점, 도착점 마커 */}
                {this.state.startX && this.state.startY ? (
                  <>
                    <Marker
                      position={
                        new navermaps.LatLng(
                          Number(this.state.startY),
                          Number(this.state.startX),
                        )
                      }
                      title="출발"
                    />
                  </>
                ) : (
                  <></>
                )}
                {this.state.endX && this.state.endY ? (
                  <>
                    <Marker
                      position={
                        new navermaps.LatLng(this.state.endY, this.state.endX)
                      }
                      title="도착"
                    />
                  </>
                ) : (
                  <></>
                )}

                {/* 경로 표시 폴리선 */}
                {this.state.path.length > 0 ? (
                  <>
                    <Polyline
                      path={this.state.path}
                      // clickable // 사용자 인터랙션을 받기 위해 clickable을 true로 설정합니다.
                      strokeColor={'#F44336'}
                      strokeStyle={'solid'}
                      strokeOpacity={1}
                      strokeWeight={2}
                    />
                  </>
                ) : (
                  <></>
                )}
              </NaverMap>
            </div>

            <div className="footerDiv my-3">
            </div>

          </div>
        </div>
      </>
    );
  }
}

export default Root;
