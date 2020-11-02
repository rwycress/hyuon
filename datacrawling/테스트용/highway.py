import urllib.request
import json
import requests

# 노선별 방향별 휴게시설
ans = []
sample = './highway.json'
for x in range(1, 4):
    URL = f'http://data.ex.co.kr/openapi/business/serviceAreaRoute?key=3591832985&type=json&numOfRows=100&pageNo={x}'
    # data = {'key': "3591832985", 'type': "JSON", 'numOfRows': '10', 'pageNo': '1',
    #         'routeCd': '', 'routeNm': '', 'stdRestCd': '', 'stdRestNm': ''}

    res = urllib.request.urlopen(URL)
    d = json.load(res)
    # ans.append(d)
# 휴게소 글자 제거
    for i in range(len(d["list"])):
        # if d["list"][i]['serviceAreaName'] == None:
        #     pass
        # else:
        #     d["list"][i]['serviceAreaName'] = d["list"][i]['serviceAreaName'].replace(
        #         "휴게소", "")
        # tmp["휴게소명"] = d["list"][i]['serviceAreaName']
        # tmp["고속도로명"] = d["list"][i]['routeName']
        if d["list"][i]['routeName'] not in ans:
            ans.append(d["list"][i]['routeName'])
        print(d["list"][i]['routeName'])
        # ans.append(tmp)

with open(sample, 'w', encoding="utf-8") as file:
    json.dump(ans, file, ensure_ascii=False, indent="\t")
