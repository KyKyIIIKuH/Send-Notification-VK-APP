#!/usr/bin/python
# Delete Sender

# -*- coding: utf-8 -*-

import time
import datetime
from time import sleep

import MySQLdb

user_db = ""
passwd_db = ""
db_ = ""

print "Script Start"

def sender_list_load():
    global user_db
    global passwd_db
    global db_
    
    try:
        con = MySQLdb.connect(host="localhost", user=""+str(user_db)+"", passwd=""+str(passwd_db)+"", db=""+str(db_)+"")
        cur = con.cursor()
        cur.execute('SET NAMES `utf8`')
        cur.execute("SELECT `app_id`, `hash` FROM `vk_app_sender_list` ORDER BY `id` DESC;")
        result = cur.fetchall()
        
        for row in result:
            sender_list(row[0])
            sleep(1.0)
        
        #con.close()
    except MySQLdb.Error:
        print(db.error())
    
    sleep(1.0)
	
def sender_list(app_id):
    global user_db
    global passwd_db
    global db_
    
    count = 0
    
    try:
        con = MySQLdb.connect(host="localhost", user=""+str(user_db)+"", passwd=""+str(passwd_db)+"", db=""+str(db_)+"")
        cur = con.cursor()
        cur.execute('SET NAMES `utf8`')
        cur.execute("SELECT `app_id`, `hash` FROM `vk_app_sender_list` WHERE `app_id`='"+str(app_id)+"' ORDER BY `id` DESC;")
        result = cur.fetchall()
        
        for row in result:
            count = count + 1
            
            #print "Select APP ID: " + str(row[0]) + " / COUNT SEND LIST: " + str(count)
            
            if count >= 4:
                delete_sender(row[0], row[1])
                sleep(1.0)
        
		#con.close()
    except MySQLdb.Error:
        print(db.error())
    
    sleep(1.0)

def delete_sender(app_id, hash_):
    try:
        con = MySQLdb.connect(host="localhost", user=""+str(user_db)+"", passwd=""+str(passwd_db)+"", db=""+str(db_)+"")
        cur = con.cursor()
        cur.execute('SET NAMES `utf8`')
        cur.execute("DELETE FROM `vk_app_sender_list` WHERE `app_id`='"+str(app_id)+"' AND `hash`='"+str(hash_)+"';")
        cur.execute("DELETE FROM `vk_app_sender_logs` WHERE `app_id`='"+str(app_id)+"' AND `hash_list`='"+str(hash_)+"';")
        print "Delete sender \r\nID APP: " + str(app_id) + "\r\nHASH: " + str(hash_)
        
        #con.close()
    except MySQLdb.Error:
        print(db.error())

sender_list_load()
