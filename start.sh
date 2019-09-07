#!/bin/sh
source ~/.profile
PATH=/etc:/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin
base_dir=$(cd `dirname $0`; pwd)
node $base_dir/monitor.js
