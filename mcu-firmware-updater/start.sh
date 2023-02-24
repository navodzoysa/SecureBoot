#!/bin/sh

RENODE_EXE_PATH=/home/navod/renode_portable/renode

$RENODE_EXE_PATH renode-config.resc --port 4444 --disable-xwt
