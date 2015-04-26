#!/usr/bin/python
# Export Data App

# -*- coding: utf-8 -*-

import time
import datetime
import pytz

import MySQLdb
from time import sleep

count_users = 0
count_users_logs = 0
count_senderlist = 0
count_list_export = 0
count_ = 0
count_sender_list = 0
count_trick = 0
title_file = ""
sCurrent = 0

hash_db = 0

user_db = ""
passwd_db = ""
db_ = ""

print "Script Start"

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

def countUserApp(id_app):
	global count_
	global count_users
	global user_db
	global passwd_db
	global db_
	
	count = 0
	try:
		con = MySQLdb.connect(host="localhost", user=""+str(user_db)+"", passwd=""+str(passwd_db)+"", db=""+str(db_)+"")
		cur = con.cursor()
		cur.execute('SET NAMES `utf8`')
		cur.execute("SELECT COUNT(id) as count FROM `vk_app_all_visits` WHERE `id_app`='"+str(id_app)+"'")
		result = cur.fetchall()
		for row in result:
			count = row[0]
		
		#con.close()
	except MySQLdb.Error:
		print(db.error())
	count_ = count_ + count
	count_users = count
	sleep(1.0)

def countUserAppLogs(id_app):
	global count_
	global count_users_logs
	global user_db
	global passwd_db
	global db_
	
	count = 0
	try:
		con = MySQLdb.connect(host="localhost", user=""+str(user_db)+"", passwd=""+str(passwd_db)+"", db=""+str(db_)+"")
		cur = con.cursor()
		cur.execute('SET NAMES `utf8`')
		cur.execute("SELECT COUNT(id) as count FROM `vk_app_all_visits_logs` WHERE `id_app`='"+str(id_app)+"'")
		result = cur.fetchall()
		for row in result:
			count = row[0]
		
		##con.close()
	except MySQLdb.Error:
		print(db.error())
	count_ = count_ + count
	count_users_logs = count
	sleep(1.0)

def countListExport():
    global user_db
    global passwd_db
    global db_
    
    global count_list_export
    
    count = 0
    
    try:
        con = MySQLdb.connect(host="localhost", user=""+str(user_db)+"", passwd=""+str(passwd_db)+"", db=""+str(db_)+"")
        cur = con.cursor()
        cur.execute('SET NAMES `utf8`')
        cur.execute("SELECT COUNT(id) as count FROM `vk_app_export`;")
        result = cur.fetchall()
        for row in result:
            count = row[0]
        
    except MySQLdb.Error:
        print(db.error())
    count_list_export = count
    ##con.close()
    sleep(1.0)

def countSenderList(id_app):
	global count_
	global count_senderlist
	global user_db
	global passwd_db
	global db_
	
	count = 0
	try:
		con = MySQLdb.connect(host="localhost", user=""+str(user_db)+"", passwd=""+str(passwd_db)+"", db=""+str(db_)+"")
		cur = con.cursor()
		cur.execute('SET NAMES `utf8`')
		cur.execute("SELECT COUNT(id) as count FROM `vk_app_sender_list` WHERE `app_id`='"+str(id_app)+"'")
		result = cur.fetchall()
		for row in result:
			count = row[0]
		
		#con.close()
	except MySQLdb.Error:
		print(db.error())
	count_ = count_ + count
	count_senderlist = count
	sleep(1.0)

def finish(progress, id_field):
	global title_file
	global user_db
	global passwd_db
	global db_
	
	try:
		con = MySQLdb.connect(host="localhost", user=""+str(user_db)+"", passwd=""+str(passwd_db)+"", db=""+str(db_)+"")
		cur = con.cursor()
		cur.execute('SET NAMES `utf8`')
		if progress != 100:
			cur.execute("UPDATE `vk_app_export` SET `file`='"+str(title_file)+"', `progress`='"+str(progress)+"' WHERE `hash`='"+str(hash_db)+"' AND `id_app`='"+str(id_field)+"' AND `status`='0'")
		else:
			cur.execute("UPDATE `vk_app_export` SET `file`='"+str(title_file)+"', `progress`='"+str(progress)+"', `status`='1' WHERE `hash`='"+str(hash_db)+"' AND `id_app`='"+str(id_field)+"' AND `status`='0'")
		#con.close()
	except MySQLdb.Error:
		print(db.error())
	sleep(1.0)

def export_visits_logs(data_app, id_app):
    global count_
    global count_users_logs
    global sCurrent
    global title_file
    
    global user_db
    global passwd_db
    global db_
    
    my_file = open('/var/www/kykyiiikuh/data/www/ploader.ru/vkapp/sender/uploads/export/'+title_file, 'w')
    
    sFinish = count_
    sFinish_ = count_users_logs
    sCurrent_ = 0
    
    try:
        con = MySQLdb.connect(host="localhost", user=""+str(user_db)+"", passwd=""+str(passwd_db)+"", db=""+str(db_)+"")
        cur = con.cursor()
        cur.execute('SET NAMES `utf8`')
        cur.execute('SELECT * FROM `vk_app_all_visits_logs` WHERE `id_app`="'+str(id_app)+'" ORDER BY `id` ASC')
        result = cur.fetchall()
        for row in result:
            sCurrent = sCurrent + 1
            sCurrent_ = sCurrent_ + 1
            
            id = row[0]
            hash = row[1]
            app_id = row[2]
            name = row[3]
            id_vk = row[4]
            datetime = row[5]
            
            data_app += "[users_visits_logs]:["+str(id) + "]:[" + str(hash) + "]:[" + str(app_id) + "]:[" + str(name) + "]:[" + str(id_vk) + "]:[" + str(datetime) + "]\r\n"
            
            result_procent = (100 * sCurrent / sFinish)
            result_procent2 = (100 * sCurrent_ / sFinish_)
            
            finish(result_procent, id_app)
            
            print "User Visit Logs List Export Progress: "+ str(result_procent) + "%"
            
            if int(result_procent2) == 100:
                countListExport()
                sleep(1.0)
                load_list_export()
                my_file.write(data_app)
    except MySQLdb.Error:
        print(db.error())

def export_sender_list(data_app, id_app):
	global count_
	global count_senderlist
	global sCurrent
	global title_file
	
	global user_db
	global passwd_db
	global db_
	
	my_file = open('/var/www/kykyiiikuh/data/www/ploader.ru/vkapp/sender/uploads/export/'+title_file, 'w')
	
	sFinish = count_
	sFinish_ = count_senderlist
	sCurrent_ = 0
	
	try:
		con = MySQLdb.connect(host="localhost", user=""+str(user_db)+"", passwd=""+str(passwd_db)+"", db=""+str(db_)+"")
		cur = con.cursor()
		cur.execute('SET NAMES `utf8`')
		cur.execute('SELECT * FROM `vk_app_sender_list` WHERE `app_id`="'+str(id_app)+'" ORDER BY `id` ASC')
		result = cur.fetchall()
		for row in result:
			sCurrent = sCurrent + 1
			sCurrent_ = sCurrent_ + 1
			
			id = row[0]
			uid = row[1]
			hash = row[2]
			app_id = row[3]
			message = row[4]
			datetime = row[5]
			type = row[6]
			
			data_app += "[sender_list]:["+str(id) + "]:[" + str(uid) + "]:[" + str(hash) + "]:[" + str(app_id) + "]:[" + str(message) + "]:[" + str(datetime) + "]:[" + str(type) + "]\r\n"
			
			result_procent = (100 * sCurrent / sFinish)
			result_procent2 = (100 * sCurrent_ / sFinish_)
			
			finish(result_procent, id_app)
			
			print "Sender List Export Progress: "+ str(result_procent) + "%"
			
			if int(result_procent2) == 100:
				if count_users_logs != 0:
					export_visits_logs(data_app, id_app)
				else:
					my_file.write(data_app)
			
			sleep(1.0)
	except MySQLdb.Error:
		print(db.error())

def load_list_export():
    
    if count_list_export == 0:
        print "Not Export"
        return
    
    global user_db
    global passwd_db
    global db_
    
    global hash_db
    
    try:
        con = MySQLdb.connect(host="localhost", user=""+str(user_db)+"", passwd=""+str(passwd_db)+"", db=""+str(db_)+"")
        cur = con.cursor()
        cur.execute('SET NAMES `utf8`')
        cur.execute('SELECT `id_app`, `hash` FROM `vk_app_export` WHERE `status`="0";')
        result = cur.fetchall()
        for row in result:
            if count_list_export > 0:
                id_app = row[0]
                hash_db = row[1]
                
                countSenderList(str(id_app))
                sleep(1.0)
                countUserApp(str(id_app))
                sleep(1.0)
                countUserAppLogs(str(id_app))
                sleep(5.0)
                
                print "Start Export APP: " + str(id_app)
                export_user_app(id_app)
            sleep(1.0)
    except MySQLdb.Error:
        print(db.error())
    #con.close()
    sleep(1.0)

def export_user_app(id_app):
    fmt = '%Y%m%d%H%M'
    today = datetimenow(fmt, "")
    
    global user_db
    global passwd_db
    global db_
    
    global count_
    global count_users
    global sCurrent
    global title_file
    sFinish = count_
    sFinish_ = count_users
    sCurrent_ = 0
    name_file = 'exp_'+str(id_app)+'_'+str(today)+'.sender'
    title_file = name_file
    my_file = open('/var/www/kykyiiikuh/data/www/ploader.ru/vkapp/sender/uploads/export/'+name_file, 'w')
    
    data_app_ = ""
    
    try:
        con = MySQLdb.connect(host="localhost", user=""+str(user_db)+"", passwd=""+str(passwd_db)+"", db=""+str(db_)+"")
        cur = con.cursor()
        cur.execute('SET NAMES `utf8`')
        cur.execute('SELECT * FROM `vk_app_all_visits` WHERE `id_app`="'+str(id_app)+'" ORDER BY `id` ASC')
        result = cur.fetchall()
        for row in result:
            sCurrent = sCurrent + 1
            sCurrent_ = sCurrent_ + 1
            
            id = row[0]
            hash = row[1]
            id_app_ = row[2]
            name = row[3]
            id_vk = row[4]
            date = row[5]
            visits = row[6]
            
            data_app_ += "[users]:[" + str(id) + "]:[" + str(hash) + "]:[" + str(id_app_) + "]:[" + str(name) + "]:[" + str(id_vk) + "]:[" + str(date) + "]:[" + str(visits) + "]\r\n"
            
            result_procent = (100 * sCurrent / sFinish)
            result_procent2 = (100 * sCurrent_ / sFinish_)
            
            finish(result_procent, id_app)
            
            print "Users Export Progress: "+ str(result_procent) + "%"
            
            if int(result_procent2) == 100:
                if count_senderlist != 0:
                    export_sender_list(data_app_, id_app)
                else:
                    if count_users_logs != 0:
                        export_visits_logs(data_app_, id_app)
                    else:
                        my_file.write(data_app_)
    except MySQLdb.Error:
        print(db.error())
    sleep(1.0)

countListExport()
sleep(1.0)
load_list_export()
