import json

global stations_list

stations_list = {}

with open('AllStations.json') as all_stations_file:
    all_stations = json.load(all_stations_file)
    for station in all_stations["Stations"]:
        if station["StationTogether1"] is "":
            stations_list[station["Name"]] = station["Code"]
        else:
            stations_list[station["Name"]] = sorted([station["Code"], station["StationTogether1"]])

with open('stations_codes.json', 'w+') as output_file:
    output_file.write(json.dumps(stations_list))