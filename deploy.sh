#!/bin/bash
zip -r dist.zip dist
ssh -p 22 root@101.34.105.150
cd /usr/local/nginx
rm -rf dist dist.zip
scp /Users/wenqingren/code/tuanzhzh/commodityBackground/dist.zip root@124.222.210.198:/usr/local/nginx/
unzip dist.zip

pwd: T1012t5r5rZ..