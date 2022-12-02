#!/bin/sh
cd /var/www/tinychat
sudo netstat -lnp
sudo kill -9 `sudo lsof -t -i:8080`
sudo php socket.php