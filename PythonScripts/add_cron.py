#!/usr/bin/python
# Add Cron User

from crontab import CronTab

cron    = CronTab(user='')

#-*- coding: utf8 -*-

print "Script Start"

def params():
	import argparse
	parser = argparse.ArgumentParser()
	parser.add_argument('-d', '--datetime', required=False, dest='DATETIME',
                        help='DateTime')
	parser.add_argument('-dir', '--dirname', required=False, dest='DIRNAME',
                        help='DIRNAME')
	args = parser.parse_args()
	DATETIME = args.DATETIME
	DIRNAME = args.DIRNAME
	return DATETIME, DIRNAME

def explode_datetime(dtz_string):
	dtz_string2 = dtz_string.rsplit(' ', 1)
	dtz_string2_1 = dtz_string.rsplit('-', 1)
	dtz_string2_2 = dtz_string2_1[0].rsplit('-', 1)
	dtz_string2_3 = dtz_string2_1[1].rsplit(' ', 1)
	dtz_string3 = dtz_string2[1].rsplit(':', 1)
	dtz_string4 = dtz_string3[0].rsplit(':', 1)
	return str(dtz_string4[1]), str(dtz_string4[0]), str(dtz_string2_3[0]), str(dtz_string2_2[1])

def load():
	datetime = explode_datetime(str(params()[0]))
	job  = cron.new(command=str(params()[1]+' >/dev/null 2>&1'))
	job.minute.on(int(datetime[0]))
	job.hour.on(int(datetime[1]))
	job.day.on(int(datetime[2]))
	job.month.on(int(datetime[3]))
	cron.write()

load()