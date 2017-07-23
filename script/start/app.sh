#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../app/ && meteor npm install
cd $DIR/../../app/ && npm start