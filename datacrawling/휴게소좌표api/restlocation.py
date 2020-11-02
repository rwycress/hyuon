import urllib.request
import json
import requests

# 고속도로 휴게소 기준정보
# 휴게소 위치 226개 3페이지
ans = []
sample = './allrestloaction.json'
for i in range(1, 4):
    URL = f'http://data.ex.co.kr/openapi/locationinfo/locationinfoRest?key=3591832985&type=json&numOfRows=100&pageNo={i}'
    res = urllib.request.urlopen(URL)
    d = json.load(res)
    # 휴게소 고유코드 양식 통일, 위치정보등과 밭아오기 위해서
    for i in range(len(d["list"])):
        d["list"][i]['unitCode'] = 'A00' + d['list'][i]['unitCode']

    # 휴게소 글자 제거
    for i in range(len(d["list"])):
        d["list"][i]['unitName'] = d["list"][i]['unitName'].replace("휴게소", "")
        print(d["list"][i]['unitName'])

    ans.append(d)

with open(sample, 'w', encoding="utf-8") as file:
    json.dump(ans, file, ensure_ascii=False, indent="\t")
