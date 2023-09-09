import csv
import traceback

import requests
import json

with open('data.csv') as fp:
    reader = csv.reader(fp)

    obj = {}
    for row in reader:
        print(row[2])
        if row[2] not in obj:
            obj[row[2]] = {}

        obj[row[2]][row[1]] = {
            'name': row[0]
        }

    keys = set()

    res = {}

    for status, d in obj.items():
        res[status] = {}
        for phone, data in d.items():
            resp = requests.post(
                'http://35.244.0.251:8990/query/keywords',
                auth=('khojuser', 'khojpassword'),
                data={
                    "keywords": [phone],
                    "size": 1
                }
            )

            result = resp.json()['results']
            k = list(result.keys())
            if len(k) == 0:
                continue

            d = result[k[0]][0]
            keys = keys.union(d.keys())

            print(obj[status])
            d['name'] = obj[status][phone]['name']
            del d['file']
            res[status][phone] = d

    print(keys)
    {'name', 'salary', 'address', 'call_status', 'company', 'pin', 'profession', 'file', 'city'}

    for key, data in res.items():
        with open(f'{key}.csv', 'w', newline='') as csvfile:
            fp = csv.writer(csvfile)
            for key, value in data.items():
                row = [key]
                for key in keys:
                    row.append(value.get(key, ''))
                fp.writerow(row)

    with open('resp.json', 'w') as fp:
        json.dump(obj, fp)

if __name__ == '__main__':
    pass