#!/usr/bin/python
# Automatic Delete User

from datetime import date
import datetime
import pytz
import MySQLdb
from time import sleep

print "Script Start"

def days_had_passed(t1, t2):
	
	dtz_string = str(t1)
	dtz_string2 = dtz_string.rsplit(' ', 1)
	dtz_string3 = dtz_string2[0].rsplit('-', 1)
	dtz_string4 = dtz_string3[0].rsplit('-', 1)
	
	dtz_string5 = str(t2)
	dtz_string6 = dtz_string5.rsplit(' ', 1)
	dtz_string7 = dtz_string6[0].rsplit('-', 1)
	dtz_string8 = dtz_string7[0].rsplit('-', 1)
	
	t1 = date(int(dtz_string4[0]), int(dtz_string4[1]), int(dtz_string3[1]))
	t2 = date(int(dtz_string8[0]), int(dtz_string8[1]), int(dtz_string7[1]))
	result = t2-t1
	
	dtz_string = str(result)
	dtz_string2 = dtz_string.rsplit(' ', 1)
	dtz_string3 = dtz_string2[0].rsplit(' ', 1)
	data = str(dtz_string3[0])
	
	dtz_string9 = data.rsplit(':', 1)
	dtz_string10 = dtz_string9[0].rsplit(':', 1)
	
	if dtz_string10[0] == "0":
		return 0
	else:
		return data

def delete_user(id):
	try:
		con = MySQLdb.connect(host="localhost", user="", passwd="", db="")
		cur = con.cursor()
		cur.execute('SET NAMES `utf8`')
		cur.execute("DELETE FROM `vk_app_all_visits` WHERE `id`='"+str(id)+"';")
		# con.close()
	except MySQLdb.Error:
		print(db.error())

def delete_user_logs(id_app, uid):
	try:
		con = MySQLdb.connect(host="localhost", user="", passwd="", db="")
		cur = con.cursor()
		cur.execute('SET NAMES `utf8`')
		cur.execute("DELETE FROM `vk_app_all_visits_logs` WHERE `id_app`='"+str(id_app)+"' AND `id_vk`='"+str(uid)+"';")
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

def load_users():
	try:
		con = MySQLdb.connect(host="localhost", user="", passwd="", db="")
		cur = con.cursor()
		cur.execute('SET NAMES `utf8`')
		cur.execute('SELECT `id`, `name`, `date`, `id_app`, `id_vk` FROM `vk_app_all_visits` ORDER BY `id` ASC')
		result = cur.fetchall()
		for row in result:
			result_day_user_last = days_had_passed(str(row[2]), str(datetimenow('%Y-%m-%d', '')))
			result_day_user_last2 = int(result_day_user_last)
			result_day_user_last3 = int(result_day_user_last2)
			
			if result_day_user_last3 > 40:
				print(str(row[1]) + " last connection " + result_day_user_last + " days")
				delete_user(row[0])
				delete_user_logs(row[3], row[4])
				sleep(1.0)
	except MySQLdb.Error:
		print(db.error())

load_users()
