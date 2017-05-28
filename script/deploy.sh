#!/usr/bin/env bash

meteor build .;
scp ../nachberlin.ru.tar.gz root@188.120.254.6:/home/indaberlin/;
ssh root@188.120.254.6 'systemctl stop nachberlin';
ssh root@188.120.254.6 'rm -rf /home/indaberlin/bundle/';
ssh root@188.120.254.6 'tar -xzf /home/indaberlin/nachberlin.ru.tar.gz -C /home/indaberlin/';
ssh root@188.120.254.6 'cd /home/indaberlin/bundle/programs/server/; /home/indaberlin/.node/current/bin/npm install;'
ssh root@188.120.254.6 'chown -R indaberlin:indaberlin /home/indaberlin/bundle/';
ssh root@188.120.254.6 'chown -R indaberlin:indaberlin /home/indaberlin/settings.json';
ssh root@188.120.254.6 'rm /home/indaberlin/nachberlin.ru.tar.gz';
ssh root@188.120.254.6 'systemctl start nachberlin';

#export PATH="~/.node/current/bin:$PATH";
#export MONGO_URL='mongodb://localhost:27017/nachberlin';
#export ROOT_URL='https://nachberlin.ru/';
#export PORT='11001';
#export METEOR_SETTINGS='{"public":{"google-maps_key": "AIzaSyDV90oJprjrtNbo3ASxmvFObr05jiC-0WI"}}';
#node main.js;