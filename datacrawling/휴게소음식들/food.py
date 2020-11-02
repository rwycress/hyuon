
import urllib.request
import json
import requests

# 휴게소에 파는 음식들, 3882개 40페이지
sample = './realallfood.json'
ans = []
# chk = 0
pk = 0
for z in range(1, 41):
    URL = (
        f'http://data.ex.co.kr/openapi/restinfo/restBestfoodList?key=3591832985&type=json&numOfRows=100&pageNo={z}')
# data = {'key': "3591832985", 'type': "JSON", 'numOfRows': '10', 'pageNo': '1',
#         'routeCd': '', 'routeNm': '', 'stdRestCd': '', 'stdRestNm': ''}

    res = urllib.request.urlopen(URL)
    d = json.load(res)
    # for i in range(0, len(d["list"])):
    #     # a = {'pk': i}
    #     d["list"][i].setdefault('pk', i+chk)
    # chk += 99
    # ans.append(d)
    for i in range(len(d["list"])):
        tmp = {}
        tmp["model"] = "defaults.RestMenu"
        tmp["pk"] = pk
        tmp["fields"] = {}
        if d["list"][i]['stdRestNm'] == None:
            pass
        else:
            d["list"][i]['stdRestNm'] = d["list"][i]['stdRestNm'].replace(
                "휴게소", "")
        tmp["fields"]["rest_name"] = d["list"][i]['stdRestNm']
        tmp["fields"]["menu_name"] = d["list"][i]['foodNm']
        tmp["fields"]["menu_price"] = d["list"][i]['foodCost']
        tmp["fields"]["menu_best"] = d["list"][i]['bestfoodyn']
        ans.append(tmp)
        pk += 1

print('done')
# print(type(d))

with open(sample, 'w', encoding="utf-8") as file:
    json.dump(ans, file, ensure_ascii=False, indent="\t")
