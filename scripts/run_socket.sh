#!/bin/sh
cd /var/www/tinychat
sudo netstat -lnp
sudo kill -9 `sudo lsof -t -i:8084`
sudo php socket.php