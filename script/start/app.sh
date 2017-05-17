#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#cd $DIR/../../app && meteor npm install
#cd $DIR/../../app && npm start

cd $DIR/../../ && meteor npm install
cd $DIR/../../ && npm start