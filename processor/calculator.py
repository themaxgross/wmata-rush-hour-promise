import json

global StationInfos
global StationToStationJson

with open('AllStations.json') as station_infos:
    StationInfos = json.load(station_infos)

with open('WMATA-all-stations.json') as stations_file:
    StationToStationJson = json.load(stations_file)


global all_trip_times

all_trip_times = {}

for station_pair in StationToStationJson["StationToStationInfos"]:
    for source_station_item in StationInfos["Stations"]:
        if station_pair["SourceStation"] == source_station_item["Code"]:
            for dest_station_item in StationInfos["Stations"]:
                if station_pair["DestinationStation"] == dest_station_item["Code"]:

                    print("From", source_station_item["Name"], "to", dest_station_item["Name"])

                    trip_time = 0

                    print("Time between stations")
                    print(station_pair["RailTime"])
                    trip_time = trip_time + station_pair["RailTime"]

                    print("Transfer additional time")
                    SourceStationLines = [source_station_item["LineCode1"], source_station_item["LineCode2"], source_station_item["LineCode3"]]
                    DestinationStationLines = [dest_station_item["LineCode1"], dest_station_item["LineCode2"], dest_station_item["LineCode3"]]
                    transfer_time = 0
                    for source_line in SourceStationLines:
                        if source_line not in DestinationStationLines:
                            transfer_time = 1
                    print(transfer_time)
                    trip_time = trip_time + transfer_time

                    print("Time to platform")
                    TwoMinuteStations = ["A01", "C01", "B01", "F01", "B06", "E06", "D03", "F03"]
                    ThreeMinuteStations = ["C05", "B10"]
                    station_code = source_station_item["Code"]

                    if station_code in TwoMinuteStations:
                        print(2)
                        trip_time = trip_time + 2
                    elif station_code in ThreeMinuteStations:
                        print(3)
                        trip_time = trip_time + 3
                    else:
                        print(1)
                        trip_time = trip_time + 1

                    print("Wait time")

                    if source_station_item["LineCode1"] == "RD":
                        print(4)
                        trip_time = trip_time + 4
                    else:
                        print(8)
                        trip_time = trip_time + 8

                    print("Final trip time")
                    print(trip_time)

                    all_trip_times.setdefault(source_station_item["Code"], {}).setdefault(dest_station_item["Code"], trip_time)

                    break
                    break

with open('trip_times.json', 'w+') as file:
    file.write(json.dumps(all_trip_times))

