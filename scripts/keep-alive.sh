#!/bin/sh
# Render cron keep-alive — silent, minimal output
curl -sf -o /dev/null -w '' https://hireready-ahxj.onrender.com/ping || echo "ping failed"
