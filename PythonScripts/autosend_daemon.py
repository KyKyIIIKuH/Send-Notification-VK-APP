#!/usr/bin/python
# -*- coding: utf-8 -*-

import MySQLdb

import cgi, re
import time
import threading
import datetime
import subprocess
import pytz
from config import *
import ast

import sys
reload(sys)
print sys.getdefaultencoding()
sys.setdefaultencoding('utf8')
print sys.getdefaultencoding()

from httplib2 import Http
from urllib import urlencode
import urllib
import hashlib

DBHOST = "localhost"
DBUSER = ""
DBPASS = ""
DBTABLE = ""

sCurrent = 0

query0 = "SET NAMES `utf8`"
query1 = "SELECT * FROM `vk_app_sender_autosend` WHERE `status`='0' ORDER BY `id` ASC;"

cmd = 'sudo /home/control_daemon restart& 2>&1'

url_server = "http://ploader.ru/sender/api/load.html";

print "Script Start"

def computeMD5hash(string):
    m = hashlib.md5()
    m.update(string.encode('utf-8'))
    return m.hexdigest()

def fetch_url(url, params, method):
  params = urllib.urlencode(params)
  if method=="GET":
    f = urllib.urlopen(url+"?"+params)
  else:
    # Usually a POST
    f = urllib.urlopen(url, params)
  return (f.read(), f.code)

def datetimenow(fmt, time):
    if time:
        d = time
        dtz_string = d
    else:
        d = datetime.datetime.now()
        dtz_string = d.strftime(fmt)
    
    d2 = datetime.datetime.strptime(dtz_string, fmt)
    
    today = d2.strftime(fmt)
    return today

def readAutoSend():
    global query0
    global query1
    
    data = []
    
    try:
        con = MySQLdb.connect(host=""+str(DBHOST)+"", user=""+str(DBUSER)+"", passwd=""+str(DBPASS)+"", db=""+str(DBTABLE)+"")
        cur = con.cursor()
        cur.execute(str(query0))
        cur.execute(str(query1))
        result = cur.fetchall()
        for row in result:
            id_ = row[0]
            line_ = row[1]
            hash_ = row[2]
            id_app_ = row[3]
            uid_ = row[4]
            message_ = row[5]
            useruids_ = row[6]
            secret_key_app_ = row[7]
            datetime_ = row[8]
            datetime_start_ = row[9]
            progress_ = row[10]
            category_ = row[11]
            status_ = row[12]
            
            data.append( { 'id': str(id_), 'line': str(line_), 'id_app': str(id_app_), 'message': str(message_), 'datetime_start': str(datetime_start_), 'uid': str(uid_), 'useruids': str(useruids_), 'category': str(category_), 'secret_key_app': str(secret_key_app_) } )
            
        con.close()
    except MySQLdb.Error:
        print(db.error())
    
    return data
    #return sorted(data)

def countUserApp(id_app):
    count_selected = 0
    
    try:
        con = MySQLdb.connect(host=""+str(DBHOST)+"", user=""+str(DBUSER)+"", passwd=""+str(DBPASS)+"", db=""+str(DBTABLE)+"")
        cur = con.cursor()
        cur.execute('SET NAMES `utf8`')
        cur.execute("SELECT COUNT(id) as count FROM `vk_app_all_visits` WHERE `id_app`='"+str(id_app)+"'")
        result = cur.fetchall()
        for row in result:
            count_selected = (row[0])
            
        # con.close()
    except MySQLdb.Error:
        print(db.error())
    
    return count_selected

def onAjaxSuccess():
    global sCurrent
    sPosition = sCurrent + 100
    sCurrent = sPosition

def progress_(progress, id_app_db, id_field):
    today = datetimenow('%Y-%m-%d %H:%M:%S', '')
    
    try:
        con = MySQLdb.connect(host=""+str(DBHOST)+"", user=""+str(DBUSER)+"", passwd=""+str(DBPASS)+"", db=""+str(DBTABLE)+"")
        cur = con.cursor()
        cur.execute('SET NAMES `utf8`')
        
        if int(progress) == 100:
			cur.execute("DELETE FROM `vk_app_sender_autosend` WHERE `id`='"+str(id_field)+"';")
        else:
            cur.execute("UPDATE `vk_app_sender_autosend` SET `datetime`='"+today+"', `progress`='"+str(progress)+"', `status`='1' WHERE `id`='"+str(id_field)+"';")
        con.close()
    except MySQLdb.Error:
        print(db.error())
	sleep(1.0)

class AutoSend(threading.Thread):
    global sCurrent
    
    def __init__(self):
        super(AutoSend, self).__init__()
        self.autosendlist = readAutoSend()
        self.keep_running = True
    
    def run(self):
        global sCurrent
        global cmd
        global url_server
        
        double_run = False
        
        try:
            while self.keep_running:
                now = time.localtime()
                timestamp_now = int(time.time())
                
                self.autosendlist = readAutoSend()
                
                if(self.autosendlist):
                    for row2 in (self.autosendlist):
                        id_ = row2["id"]
                        uid_ = row2["uid"]
                        line_ = row2["line"]
                        id_app_ = row2["id_app"]
                        message_ = row2["message"]
                        datetime_start_ = row2["datetime_start"]
                        secret_key_app_ = row2["secret_key_app"]
                        
                        fmt = '%Y-%m-%d %H:%M:%S'
                        today = datetimenow(fmt, "")
                        today = today.split(" ")
                        today = today[0].split("-")[2]
                        today_edit = datetimenow(fmt, datetime_start_)
                        today_edit = today_edit.split(" ")
                        today_edit = today_edit[0].split("-")[2]
                        
                        timestamp_edit = time.mktime(datetime.datetime.strptime(datetime_start_, fmt).timetuple())
                        timestamp_new = int(timestamp_now) - int(timestamp_edit)
                        
                        import datetime as DT
                        timestamp_new2 = datetime.datetime.fromtimestamp(timestamp_new).strftime("%Y-%m-%d %H:%M:%S")
                        test2 = DT.datetime.strptime(timestamp_new2, '%Y-%m-%d %H:%M:%S')
                        test2 = test2 + datetime.timedelta(hours=-3)
                        hour_l = int(test2.strftime("%H"))
                        min_l = int(test2.strftime("%M"))
                        sec_l = int(test2.strftime("%S"))
                        
                        if int(today_edit) == int(today) and int(hour_l) <= 2 and int(min_l) <= 50 and int(sec_l) <= 59:
                            print "========ACTION PROGRESS=========="
                            print "LINE: " +str(line_)
                            print "ID APP: " +str(id_app_)
                            print "MESSAGE: " +str(message_)
                            print "DateTimeStart: " +str(datetime_start_)
                            
                            sFinish = int(countUserApp(id_app_))
                            
                            if sFinish != 0:
                                while True:
                                    if int(sFinish) < int(sCurrent):
                                        result_procent = 100
                                        progress_(result_procent, id_app_, id_)
                                        print "Finish"
                                        
                                        url = url_server
                                        method = "POST"
                                        params = {
                                            "action": "set_sender_list",
                                            "auth_key": ""+str(computeMD5hash(str(id_app_)+"_"+str(uid_)+"_"+str(secret_key_app_)))+"",
                                            "viewer_id": ""+str(uid_)+"",
                                            "app_id": ""+str(id_app_)+""
                                        }
                                        [content, response_code] = fetch_url(url, params, method)
                                        
                                        time.sleep(5)
                                        subprocess.Popen(['/home/kykyiiikuh/control_daemon', 'restart'],stdin=subprocess.PIPE)
                                        break
                                    else:
                                        result_procent = (100 * sCurrent / sFinish)
                                        
                                        #Valid APP  Key
                                        url = url_server
                                        method = "POST"
                                        params = {
                                            "action": "valid_app_key_",
                                            "auth_key": ""+str(computeMD5hash(str(id_app_)+"_"+str(uid_)+"_"+str(secret_key_app_)))+"",
                                            "viewer_id": ""+str(uid_)+"",
                                            "app_id": ""+str(id_app_)+"",
                                        }
                                        [content, response_code] = fetch_url(url, params, method)
                                        content = ast.literal_eval(content)
                                        #print content
                                        if(int(content["valid_secure_key"]) == 0):
                                            print "Invalid APP Key"
                                            time.sleep(15)
                                            subprocess.Popen(['/home/kykyiiikuh/control_daemon', 'restart'],stdin=subprocess.PIPE)
                                            break
                                        
                                        ##
                                        url = url_server
                                        method = "POST"
                                        params = {
                                            "action": "sender_message",
                                            "auth_key": ""+str(computeMD5hash(str(id_app_)+"_"+str(uid_)+"_"+str(secret_key_app_)))+"",
                                            "viewer_id": ""+str(uid_)+"",
                                            "app_id": ""+str(id_app_)+"",
                                            "userids":"",
                                            "category":"",
                                            "fromid": ""+str(sCurrent)+""
                                        }
                                        [content, response_code] = fetch_url(url, params, method)
                                        content = ast.literal_eval(content)
                                        
                                        print "\n\n\n=================="
                                        print str(content) + " \n || <<<< || \n" + str(response_code)
                                        print "\n"
                                        ##
                                        
                                        onAjaxSuccess()
                                        time.sleep(1)
                                    
                                    progress_(result_procent, id_app_, id_)
                                    
                                    print str(sCurrent)  + " of " + str(sFinish) + " " + str(result_procent)+"%"
                                    print "============================="
                                    print "\n"
                
                time.sleep(1)
        except Exception, e:
            print str(e)
            raise
            # return
    def die(self):
        self.keep_running = False

autosend = AutoSend()

def main():
    try:
        autosend.start()
        print 'Started daemon autosend...'
        while True:
            continue
    except KeyboardInterrupt:
        print '^C received, shutting down daemon autosend.'
        autosend.die()

if __name__ == '__main__':
    main()
