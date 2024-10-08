#!/bin/bash

obfuscated_key="ZjI0ZTI5ZDcwMzdlNGU4MTk2Nzk3OGM5ODY2NWJkMzA="

decoded_key=$(echo "$obfuscated_key" | base64 --decode)

file_path="docker-compose.yml"

sed -i "s/XXX/$decoded_key/g" "$file_path"

echo "The value has been updated in the file."