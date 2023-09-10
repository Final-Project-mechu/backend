#!/bin/bash

cd /home/ubuntu/app

sudo npm install
sudo pm2 kill
sudo pm2 start "npm run start:prod
