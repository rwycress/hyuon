import urllib.request
import json
import requests
import csv

# 노선별 방향별 휴게시설
f = open("apilocation.csv", "w", encoding="UTF-8")


name = ["휴게소명"]
highway = ['도로명']
x = ['경도']
y = ['위도']
for i in range(1, 4):
    URL = f'http://data.ex.co.kr/openapi/locationinfo/locationinfoRest?key=3591832985&type=json&numOfRows=100&pageNo={i}'
    # data = {'key': "3591832985", 'type': "JSON", 'numOfRows': '10', 'pageNo': '1',
    #         'routeCd': '', 'routeNm': '', 'stdRestCd': '', 'stdRestNm': ''}

    res = urllib.request.urlopen(URL)
    d = json.load(res)
    for i in range(len(d["list"])):
        if d["list"][i]['unitName'] == None:
            pass
        else:
            if d["list"][i]['xValue'] == None:
                d["list"][i]['xValue'] = "9999"
            if d["list"][i]['yValue'] == None:
                d["list"][i]['yValue'] = "9999"
            d["list"][i]['unitName'] = d["list"][i]['unitName'].replace(
                "휴게소", "")
            name.append(d["list"][i]['unitName'])
            highway.append(d["list"][i]['routeName'])
            x.append(d["list"][i]['xValue'])
            y.append(d["list"][i]['yValue'])
for i in range(len(name)):
    f.write(name[i] + ',' + highway[i] + ',' + x[i] + ',' + y[i] + '\n')

f.close()
