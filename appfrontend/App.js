// react-native
import React, {useEffect, useState, createContext, useContext } from 'react';
import { AppRegistry, PermissionsAndroid, Platform, TouchableOpacity, View, Image, ScrollView} from "react-native";

// naver-map
import NaverMapView, {Coord, Circle, Marker, Path, Polyline, Polygon, Align} from "./map";

// axios
import axios from "axios";

// gesture
import 'react-native-gesture-handler';

// navigation
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";

// ui-kitten
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IndexPath, Layout, Text, Button, ButtonGroup, Select, SelectItem } from '@ui-kitten/components';
 
const P0 = {latitude: 36.3504119, longitude: 127.8845475};
 
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const RoadContext = createContext(null);
const RestContext = createContext(null);


const App = () => {
  // 고속도로 데이터
  const [roadData, setRoadData] = useState({
    roads: [],
    loading: true
  });
  // 선택 휴게소
  const [selectedRestInfo, setSelectedRestInfo] = useState({
    restName: "휴게소",
    restAddress: "휴게소",
  });

  useEffect(() => {
    getCsvData()
  }
  , [])

  // // import CSV
  function getCsvData() {
    const fs = require('react-native-fs')
    const roadDataFile = "HighwayData_2019.csv"
    const dest = `${fs.DocumentDirectoryPath}/${roadDataFile}`
    fs.copyFileAssets(roadDataFile, dest)
    
    let csvData = []
    fs.readFile("/data/user/0/com.highwayservice/files/HighwayData_2019.csv")
    .then(res => {
      const data = res.split('\n')
      for (var d of data) {
        let temp  = d.split(",")
        if (temp.length > 1) {
          csvData.push(temp.slice(0, 5))
        }
      }
      console.log("CSV 로드 성공")
      setRoadData({
        roads: csvData,
        loading: false,
      })
    }).catch((err) => {
      console.log(err)
    })
  }
    
    return (
        <>
        <RoadContext.Provider value={{ roadData, getCsvData }}>
          <RestContext.Provider value={{ selectedRestInfo, setSelectedRestInfo }}>
            <Body />
          </RestContext.Provider>  
        </RoadContext.Provider>
        </>
      )
}

// 최상위
const Body = () => {
  const { selectedRestInfo, setSelectedRestInfo } = useContext(
    RestContext
  );
  return (
    <>
    <Layout style={{ flex: 1, flexDirection: "row" }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen 
              name="나 너무 졸려 우리 잠깐 쉬었다 갈래?" 
              component={HomeScreen}
              options={{
                headerShown: false
              }}
              />
            <Stack.Screen name="휴게소 보기" component={MainScreen}/>
            <Stack.Screen name="휴게소 상세정보" component={DetailScreen}/>
            {/* <Stack.Screen name={selectedRestInfo.restName} component={DetailScreen}/> */}
          </Stack.Navigator>

        </NavigationContainer>
      </Layout>
    </>
  )
}

// 메인화면
const HomeScreen = ({navigation}) => {
  const { roadData, getCsvData } = useContext(
    RoadContext
  );

  return (
    <>
      <View style={{ flex: 8 }}>
        <Image source={require("./assets/Images/highway.jpg")} style={{ flex: 1 }}/>
      </View>
      { roadData.loading == false ? (<>
        <View style={{ flex: 2, margin: 15, flexDirection: "row", alignItems: "center",}}>
        <Button style={{ flex:1 , fontSize: 3, margin: 3, paddingVertical: 20 }} appearance='outline' status='info' onPress={() => navigation.navigate('휴게소 보기')}>
          {evaProps => <Text {...evaProps}>휴게소 목록</Text>}
        </Button>
        <Button style={{ flex: 1, fontSize: 3, margin: 3, paddingVertical: 20 }} appearance='outline' status='info' onPress={() => navigation.navigate('휴게소 보기')}>
          {evaProps => <Text {...evaProps}>휴게소 정보</Text>}
        </Button>
        <Button style={{ flex: 1, fontSize: 3, margin: 3, paddingVertical: 20 }} appearance='outline' status='info' onPress={() => navigation.navigate('휴게소 보기')}>
          {evaProps => <Text {...evaProps}>휴게소 정보</Text>}
        </Button>
        
      </View>
      </>) : (<></>)}

      { roadData.loading == true ? (<>
        <View style={{ flex: 2, alignItems: "center", justifyContent: "center" }}>
          <Text>
            고속도로 데이터 불러오는중...
          </Text>
        </View>
      </>) : (<>
        <View style={{ flex: 0, alignItems: "center", justifyContent: "center" }}>
        </View>
      </>)}
    </>
  )
}
 
// 휴게소 보기
const MainScreen = () => {
  return (
    <>
      <Tab.Navigator 
        tabBarOptions={{
          labelStyle: { fontSize: 15, bottom: 12 },
          // labelPosition: "below-icon"
        }}
      >
        <Tab.Screen 
          name={"휴게소 DB 검색"} 
          component={SearchScreen}
          options={{ 
            tabBarLabel: '검색',
            // tabBarIcon: ({ color, size }) => (
            //   <MaterialCommunityIcons name="home" color="FFFFFF" size={24} />
            // ),
          }}
        />
        <Tab.Screen 
          name={"고속도로별 휴게소"} 
          component={HighwayScreen}
          options={{ 
            tabBarLabel: '고속도로',
            // tabBarIcon: ({ color, size }) => (
            //   <Icon name="flag-outline" color="FFFFFF" size={24} />
            // ),
          }}
        />
        <Tab.Screen 
          name={"내 경로에 위치한 휴게소"} 
          component={RouteScreen}
          options={{ 
            tabBarLabel: '경로',
            // tabBarIcon: ({ color, size }) => (
            //   <MaterialCommunityIcons name="home" color="FFFFFF" size={24} />
            // ),
          }}
        />
      </Tab.Navigator>
    </>
  )
}

// 휴게소 보기 - 휴게소 검색 탭
const SearchScreen = () => {
  const { restInfo } = useContext(
    RestContext
    )

  return (
    <>
      <Layout style={{ flex: 1 }} level="1">
        <NaverMapView style={{width: '100%', height: '75%'}}
                      showsMyLocationButton={true}
                      center={{...P0, zoom: 6}}
                      useTextureView>
        </NaverMapView>
        <ScrollView>
          <Text style={{width: '100%', textAlign: 'center'}}>
            휴게소 검색 화면
          </Text>
        </ScrollView>
        
      </Layout>
    </>
  )
}

// 휴게소 보기 - 고속도로 조회 탭
const HighwayScreen = ({navigation}) => {
  const { roadData } = useContext(
    RoadContext
  );
  const { selectedRestInfo, setSelectedRestInfo } = useContext(
    RestContext
  );

  const highwayOptions = [
    { index: 0, value: '경부선', start: '서울', end: '부산', dx: 1, dy: -1, weird: 1 },
    { index: 1, value: '광주대구선', start: '광주', end: '대구', dx: 1, dy: 1, weird: 0 },

    // { value: '남해선(영암순천)', start: '영암', end: '순천', dx: 1, dy: 1, weird: 1 },
    // { value: '남해선(순천부산)', start: '순천', end: '부산', dx: 1, dy: 1, weird: 1 },
    { index: 2, value: '남해선', start: '순천', end: '부산', dx: 1, dy: 1, weird: 1 },

    { index: 3, value: '남해제2지선', start: '김해', end: '부산', dx: 1, dy: -1, weird: 0 },

    // { value: '당진대전선', start: '당진', end: '대전' },
    // { value: '청주상주선', start: '청주', end: '상주' },
    { index: 4, value: '당진영덕선', start: '당진', end: '영덕' },

    { index: 5, value: '동해선', start: '동해', end: '속초', dx: 1, dy: -1, weird: 0 },
    { index: 6, value: '대구포항선', start: '대구', end: '포항', dx: 1, dy: 1, weird: 1 },
    { index: 7, value: '서울양양선', start: '서울', end: '양양', dx: 1,dy: 1, weird: 1 },
    { index: 8, value: '서천공주선', start: '서천', end: '공주', dx: 1,dy: 1, weird: 0 },
    { index: 9, value: '순천완주선', start: '순천', end: '완주', dx: -1,dy: 1, weird: 1 },
    { index: 10, value: '영동선', start: '인천', end: '강릉', dx: 1, dy: 1, weird: 1 },
    { index: 11, value: '익산장수선', start: '익산', end: '장수', dx: 1, dy: -1, weird: 1 },
    { index: 12, value: '중부내륙선', start: '창원', end: '양평', dx: -1, dy: 1, weird: 1 },
    { index: 13, value: '중부내륙선의 지선', start: '현풍', end: '대구', dx: 1, dy: 1, weird: 1 },

    // { value: '중앙선(김해대구)', start: '김해', end: '춘천', dx: -1, dy: 1, weird: 1 },
    // { value: '중앙선(대구춘천)', start: '김해', end: '춘천', dx: -1, dy: 1, weird: 1 },
    { index: 14, value: '중앙선', start: '김해', end: '춘천', dx: -1, dy: 1, weird: 1 },

    { index: 15, value: '통영대전선/중부선', start: '통영', end: '하남', dx: -1, dy: 1, weird: 1 },
    { index: 16, value: '평택제천선', start: '평택', end: '제천', dx: 1, dy: 1, weird: 1 },
    { index: 17, value: '호남선', start: '순천', end: '논산', dx: -1, dy: 1, weird: 1 },
    { index: 18, value: '호남선의 지선', start: '논산', end: '대전', dx: 1, dy: 1, weird: 1 },
    { index: 19, value: '무안광주선', start: "무안", end: "광주", dx: 1, dy: 1, weird: 0 },
    { index: 20, value: '부산포항선', start: "부산", end: "포항" },
    { index: 21, value: '서해안선', start: "서울", end: "목포" },
    { index: 22, value: '수도권제1순환선', start: "제천", end: "퇴계원" },
  ]

  // state
  // select component
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [ selectedRoad, setSelectedRoad ] = useState({
    selectedRoad: highwayOptions[selectedIndex].value,
  })
  // direction button
  const [ filterDirection, setFilterDirection ] = useState({
    start: highwayOptions[selectedIndex.row].start,
    end: highwayOptions[selectedIndex.row].end
  })
  // road coordinate data
  const [roadInfo, setRoadInfo] = useState({
    roadInfo1: [],
    roadInfo2: []
  })
  // my direction
  const [myDir, setMyDir] = useState({
    myDir: ""
  })
  // rest data
  const [restInfo, setRestInfo] = useState({
    restInfo: []
  })


  // effect
  useEffect(() => {
      requestLocationPermission();
  }, []);

  // select component values
  const displayValue = highwayOptions[selectedIndex.row].value;
  
  // select options rendering component
  const SelectBarOptions = highwayOptions.map((item, id) => (
    <SelectItem 
      key={id} 
      title={item.value} 
      />
  ))

  // markers rendering component
  const markers = restInfo.restInfo.map((item, id) => (
    <Marker 
      key={id} 
      coordinate={{latitude: item.restLat, longitude: item.restLng}} 
      width={24} 
      height={36} 
      caption={{text: item.restName, textSize: 15, align: Align.Top}}
      pinColor="red"
      onClick={(e) => {
        setSelectedRestInfo({
          restName: item.restName,
          restAddress: item.restAddress,
        })
        // navigation.navigate(selectedRestInfo.restName)
        navigation.navigate("휴게소 상세정보")
      }}
    />
));

  function getRoadInfo(roadName) {
    let newData = []
    let newData2 = []
    for (var d of roadData.roads) {
      if (roadName === "남해선") {
        if (d[1] === "남해선(영암순천)" ) {
          var pointObject = { "latitude": Number(d[3]), "longitude": Number(d[4]) }
          newData.push(pointObject);
        } else if (d[1] === "남해선(순천부산)" ) {
          var pointObject = { "latitude": Number(d[3]), "longitude": Number(d[4]) }
          newData2.push(pointObject);
        }
      } else if ( roadName === "중앙선" ) {
        if (d[1] === "중앙선(김해대구)") {
          var pointObject = { "latitude": Number(d[3]), "longitude": Number(d[4]) }
          newData.push(pointObject);
        } else if (d[1] === "중앙선(대구춘천)" ) {
          var pointObject = { "latitude": Number(d[3]), "longitude": Number(d[4]) }
          newData2.push(pointObject);
        }
      } else if ( roadName === "당진영덕선" ) {
        if (d[1] === "당진대전선") {
          var pointObject = { "latitude": Number(d[3]), "longitude": Number(d[4]) }
          newData.push(pointObject);
        } else if (d[1] === "청주상주선" ) {
          var pointObject = { "latitude": Number(d[3]), "longitude": Number(d[4]) }
          newData2.push(pointObject);
        }
      } else {
        if (d[1] === roadName) {
          var pointObject = { "latitude": Number(d[3]), "longitude": Number(d[4]) }
          newData.push(pointObject);
        }
      }
    }
    setRoadInfo({
      roadInfo1: newData,
      roadInfo2: newData2
    })
  }

  // 선택한 도로상에 위치한 휴게소 정보 요청
  async function getServiceData() {
    try {
      const response = await axios.get(
        'http://k3d202.p.ssafy.io/api/auth/rest/',
      );
      let restData = [];
      for (var rest of response.data) {
        if (
          rest.rest_high === selectedRoad.selectedRoad &&
          rest.rest_highdirect.includes(myDir.myDir)
        ) {
          var restObj = {
            restName: rest.rest_name,
            restAddress: rest.rest_address,
            restDir: rest.rest_highdirect,
            restLat: Number(
              rest.rest_coordinate.slice(1, -1).split(',')[1].slice(2, -1),
            ),
            restLng: Number(
              rest.rest_coordinate.slice(1, -1).split(',')[0].slice(1, -1),
            ),
          };
          restData.push(restObj);
        }
      }
      setRestInfo({
        restInfo: restData
      })
    } catch (err) {
      alert(err.response.request._response)
      console.log(err.response.request._response)
    }
  }
 
  return (
    <>
      <Layout style={{ flex: 1 }} level="1">
        <NaverMapView style={{width: '100%', height: '75%'}}
                      showsMyLocationButton={true}
                      center={{...P0, zoom: 6}}
                      // onTouch={e => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
                      // onCameraChange={e => console.warn('onCameraChange', JSON.stringify(e))}
                      // onMapClick={e => console.warn('onMapClick', JSON.stringify(e))}
                      useTextureView>
            {/* <Marker coordinate={P0} onClick={() => console.warn('onClick! p0')} caption={{text: "test caption", align: Align.Left}}/>
            <Marker coordinate={P1} pinColor="blue" onClick={() => console.warn('onClick! p1')}/>
            <Marker coordinate={P4} onClick={() => console.warn('onClick! p4')} width={24} height={37}/>
            <Path coordinates={[P0, P1]} onClick={() => console.warn('onClick! path')} width={10}/> */}
            {roadInfo.roadInfo1.length > 0 ? (<><Polyline coordinates={roadInfo.roadInfo1} strokeColor={"#f44336"} strokeWidth={2}/></>) : (<></>)}
            {roadInfo.roadInfo2.length > 0 ? (<><Polyline coordinates={roadInfo.roadInfo2} strokeColor={"#f44336"} strokeWidth={2}/></>) : (<></>)}
            {markers}
        </NaverMapView>
        <ScrollView>
          <View>
            <Text style={{width: '100%', textAlign: 'center'}}>
              고속도로 선택
            </Text>
            <Select
            status='primary'
            placeholder='고속도로를 선택하세요'
            selectedIndex={selectedIndex}
            value={displayValue}
            onSelect={(index) => {
              setSelectedIndex(index)
              setSelectedRoad({
                selectedRoad: highwayOptions[index.row].value
              })
              setFilterDirection({
                start: highwayOptions[index.row].start,
                end: highwayOptions[index.row].end
              })
              getRoadInfo(highwayOptions[index.row].value)
              setMyDir({
                myDir: ""
              })
              setRestInfo({
                restInfo: []
              })
            }}>
              {SelectBarOptions}
            </Select>
            <ButtonGroup style={{ flex: 1, justifyContent: "center" }}>
              {myDir.myDir === filterDirection.start ? (<>
                <Button 
                style={{flex: 1, justifyContent: "center" }}
                appearance='filled' 
                status='info'
                onPress={(e) => {
                  setMyDir({
                    myDir: filterDirection.start
                  })
                }}>
                {filterDirection.start}방향
              </Button>
              </>) : (<>
                <Button 
                style={{flex: 1, justifyContent: "center" }}
                appearance='outline' 
                status='info'
                onPress={(e) => {
                  setMyDir({
                    myDir: filterDirection.start
                  })
                }}>
                {filterDirection.start}방향
              </Button>
              </>)}

              {myDir.myDir === filterDirection.end ? (<>
                <Button 
                style={{flex: 1, justifyContent: "center" }}
                appearance='filled' 
                status='info'
                onPress={(e) => {
                  setMyDir({
                    myDir: filterDirection.end
                  })
                }}>
                {filterDirection.end}방향
              </Button>
              </>) : (<>
                <Button 
                style={{flex: 1, justifyContent: "center" }}
                appearance='outline' 
                status='info'
                onPress={(e) => {
                  setMyDir({
                    myDir: filterDirection.end
                  })
                }}>
                {filterDirection.end}방향
              </Button>
              </>)}
            </ButtonGroup>

            <Button 
              style={{flex: 1, justifyContent: "center" }}
              appearance='outline' 
              status='info'
              onPress={(e) => {
                getServiceData()
              }}>
              휴게소 찾기
            </Button>          
          </View>
        </ScrollView>
      </Layout>
    </>
  )
};

// 휴게소 보기 - 경로탐색 탭
const RouteScreen = () => {
  const [pathState, setPathState] = useState({
    status: "view",
    selecting: "",
  })
  const [pathStart, setPathStart] = useState({
    startX: 0,
    startY: 0,
  })
  const [pathEnd, setPathEnd] = useState({
    endX: 0,
    endY: 0,
  })
  const [searchMethodState, setSearchMethodState] = useState({
    searchMethod: 2,
  })
  const [pathInfoState, setPathInfoState] = useState({
    pathPoints: [],
  })

  const searchOptions = [
    { value: "최소시간", key: 2 },
    { value: "최단거리", key: 10 },
  ]
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  // select component values
  const displayValue = searchOptions[selectedIndex.row].value;

  useEffect(() => {
    requestLocationPermission();
  }, []);

  async function onPathSearch() {
    const data = {
      "startX" : pathStart.startX,
      "startY" : pathStart.startY,
      "endX" : pathEnd.endX,
      "endY" : pathEnd.endY,
      "searchOption" : searchMethodState.searchMethod,
      // "roadType": 1,
    };
    try {
      const response = await axios.post(
        "https://apis.openapi.sk.com/tmap/routes?version=1", data, {
          headers: {
            "appKey" : "l7xxa4ca1e56f9614f3bbbf05f44db1fe38d",
          }
        }
      );
      // 응답 GeoJSON에서 위도, 경도 데이터 추출1: features에서 좌표 정보 들어있는 배열 추출
      let pathPts = []
      for (var i of response.data.features) {
        pathPts.push(i.geometry.coordinates)
      }
      // 응답 GeoJSON에서 위도, 경도 데이터 추출2: 배열 길이가 불규칙적이기 때문에 하나의 좌표 쌍으로 구성된 배열들로 재정렬
      let polyPoints = []
      for (var pts of pathPts) {
        if (Array.isArray(pts) && pts.length === 2) {
          polyPoints.push(pts)
          // console.log(pts)
        } else if (Array.isArray(pts) && Array.isArray(pts[0]) && pts.length > 2) { 
          // console.log(pts)
          for (var pt of pts) {
            polyPoints.push(pt)
            // console.log(pt)
          }
        } else {
          // console.log(pts)
        }
      }
      let polyPointss = []
      for (var pp of polyPoints) {
        if (Array.isArray(pp[0])) {
          for (var ppp of pp) {
            polyPointss.push(ppp)
          }
        } else {
          polyPointss.push(pp)
        }
      }
      // console.log(polyPoints)
      // 응답 GeoJSON에서 위도, 경도 데이터 추출3: 네이버 지도의 점 요소로 변환(위도: y, 경도: x)
      let linePoints = []
      for (var p of polyPointss) {
        // console.log(p[1], p[0])
        var pointObject = { "latitude": p[1], "longitude": p[0] }
        // pointObject = { "latitude": parseFloat(p[1].toFixed(12)), "longitude": parseFloat(p[0].toFixed(12)) }
        if (linePoints.includes(pointObject) === false) {
          linePoints.push(pointObject)
        }
      }
      // State에 저장
      setPathInfoState({
        pathPoints: linePoints,
      })
    } catch {(err) => {
      console.log(err.response.request._response)
    }}
  }

  const startMarker = {latitude: pathStart.startY, longitude: pathStart.startX}
  const endMarker = {latitude: pathEnd.endY, longitude: pathEnd.endX}
  return (
    <>
      <Layout style={{ flex: 1 }} level="1">
        <NaverMapView style={{width: '100%', height: '75%'}}
                      showsMyLocationButton={true}
                      center={{...P0, zoom: 6}}
                      onMapClick={(e) => {
                        if (pathState.status === "select" && pathState.selecting === "start") {
                            setPathStart({
                              startX: e.longitude,
                              startY: e.latitude,
                              // startX: parseFloat(e.longitude.toFixed(12)),
                              // startY: parseFloat(e.latitude.toFixed(12)),
                            })
                            setPathState({
                              status: "view",
                              selecting: ""
                            })
                          } else if (pathState.status === "select" && pathState.selecting === "end") {
                            setPathEnd({
                              endX: e.longitude,
                              endY: e.latitude,
                              // endX: parseFloat(e.longitude.toFixed(12)),
                              // endY: parseFloat(e.latitude.toFixed(12)),
                            })
                            setPathState({
                              status: "view",
                              selecting: ""
                            })
                          } else {}
                      }}
                      useTextureView>
          {pathStart.startX > 0 && pathStart.startY > 0 ? (<>
            <Marker 
              coordinate={startMarker} 
              caption={{text: "출발", align: Align.Top}}
              width={24} 
              height={36}
              /></>) : (<></>)}
          {pathEnd.endX > 0 && pathEnd.endY > 0 ? (<>
            <Marker 
              coordinate={endMarker} 
              caption={{text: "도착", align: Align.Top}}
              width={24} 
              height={36} 
              /></>) : (<></>)}
          {pathInfoState.pathPoints.length > 0 ? (<><Polyline coordinates={pathInfoState.pathPoints} strokeColor={"#f44336"} strokeWidth={2} /></>) : (<></>)}
        </NaverMapView>
        <ScrollView>
        <Text style={{width: '100%', textAlign: 'center'}}>
          출발점: {pathStart.startX}, {pathStart.startY}
        </Text>
        <Button appearance='outline' status='info' onPress={(e) => {
          setPathState({
            selecting: "start",
            status: "select",
          })
        }}>
          변경
        </Button>
        <Text style={{width: '100%', textAlign: 'center'}}>
          도착점: {pathEnd.endX}, {pathEnd.endY}
        </Text>
        <Button appearance='outline' status='info' onPress={(e) => {
          setPathState({
            selecting: "end",
            status: "select"
          })
        }}>
          변경
        </Button>
        {searchMethodState.searchMethod === 2 ? (<>
          <Text style={{width: '100%', textAlign: 'center'}}>
            탐색 방식: 최소시간
          </Text>
        </>) : searchMethodState.searchMethod === 10 ? (<>
          <Text style={{width: '100%', textAlign: 'center'}}>
            탐색 방식: 최단거리
          </Text>
        </>) : (<>
          <Text style={{width: '100%', textAlign: 'center'}}>
            탐색 방식: 
          </Text>
        </>)}
 
        <Select
          status='primary'
          placeholder='경로 탐색 방식'
          selectedIndex={selectedIndex}
          // {...useSelectState}
          value={displayValue}
          onSelect={(index) => {
            setSelectedIndex(index)
            setSearchMethodState({
              searchMethod: searchOptions[index.row].key
            }) 
          }
          }>
          <SelectItem title='최소시간'/>
          <SelectItem title='최단거리'/>
        </Select>
        {pathStart.startX && pathStart.startY && pathEnd.endX && pathEnd.endY && searchMethodState.searchMethod ? (<>
          <Button appearance='outline' status='info' onPress={(e) => {
            onPathSearch()
            }}>
            경로 찾기
          </Button>
        </>) : (<>
          <Button appearance='outline' status='info' disabled={true}>
            경로 찾기
          </Button>
        </>)}

        </ScrollView>
        
      </Layout>
    </>
  )
}

// 휴게소 상세정보
const DetailScreen = () => {
  return (
    <>
      <Tab.Navigator 
        tabBarOptions={{
          labelStyle: { fontSize: 15, bottom: 12 },
          // labelPosition: "below-icon"
        }}
      >
        <Tab.Screen 
          name={"휴게소 상세정보 1"} 
          component={DetailTab1}
          options={{ 
            tabBarLabel: '1페이지',
            // tabBarIcon: ({ color, size }) => (
            //   <Icon name="flag-outline" color="FFFFFF" size={24} />
            // ),
          }}
          />
        <Tab.Screen 
          name={"휴게소 상세정보 2"} 
          component={DetailTab2}
          options={{ 
            tabBarLabel: '2페이지',
            // tabBarIcon: ({ color, size }) => (
            //   <MaterialCommunityIcons name="home" color="FFFFFF" size={24} />
            // ),
          }}
        />
      </Tab.Navigator>
    </>
  )
  
}

// 휴게소 상세정보 - 1페이지
const DetailTab1 = () => {
  const { selectedRestInfo, setSelectedRestInfo } = useContext(
    RestContext
  ); 
  return(
    <>
      <Layout style={{ flex: 1 }} level="1">
        <View>
          <Text>
            {selectedRestInfo.restName} 휴게소
          </Text>
        </View>
      </Layout>
    </>
  )
}

// 휴게소 상세정보 - 개요
const DetailTab2 = () => {
  const { selectedRestInfo, setSelectedRestInfo } = useContext(
    RestContext
  );
  return(
    <>
      <Layout style={{ flex: 1 }} level="1">
        <View>
          <Text>
            {selectedRestInfo.restAddress}
          </Text>
        </View>
      </Layout>
    </>
  )
}

// GPS 권한 요청
async function requestLocationPermission() {
    if (Platform.OS !== 'android') return;
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Permission',
                message: 'show my location need Location permission',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // console.log('You can use the location');
        } else {
            // console.log('Location permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
}
 
export default () => (
  <>
    <ApplicationProvider {...eva} theme={eva.light}>
      <App />
    </ApplicationProvider>
  </>
)