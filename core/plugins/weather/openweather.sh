#!/bin/bash
location=$(curl -sf https://am.i.mullvad.net/json)
if [ -n "$location" ]; then
  loc=$(echo "$location" | jq)
  lat=$(echo $location | jq '.latitude')
  city=$(echo $location | jq '.city')
  lon=$(echo $loc | jq '.longitude')
  weather=$(curl -sf "https://api.openweathermap.org/data/2.5/weather?appid=${1}&lat=$lat&lon=$lon&units=metric")
  forecast=$(curl -sf "https://api.openweathermap.org/data/2.5/forecast?appid=${1}&lat=$lat&lon=$lon&units=metric")

  res=$(echo $weather | sed 's/.$//')
  res="$res,\"city\":$city, \"forecast\":$forecast}"
  echo $res
else
  echo '{"coord":{"lon":16.3726,"lat":48.1936},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"base":"stations","main":{"temp":-999,"feels_like":2.14,"temp_min":5.35,"temp_max":9.39,"pressure":1028,"humidity":84},"visibility":10000,"wind":{"speed":8.75,"deg":290,"gust":15.43},"clouds":{"all":75},"dt":1706014019,"sys":{"type":2,"id":2037452,"country":"AT","sunrise":1705991642,"sunset":1706024278},"timezone":3600,"id":2761333,"name":"UNKNOWN","cod":200,"city":"unknown"}'
fi
