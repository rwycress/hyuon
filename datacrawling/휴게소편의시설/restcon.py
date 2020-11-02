import urllib.request
import json
import requests

# 노선별 방향별 휴게시설
ans = []
sample = './allrestcon.json'
for i in range(1, 4):
    URL = f'http://data.ex.co.kr/openapi/restinfo/restConvList?key=3591832985&type=json&numOfRows=100&pageNo={i}'
    # data = {'key': "3591832985", 'type': "JSON", 'numOfRows': '10', 'pageNo': '1',
    #         'routeCd': '', 'routeNm': '', 'stdRestCd': '', 'stdRestNm': ''}

    res = urllib.request.urlopen(URL)
    d = json.load(res)
    # ans.append(d)
# 휴게소 글자 제거
    # for i in range(len(d["list"])):
    #     if d["list"][i]['serviceAreaName'] == None:
    #         pass
    #     else:
    #         d["list"][i]['serviceAreaName'] = d["list"][i]['serviceAreaName'].replace(
    #             "휴게소", "")
    #     print(d["list"][i]['serviceAreaName'])

    ans.append(d)

with open(sample, 'w', encoding="utf-8") as file:
    json.dump(ans, file, ensure_ascii=False, indent="\t")
