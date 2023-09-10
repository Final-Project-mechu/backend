#!/usr/bin/env bash

PROJECT_ROOT="/home/ubuntu/app"
APP_NAME="project"

TIME_NOW=$(date +%c)

cd $PROJECT_ROOT

sudo pm2 delete $APP_NAME
sudo pm2 "npm i"
sudo pm2 "npm run start"

echo "$TIME_NOW > Deploy has been completed"
