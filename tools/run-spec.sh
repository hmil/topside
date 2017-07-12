#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

run_ok() {
    set -e
    echo "[test] $1"

    echo -ne "\r\e[0Kpreprocess template"
    "$CC" fixtures/templates/$2.top.html

    echo -ne "\r\e[0Kcompile template"
    "$tsc" -p .

    echo -ne "\r\e[0Kexecute test case"
    node .compiled/OK/$1.js > .output/OK/$1.html

    if diff .output/OK/$1.html references/OK/$1.html; then
        echo -e "\r\e[0K=> ${GREEN}OK${NC}"
    else
        echo -e "\r\e[0K=> ${RED}FAIL${NC}"
    fi

}

export CC="`pwd`/bin/topside"
export tsc="`pwd`/node_modules/.bin/tsc"
cd spec
mkdir -p .output/OK .output/FAIL

run_ok hello_world hello_world
run_ok complex houses
