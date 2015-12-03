#!/usr/bin/python
# -*- coding: utf-8 -*-

import MySQLdb
import threading
from datetime import date
import datetime
import pytz
from time import sleep
import time

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
		con.close()
	except MySQLdb.Error:
		print(db.error())

def delete_user_logs(id_app, uid):
	try:
		con = MySQLdb.connect(host="localhost", user="", passwd="", db="")
		cur = con.cursor()
		cur.execute('SET NAMES `utf8`')
		cur.execute("DELETE FROM `vk_app_all_visits_logs` WHERE `id_app`='"+str(id_app)+"' AND `id_vk`='"+str(uid)+"';")
		con.close()
	except MySQLdb.Error:
		print(db.error())

def datetimenow(fmt, time):
    if time:
        d = time
    else:
        d = datetime.datetime.now()
    
    dtz_string = d.strftime(fmt) + ' ' + "Europe/Moscow"
    
    d_string, tz_string = dtz_string.rsplit(' ', 1)
    d2 = datetime.datetime.strptime(d_string, fmt)
    
    today = d2.strftime(fmt)
    return today

##################
class AutoDeleteUser(threading.Thread):
    def __init__(self):
        super(AutoDeleteUser, self).__init__()
        self.keep_running = True
    
    def run(self):
        try:
            while self.keep_running:
                now = time.localtime()
                
                array_list_users = []
                
                try:
                    print "==== Start Action ==="
                    con = MySQLdb.connect(host="localhost", user="", passwd="", db="")
                    cur = con.cursor()
                    cur.execute('SET NAMES `utf8`')
                    cur.execute('SELECT `id`, `date`, `id_app`, `id_vk` FROM `vk_app_all_visits` ORDER BY `id` ASC')
                    result = cur.fetchall()
                    
                    for row in result:
                        result_day_user_last = days_had_passed(str(row[1]), str(datetimenow('%Y-%m-%d', '')))
                        result_day_user_last2 = int(result_day_user_last)
                        result_day_user_last3 = int(result_day_user_last2)
                        
                        if int(result_day_user_last3) > 40:
                            array_list_users.append({
                                "id": str(row[0]),
                                "date": str(row[1]),
                                "id_app": str(row[2]),
                                "id_vk": str(row[3]),
                                "last_connection": str(result_day_user_last)
                                })
                    
                    print "COUNT: " + str(len(array_list_users))
                    sCurrent = 0
                    
                    for row in array_list_users:
                        sCurrent = sCurrent + 1
                        result_procent = (100 * sCurrent / int(len(array_list_users)))
                        
                        print("Procent: " + str(result_procent) + "%, id_app: " + str(row["id_app"]) + ", UID: " + str(row["id_vk"]) + " last connection " + str(row["last_connection"]) + " days")
                        delete_user(row["id"])
                        delete_user_logs(row["id_app"], row["id_vk"])
                        
                        if(self.keep_running == False):
                            break
                        
                        sleep(1.0)
                    
                    if(int(sCurrent) > 0):
                        cur.execute("OPTIMIZE TABLE `vk_app_all_visits`, `vk_app_all_visits_logs`")
                    
                    con.close()
                    print "==== Finish Action ==="
                except MySQLdb.Error:
                    print(db.error())
                
                time.sleep(1)
        except Exception, e:
            raise e
    def die(self):
        self.keep_running = False

autodeleteusers = AutoDeleteUser()

def main():
    try:
        autodeleteusers.start()
        print 'Started daemon autodeleteusers...'
        
        while True:
            time.sleep(2)
            continue
    except KeyboardInterrupt:
        print '^C received, shutting down daemon autodeleteusers.'
        autodeleteusers.die()

if __name__ == '__main__':
    main()
