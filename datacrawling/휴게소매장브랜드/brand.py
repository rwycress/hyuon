import urllib.request
import json
import requests

# 노선별 방향별 휴게시설
ans = []
sample = './allbrand.json'
t = 0
for x in range(1, 4):
    URL = f'http://data.ex.co.kr/openapi/restinfo/restBrandList?key=3591832985&type=json&numOfRows=100&pageNo={x}'
    # data = {'key': "3591832985", 'type': "JSON", 'numOfRows': '10', 'pageNo': '1',
    #         'routeCd': '', 'routeNm': '', 'stdRestCd': '', 'stdRestNm': ''}

    res = urllib.request.urlopen(URL)
    d = json.load(res)

# 휴게소 글자 제거
    for i in range(len(d["list"])):
        tmp = {}
        t += 1
        if d["list"][i]['stdRestNm'] == None:
            pass
        else:
            d["list"][i]['stdRestNm'] = d["list"][i]['stdRestNm'].replace(
                "휴게소", "")
        tmp["rest_name"] = d["list"][i]['stdRestNm']

        ans.append(tmp)
print("done")
with open(sample, 'w', encoding="utf-8") as file:
    json.dump(ans, file, ensure_ascii=False, indent="\t")
