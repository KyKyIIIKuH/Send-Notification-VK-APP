#!/usr/bin/python
# -*- coding: utf-8 -*-

from time import sleep
import MySQLdb
from array import *
import re

from httplib2 import Http
from urllib import urlencode
import urllib
import hashlib
import ast
import time

import logging
now = time.localtime()
logging.basicConfig(filename='/var/www/kykyiiikuh/data/PythonScripts/vkapp/sender/delete_app_'+str(now.tm_mon)+"-"+str(now.tm_mday)+'.log',level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

DBHOST = "localhost"
DBUSER = "vk_app"
DBPASS = "gX3BMHbSp1n4Zvln"
DBTABLE = "vk_app"

url_server = "https://ploader.ru/sender/api/load.html";

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

print "Script Start"
logging.info('Script Start')

def curl(id_app_, uid_, secret_key_app_):
    global url_server
    
    url = url_server
    method = "POST"
    params = {
        "action": "valid_app_social_",
        "auth_key": ""+str(computeMD5hash(str(id_app_)+"_"+str(uid_)+"_"+str(secret_key_app_)))+"",
        "viewer_id": ""+str(uid_)+"",
        "app_id": ""+str(id_app_)+""
    }
    [content, response_code] = fetch_url(url, params, method)
    content = ast.literal_eval(content)
    
    return content

try:
    con = MySQLdb.connect(host=""+str(DBHOST)+"", user=""+str(DBUSER)+"", passwd=""+str(DBPASS)+"", db=""+str(DBTABLE)+"")
    cur = con.cursor()
    cur.execute('SET NAMES `utf8`')
    cur.execute("SELECT * FROM `vk_app_sender_visits`;")
    result = cur.fetchall()
    i__ = 0
    for row in result:
        if(row[5]):
            title_app_ = row[5]
            list_app_ = row[6]
            list_secret_key_ = row[7]
            uid_ = row[13]
            
            title_app_split = title_app_.split("\r\n")
            list_app_split = list_app_.split("\r\n")
            list_secret_key_split = list_secret_key_.split("\r\n")
            
            i_split = -1
            
            for id_app_ in list_app_split:
                i_split = i_split + 1
                
                title_app_array = title_app_split[i_split]
                secret_key_app_ = list_secret_key_split[i_split]
                
                content = curl(id_app_, uid_, secret_key_app_)
                time.sleep(1)
                content = curl(id_app_, uid_, secret_key_app_)
                time.sleep(1)
                content = curl(id_app_, uid_, secret_key_app_)
                print str(content)
                logging.info( str(content) )
                
                if( str('valid_app_social' in content) == "True"):
                    if(int(content["valid_app_social"]) == 0):
                        print " =================="
                        print str(uid_) + "\n\n"
                        print str(title_app_array) + "\n"
                        print id_app_
                        print "\n" + str(secret_key_app_)
                        print "==================="
                        print "\n"
                        
                        logging.info('==================')
                        logging.info( str(uid_) + "\n\n" )
                        logging.info( str(title_app_array) + "\n" )
                        logging.info( str(id_app_) )
                        logging.info( "\n" + str(secret_key_app_) )
                        logging.info('==================')
                        logging.info("\n")
                        
                        url = url_server
                        method = "POST"
                        params = {
                            "action": "delete_app",
                            "auth_key": ""+str(computeMD5hash(str(id_app_)+"_"+str(uid_)+"_"+str(secret_key_app_)))+"",
                            "viewer_id": ""+str(uid_)+"",
                            "app_id": ""+str(id_app_)+""
                        }
                        [content, response_code] = fetch_url(url, params, method)
                        content = ast.literal_eval(content)
                        print "DELETE:\n"
                        logging.info( "DELETE:\n" )
                        print content
                    time.sleep(1)
            time.sleep(1)
    con.close()
    logging.info( "Finish\n" )
except MySQLdb.Error:
    print(db.error())
