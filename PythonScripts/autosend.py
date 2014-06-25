#!/usr/bin/python
# Automatic sendNotification 

# -*- coding: utf-8 -*-

import MySQLdb
import threading
import time
import datetime
import pytz
from threading import Timer
import random
from crontab import CronTab
from time import sleep
from httplib2 import Http
from urllib import urlencode
import urllib

sCurrent = 0
result_procent = 0

random_second = random.randint(1, 5)

count = 0
count_selected = 1

mListAppID = {}
mListMessage = {}
mListDateTime = {}
mListCounterApp = {}
mListDateTimeBool = {}
mListUID = {}
mListIDField = {}

users_cron    = CronTab(user='kykyiiikuh')

print "Script Start"

def fetch_url(url, params, method):
  params = urllib.urlencode(params)
  if method=="GET":
    f = urllib.urlopen(url+"?"+params)
  else:
    # Usually a POST
    f = urllib.urlopen(url, params)
  return (f.read(), f.code)

def countUserApp():
	global count_selected
	
	try:
		con = MySQLdb.connect(host="localhost", user="vk_app", passwd="gX3BMHbSp1n4Zvln", db="vk_app")
		cur = con.cursor()
		cur.execute('SET NAMES `utf8`')
		cur.execute("SELECT COUNT(id) as count FROM `vk_app_all_visits` WHERE `id_app`='"+str(mListAppID[count_selected])+"'")
		result = cur.fetchall()
		for row in result:
			mListCounterApp[count_selected] = (row[0])
		
		# con.close()
	except MySQLdb.Error:
		print(db.error())

def senderlistapp():
	global count
	try:
		con = MySQLdb.connect(host="localhost", user="vk_app", passwd="gX3BMHbSp1n4Zvln", db="vk_app")
		cur = con.cursor()
		cur.execute('SET NAMES `utf8`')
		cur.execute("SELECT `id_app`, `message`, `datetime_start`, `uid`, `id` FROM `vk_app_sender_autosend` WHERE `status`='0' AND `progress`='0' ORDER BY `id` DESC")
		result = cur.fetchall()
		for row in result:
			count = count + 1
			mListAppID[count] = (row[0])
			mListMessage[count] = (row[1])
			mListDateTime[count] = (row[2])
			mListUID[count] = (row[3])
			mListIDField[count] = (row[4])
			
			fmt = '%Y-%m-%d %H:%M'
			today = datetimenow(fmt, "")
			today_edit = datetimenow(fmt, row[2])
			
			if today_edit == today:
				mListDateTimeBool[count] = ("1")
			else:
				mListDateTimeBool[count] = ("0")
			
			print "NEW DATE " + str(row[2])
    		# con.close()
	except MySQLdb.Error:
    		print(db.error())

def datetimenow(fmt, time):
    if time:
        d = time
    else:
        d = datetime.datetime.now(pytz.timezone("Europe/Moscow"))
    
    dtz_string = d.strftime(fmt) + ' ' + "Europe/Moscow"
    
    d_string, tz_string = dtz_string.rsplit(' ', 1)
    d2 = datetime.datetime.strptime(d_string, fmt)
    
    today = d2.strftime(fmt)
    return today

def finish(progress):
	global count_selected
	id_app_db = mListAppID[count_selected]
	id_field = mListIDField[count_selected]
	
	today = datetimenow('%Y-%m-%d %H:%M:%S', '')
	
	try:
		con = MySQLdb.connect(host="localhost", user="vk_app", passwd="gX3BMHbSp1n4Zvln", db="vk_app")
		cur = con.cursor()
		cur.execute('SET NAMES `utf8`')
		
		if progress == 100:
			cur.execute("DELETE FROM `vk_app_sender_autosend` WHERE `id`='"+str(id_field)+"';")
		else:
			cur.execute("UPDATE `vk_app_sender_autosend` SET `datetime`='"+today+"', `progress`='"+str(progress)+"', `status`='1' WHERE `id_app`='"+str(id_app_db)+"';")
		# con.close()
	except MySQLdb.Error:
		print(db.error())
	sleep(1.0)

def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t

def sender():
	global sCurrent
	global count
	global count_selected
	
	sFinish = int(mListCounterApp[count_selected])
	
	if sFinish == 0:
		return false
	
	if sFinish < sCurrent:
		sCurrent = 0
		
		url = "http://ploader.ru/sender/api/load.html"
		method = "POST"
		params = {"action": "set_sender_list","viewer_id": ""+str(mListUID[count_selected])+"", "app_id": ""+str(mListAppID[count_selected])+""}
		[content, response_code] = fetch_url(url, params, method)
		
		sleep(5.0)
		
		finish(100)
		
		sleep(2.0)
		
		if count_selected == 1:
			dtz_string = str(mListDateTime[count_selected])
			dtz_string2 = dtz_string.rsplit(' ', 1)
			dtz_string2_1 = dtz_string.rsplit('-', 1)
			dtz_string2_2 = dtz_string2_1[0].rsplit('-', 1)
			dtz_string2_3 = dtz_string2_1[1].rsplit(' ', 1)
			dtz_string3 = dtz_string2[1].rsplit(':', 1)
			dtz_string4 = dtz_string3[0].rsplit(':', 1)
			
			users_cron.remove_all(time=''+dtz_string4[1]+' '+dtz_string4[0]+' '+dtz_string2_3[0]+' '+dtz_string2_2[1]+' *')
			users_cron.write()
		
		sleep(2.0)
		
		if count_selected < count:
			count_selected = count_selected + 1
			StartFunc()
		
		print "Finish"
		return "finish"
	
	url = "http://ploader.ru/sender/api/load.html"
	method = "POST"
	params = {"action": "sender_message", "viewer_id": ""+str(mListUID[count_selected])+"", "app_id": ""+str(mListAppID[count_selected])+"", "fromid": ""+str(sCurrent)+""}
	[content, response_code] = fetch_url(url, params, method)
	
	sleep(2.0)
	
	result_procent = (100 * sCurrent / sFinish)
	finish(str(result_procent))
	
	print "=============ACTION PROGRESS======"
	print "COUNT SELECTED: " + str(count_selected)
	print "ID APP: " +str(mListAppID[count_selected])
	print "MESSAGE: " +str(mListMessage[count_selected])
	print str(sCurrent)  + " of " + str(sFinish) + " " + str(result_procent)+"%"
	print "=================================="
	
	onAjaxSuccess()

def onAjaxSuccess():
    global sCurrent
    sPosition = sCurrent + 100
    sCurrent = sPosition
    
    t = Timer(1.5, sender)
    t.start()

def StartFunc():
	global count
	global count_selected
	
	print "========LIST ACTION=========="
	print "COUNT SELECTED: " + str(count_selected)
	print "ID APP: " +str(mListAppID[count_selected])
	print "MESSAGE: " +str(mListMessage[count_selected])
	print "============================="
	
	id_app_db = mListAppID[count_selected]
	message_db = mListMessage[count_selected]
	
	if id_app_db != 0 and message_db != "":
		if mListDateTimeBool[count_selected] == "1":
			t4 = Timer(1.5, countUserApp)
			t4.start()
			
			t5 = Timer(2.5, sender)
			t5.start()
		else:
			if count_selected < count:
				count_selected = count_selected + 1
				StartFunc()

# set_interval(getinfoautosend, 1)

t = Timer(1.5, senderlistapp)
t.start()

t3 = Timer(2.5, countUserApp)
t3.start()

t2 = Timer(3.5, StartFunc)
t2.start()