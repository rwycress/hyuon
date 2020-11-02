import urllib.request
import json
import requests
import csv


# 노선별 방향별 휴게시설
ans = []
sample = './realtestsample2.json'

f = open('restco.csv', 'r')
rdr = csv.reader(f)
rdr_list = []
for content in rdr:
    rdr_list.append(content)

# for line in rdr:
#     print(line[1])
pk = 0
for x in range(1, 4):
    URL = f'http://data.ex.co.kr/openapi/business/serviceAreaRoute?key=3591832985&type=json&numOfRows=100&pageNo={x}'

    # data = {'key': "3591832985", 'type': "JSON", 'numOfRows': '10', 'pageNo': '1',
    #         'routeCd': '', 'routeNm': '', 'stdRestCd': '', 'stdRestNm': ''}
    # URL2 = f'http://data.ex.co.kr/openapi/business/conveniServiceArea?key=3591832985&type=json&numOfRows=100&pageNo={x}'
    res = urllib.request.urlopen(URL)
    d = json.load(res)

    # res2 = urllib.request.urlopen(URL2)
    # d2 = json.load(res2)


# 휴게소 글자 제거
    for i in range(len(d["list"])):
        tmp = {}
        ###
        tmp["model"] = "defaults.Rest"
        tmp["pk"] = pk
        tmp["fields"] = {}
        ###
        if d["list"][i]['serviceAreaName'] == None:
            pass
        else:
            d["list"][i]['serviceAreaName'] = d["list"][i]['serviceAreaName'].replace(
                "휴게소", "")
        x = d["list"][i]['serviceAreaName']
        tmp["fields"]['rest_name'] = d["list"][i]["serviceAreaName"]
        tmp["fields"]['rest_address'] = d["list"][i]["svarAddr"]
        # print(f'{d["list"][i]["serviceAreaName"]}')
        # print(f'{i} {x}')
        # print(rdr)
        for info in rdr_list:
            # print(d["list"][i]['serviceAreaName'])
            # print(f'{i} {x} {info[1]}')
            # print(f'{d["list"][i]["serviceAreaName"]}{info[1]}')
            if d["list"][i]["serviceAreaName"] == info[1]:
                tmp["fields"]['rest_coordinate'] = [info[3], info[4]]
                break
            else:
                pass
        if '유' in d["list"][i]['convenience']:
            tmp["fields"]['rest_feeding'] = 1
        else:
            tmp["fields"]['rest_feeding'] = 0
        if '면' in d["list"][i]['convenience']:
            tmp["fields"]['rest_sleep'] = 1
        else:
            tmp["fields"]['rest_sleep'] = 0
        if '샤' in d["list"][i]['convenience']:
            tmp["fields"]['rest_shower'] = 1
        else:
            tmp["fields"]['rest_shower'] = 0
        if '세' in d["list"][i]['convenience']:
            tmp["fields"]['rest_laundary'] = 1
        else:
            tmp["fields"]['rest_laundary'] = 0
        if '약' in d["list"][i]['convenience']:
            tmp["fields"]['rest_drug'] = 1
        else:
            tmp["fields"]['rest_drug'] = 0

        if 'O' == d["list"][i]['maintenanceYn']:
            tmp["fields"]['rest_fix'] = 1
        else:
            tmp["fields"]['rest_fix'] = 0

        if 'O' == d["list"][i]['truckSaYn']:
            tmp["fields"]['rest_truck'] = 1
        else:
            tmp["fields"]['rest_truck'] = 0
        pk += 1
        ans.append(tmp)
    # for i in range(len(d2['list'])):
    #     if d2["list"][i]['serviceAreaName'] == None:
    #         pass
    #     else:
    #         d2["list"][i]['serviceAreaName'] = d2["list"][i]['serviceAreaName'].replace(
    #             "휴게소", "")
    for i in range(len(d['list'])):
        for j in range(len(ans)):
            if d['list'][i]["serviceAreaName"] == ans[j]["fields"]["rest_name"]:
                if d['list'][i]["direction"] is not None and d['list'][i]["routeName"] is not None:
                    ans[j]["fields"]["rest_high"] = d['list'][i]["routeName"]
                    ans[j]["fields"]["rest_highdirect"] = d['list'][i]["direction"]
                else:
                    ans[j]["fields"]["rest_high"] = None
                    ans[j]["fields"]["rest_highdirect"] = None

print('done')
with open(sample, 'w', encoding="utf-8") as file:
    json.dump(ans, file, ensure_ascii=False, indent="\t")
f.close()
