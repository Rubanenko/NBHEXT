#!/bin/bash
# This script will download and install everything you need to start your own NBHEXT server.
# Should be run only on Ubuntu.

source /etc/lsb-release
if [ "$DISTRIB_ID" != "Ubuntu" ]; then
    echo "ERROR: This script should be used on Ubuntu machine only"
    exit 1
fi
