import urllib.request
import json
import requests

# 대표음식 총 201개, 1페이지당 100개씩 총 3페이지씩 있어서 pageNo 바꾸면서 해야함
sample = './testbestfood.json'
pk = 0
ans = []
for x in range(1, 4):
    URL = f'http://data.ex.co.kr/openapi/business/representFoodServiceArea?key=3591832985&type=json&numOfRows=100&pageNo={x}'
    # data = {'key': "3591832985", 'type': "JSON", 'numOfRows': '10', 'pageNo': '1',
    #         'routeCd': '', 'routeNm': '', 'stdRestCd': '', 'stdRestNm': ''}

    res = urllib.request.urlopen(URL)
    d = json.load(res)
    # for i in range(0, len(d["list"])):
    #     # a = {'pk': i}
    #     d["list"][i].setdefault('pk', i+99)

    for i in range(len(d["list"])):
        tmp = {}
        tmp["model"] = "defaults.Rest"
        tmp["pk"] = pk
        tmp["fields"] = {}
        if d["list"][i]['serviceAreaName'] == None:
            pass
        else:
            d["list"][i]['serviceAreaName'] = d["list"][i]['serviceAreaName'].replace(
                "휴게소", "")
        tmp["fields"]["rest_name"] = d["list"][i]['serviceAreaName']
        tmp["fields"]["main_name"] = d["list"][i]['batchMenu']
        tmp["fields"]["main_price"] = d["list"][i]['salePrice']
        ans.append(tmp)
        pk += 1
print('done')
# print(type(d))

with open(sample, 'w', encoding="utf-8") as file:
    json.dump(ans, file, ensure_ascii=False, indent="\t")
