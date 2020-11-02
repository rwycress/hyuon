import urllib.request
import json
import requests
import csv


# 노선별 방향별 휴게시설
ans = []
sample = './top5list.json'

f = open('top5list.csv', 'r')
rdr = csv.reader(f)
rdr_list = []
for content in rdr:
    rdr_list.append(content)
pk = 0
ans = []
for m in rdr_list:
    tmp = {}
    tmp["model"] = "defaults.TopItem"
    tmp["pk"] = pk
    tmp['fields'] = {}
    tmp['fields']["rest_name"] = m[3]
    tmp['fields']["rank"] = m[1]
    tmp['fields']["top_shop"] = m[5]
    tmp['fields']["top_item"] = m[7]
    ans.append(tmp)
    pk += 1
with open(sample, 'w', encoding="utf-8") as file:
    json.dump(ans, file, ensure_ascii=False, indent="\t")
f.close()
