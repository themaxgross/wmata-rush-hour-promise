import json

global StationInfos

with open('AllStations.json') as station_infos:
    StationInfos = json.load(station_infos)

for target_station in ["Metro Center", "Gallery Pl-Chinatown", "Fort Totten", "L'Enfant Plaza", "Rosslyn", "Wheaton"]:
    print(target_station)
    for station in StationInfos["Stations"]:
        if station["Name"] == target_station:
            print(station["Code"])