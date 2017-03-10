#!/bin/bash

echo “STARTING METEOR GALAXY DEPLOYMENT”

cd /Users/andrewnormore/meteor/skyrooms

DEPLOY_HOSTNAME=us-east-1.galaxy-deploy.meteor.com meteor deploy www.skyrooms.io --settings settings.json

echo “COMPLETED METEOR GALAXY DEPLOYMENT”s
