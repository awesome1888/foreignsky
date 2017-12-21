#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../admin && meteor npm install
cd $DIR/../../admin && npm run-script test