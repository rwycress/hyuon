import urllib.request
import json
import requests
import csv

# 노선별 방향별 휴게시설
f = open("totaldata.csv", "w", encoding="UTF-8")
ff = open('apirestcoo.csv', 'r')
rdr = csv.reader(ff)
rdr_list = []
for content in rdr:
    rdr_list.append(content)

name = ["휴게소명"]
highway = ['고속도로명']
direct = ["방향"]
X = ['경도']
Y = ['위도']
for i in range(1, 4):
    URL = f'http://data.ex.co.kr/openapi/business/serviceAreaRoute?key=3591832985&type=json&numOfRows=100&pageNo={i}'
    # data = {'key': "3591832985", 'type': "JSON", 'numOfRows': '10', 'pageNo': '1',
    #         'routeCd': '', 'routeNm': '', 'stdRestCd': '', 'stdRestNm': ''}

    res = urllib.request.urlopen(URL)
    d = json.load(res)
    for i in range(len(d["list"])):
        if d["list"][i]['serviceAreaName'] == None:
            pass
        elif d["list"][i]['svarAddr'] == None:
            pass
        else:
            d["list"][i]['serviceAreaName'] = d["list"][i]['serviceAreaName'].replace(
                "휴게소", "")
            for info in rdr_list:
                # print(d["list"][i]['serviceAreaName'])
                # print(f'{i} {x} {info[1]}')
                # print(f'{d["list"][i]["serviceAreaName"]}{info[1]}')
                if d["list"][i]["serviceAreaName"] == info[1]:
                    name.append(d["list"][i]['serviceAreaName'])
                    highway.append(d["list"][i]['routeName'])
                    direct.append(d["list"][i]['direction'])
                    X.append(info[3])
                    Y.append(info[4])
                    break
                else:
                    pass

for i in range(len(name)):
    f.write(name[i] + ',' + highway[i] + ',' +
            direct[i] + ',' + X[i] + ',' + Y[i] + '\n')

f.close()
