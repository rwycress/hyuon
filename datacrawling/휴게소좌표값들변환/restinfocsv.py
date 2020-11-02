import urllib.request
import json
import requests
import csv

# 노선별 방향별 휴게시설
f = open("allrestinfo.csv", "w", encoding="UTF-8")


name = ["name"]
address = ['address']
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
            name.append(d["list"][i]['serviceAreaName'])
            address.append(d["list"][i]['svarAddr'])
for i in range(len(name)):
    f.write(name[i] + ',' + address[i] + '\n')

f.close()
