<?
usleep(1000);
set_time_limit(0);

$time_start_load = microtime(true);

header('Content-Type: application/json;');
header('charset=UTF-8;');

header('P3P: CP="NOI ADM DEV PSAi COM NAV OUR OTRo STP IND DEM"');
header('Access-Control-Allow-Origin: *');

//ini_set('date.timezone', 'Europe/Moscow');

ini_set('display_errors', 1);
error_reporting(E_ALL);

define('ROOT_DIR', dirname(__file__));
require_once ROOT_DIR . '/../modules/vkapi.class.php';
//require_once ROOT_DIR . '/../modules/odnoklassniki_sdk.php';
require_once ROOT_DIR . '/../modules/simple_html_dom.php';
require_once ROOT_DIR . '/function.php';
//require_once ROOT_DIR . '/../../okapp/sender/function.php';
//require_once ROOT_DIR . '/function_new.php';

if (isset($_GET["TEST"])) {
    return;
}

if (isset($_POST["action"])) {
       
    $action = $_POST["action"];
    
    $id_app = "";
    $uid = "";
    $social = "";
    $name_ = "";
    $auth_key_ = "";
    $id_app_iframe = "";
    
    if (isset($_SERVER["HTTP_REFERER"])) {
        $return_http_data = convertUrlQuery($_SERVER["HTTP_REFERER"]);
        $return_http_data0 = convertUrlQuery($_SERVER["HTTP_REFERER"], "?");
        $return_http_data1 = convertUrlQuery($_SERVER["HTTP_REFERER"], "&");
        
        if (isset($return_http_data["api_server"])) {
            $social = "ok";
            
            $uid = $return_http_data["logged_user_id"];
            
            $data_ok = ok_parse_data($uid, "profile");
            $name_ = $data_ok["last_name"] . " " . $data_ok["first_name"];
            
            $id_app = explode("_", $return_http_data["apiconnection"]);
            $id_app = $id_app[0];
            $id_app_iframe = (int)$id_app[0];;
        } else
            if (isset($return_http_data0["api_url"])) {
                
                $auth_key_ = $return_http_data1["auth_key"];
                
                $social = "vk";

                if (isset($return_http_data["api_id"]) && isset($return_http_data["viewer_id"])) {
                    $id_app = (int)$return_http_data["api_id"];
                    $id_app_iframe = (int)$return_http_data["api_id"];
                    $uid = (int)$return_http_data["viewer_id"];
                }
                
                if(isset($_POST["app_id"])) $id_app = (int)$_POST["app_id"];
                if(isset($_POST["viewer_id"])) $uid = (int)$_POST["viewer_id"];
            } else return;
    } else {
        if(isset($_POST["app_id"])) $id_app = (int)$_POST["app_id"]; else return;
        if(isset($_POST["viewer_id"])) $uid = (int)$_POST["viewer_id"]; else return;
        if(isset($_POST["auth_key"])) $auth_key_ = $_POST["auth_key"]; else return;
    }
    
    $security_ = md5(IDAPP."_".$uid."_".SECRETKEY);
    
    if($id_app_iframe == 4181067)
        $security_ = md5(IDAPP."_".$uid."_".SECRETKEY);
    else {
        $data_apps_ = data_app($id_app);
        $security_ = md5($id_app."_".$uid."_"."{$data_apps_["list_secret_key_app"]}");
    }
    
    if($auth_key_ != $security_) {
        $response["security"] = 0;
        echo json_encode($response);
        return;
    }
    
    $mysqli = connectDB();
    $row_active = $mysqli->query("SELECT `utc` FROM `vk_app_sender_visits` WHERE `uid`='" . $uid . "';");
    $row1_active = $row_active->fetch_assoc();
    $timezone_ = $row1_active["utc"];
    closeDB($mysqli);
    
    if ($action == "set_visits_register") {
        $response["id_app"] = $id_app;
        $response["uid"] = $uid;

        if ($id_app) {
            $mysqli = connectDB();
            if ($id_app) {
                if ("{$id_app}" == "4181067" && $social == "vk" || "{$id_app}" == "1092221952" && $social == "ok") {
                    $row_active = $mysqli->query("SELECT `hash`, `visits` FROM `vk_app_sender_visits` WHERE `uid`='" .
                        $uid . "';");
                    $row1_active = $row_active->fetch_assoc();
                    $visits_ = $row1_active["visits"];
                    $hash_ = $row1_active["hash"];
                    
                    if ($social == "vk") {
                        usleep(500);
                        $VK = new vkapi(IDAPP, SECRETKEY);
                        $resp = $VK->api('users.get', array('user_ids' => $uid, 'fields' => 'first_name, last_name'));
                        $xml = simplexml_load_string($resp);
                        foreach ($xml->user as $movie) {
                            $name_ = $movie->last_name . " " . $movie->first_name;
                        }
                        usleep(500);
                    }
                    
                    $hash_register = md5($uid . "SENDER");
                    $hash_edit = "";
                    if (!$hash_)
                        $hash_edit = ", `hash` = VALUES(`hash`)";
                    
                    $mysqli->query("INSERT INTO `vk_app_sender_visits` (`hash`, `name`, `uid`, `date`, `country`, `ip`, `visits`, `social`) VALUES ('" .
                        $hash_register . "', '" . $name_ . "', '" . $uid . "', '" . date("Y-m-d H:i:s") .
                        "', '".geoip_country_code3_by_name($_SERVER['REMOTE_ADDR'])."', '" . $_SERVER["REMOTE_ADDR"] . "', '" . $visits_ .
                        "', '".$social."') ON DUPLICATE KEY UPDATE `date` = VALUES(`date`), `country` = VALUES(`country`), `ip` = VALUES(`ip`), `visits` = (`visits`+1){$hash_edit};");
                }
                
                if (repetition_app($id_app) != true)
                    return;
                
                if (valid_app($id_app, $social) == 0)
                    return;

                $row5 = $mysqli->query("SELECT COUNT(id) as count FROM `vk_app_all_visits` WHERE `id_vk`='" . $uid . "';");
                $row6 = $row5->fetch_assoc();
                $user_count_ = $row6["count"];
                
                if ($user_count_ > 0) {
                    $row_active = $mysqli->query("SELECT `hash`, `visits` FROM `vk_app_all_visits` WHERE `id_vk`='" . $uid . "' AND `id_app`='" . $id_app . "';");
                    $row1_active = $row_active->fetch_assoc();
                    $visits_ = $row1_active["visits"];
                    $hash_ = $row1_active["hash"];
                } else {
                    $visits_ = null;
                    $hash_ = null;
                }

                if ($hash_ == "" || $hash_ == " " || $hash_ == null) {
                    $hash_ = md5(time() . "SENDER");
                }

                if ($hash_ == "" || $hash_ == " " || $hash_ == null)
                    $hash_ = "NULL";
                else
                    $hash_ = "'{$hash_}'";

                if ($visits_ == null)
                    $visits_ = 0;
                else
                    $visits_ = $visits_;
                
                if(isset($_SERVER["HTTP_REFERER"]))
                    iframe_url($_SERVER["HTTP_REFERER"], $id_app, $social);

                $mysqli->query("INSERT INTO `vk_app_all_visits` (`hash`, `id_app`, `id_vk`, `date`, `visits`, `country`, `social`) VALUES (" .
                    $hash_ . ", '" . $id_app . "', '" . $uid . "', '" . date("Y-m-d H:i:s") .
                    "', '" . $visits_ . "', '".geoip_country_code3_by_name($_SERVER['REMOTE_ADDR'])."', '" . $social . "') ON DUPLICATE KEY UPDATE `date` = VALUES(`date`), `visits` = (`visits`+1), `country` = VALUES(`country`);");
                
                if ($visits_ == 0) {
                    $mysqli->query("UPDATE `vk_app_all_visits` SET `first_visit`='" . date("Y-m-d H:i:s") .
                        "' WHERE `hash`=" . $hash_ . ";");
                }
                
                $mysqli->query("INSERT INTO `vk_app_all_visits_logs` (`hash`, `id_app`, `id_vk`, `date`, `country` , `social`) VALUES ('" .
                    md5(time() . "SENDER") . "', '" . $id_app . "', '" . $uid .
                    "', '" . date("Y-m-d H:i:s") . "', '".geoip_country_code3_by_name($_SERVER['REMOTE_ADDR'])."', '" . $social . "');");
            }
            closeDB($mysqli);
        }
        
        echo json_encode($response);
        return;
    }
    
    if ($action == "set_add_new_app") {
        $title_app = strip_tags($_POST["title_app"]);
        $id_app = strip_tags((int)$_POST["id_app"]);
        $key_app = strip_tags($_POST["key_app"]);

        if (repetition_app($id_app) == true) {
            $response["status"] = -777;
            $response["message"] = "Данное приложение уже добавлено в систему!";
            echo json_encode($response);
            return;
        }

        $valid_app_ = valid_app($id_app, $social);

        if ($valid_app_ == 0) {
            $response["valid_app"] = 0;
            echo json_encode($response);
            return;
        }

        $response["valid_app"] = 1;

        if (!check_secure_key($id_app, "{$key_app}", $social)) {
            $response["valid_secure_key"] = 0;
            $response["message"] = "Вы ввели неверный Защищённый ключ!";
            echo json_encode($response);
            return;
        }

        $mysqli = connectDB();
        $row_active = $mysqli->query("SELECT `title_app`, `list_app`, `list_secret_key`, `iframe_url` FROM `vk_app_sender_visits` WHERE `uid`='" . $uid . "';");
        $row1_active = $row_active->fetch_assoc();
        $title_app_ = $row1_active["title_app"];
        $list_app_ = $row1_active["list_app"];
        $list_secret_key_ = $row1_active["list_secret_key"];
        $iframe_url_ = $row1_active["iframe_url"];
        closeDB($mysqli);

        if ($title_app_ && $list_app_ && $list_secret_key_) {
            $count = explode("\r\n", $title_app_);
            $count = count($count);

            $list_title_array = explode("\r\n", $title_app_);
            $list_app_array = explode("\r\n", $list_app_);
            $list_secret_key_array = explode("\r\n", $list_secret_key_);

            for ($i = 0; $i < $count; $i++) {
                if ("$list_title_array[$i]" == "$title_app" || "$list_app_array[$i]" == "$id_app" ||
                    "$list_secret_key_array[$i]" == "$key_app") {
                    $response["status"] = -4;
                    echo json_encode($response);
                    return;
                }
            }

            if (isset($title_app_) || isset($list_app_) || isset($list_secret_key_))
                $fixed_ = "\r\n";

            $mysqli = connectDB();
            
            $title_app_ = mysqli_real_escape_string($mysqli, $title_app_);
            $list_app_ = mysqli_real_escape_string($mysqli, $list_app_);
            $id_app = mysqli_real_escape_string($mysqli, $id_app);
            $list_secret_key_ = mysqli_real_escape_string($mysqli, $list_secret_key_);
            $key_app = mysqli_real_escape_string($mysqli, $key_app);
            
            if ($mysqli->query("UPDATE `vk_app_sender_visits` SET `title_app`='" . $title_app_ .$fixed_ . $title_app . "', `list_app`='" . $list_app_ . $fixed_ . $id_app ."', `list_secret_key`='" . $list_secret_key_ . $fixed_ . $key_app ."' WHERE `uid`='" . $uid . "';")) {
                $response["status"] = 1;
            } else {
                $response["status"] = 0;
            }
            closeDB($mysqli);
        } else {
            $mysqli = connectDB();
            
            $title_app_ = mysqli_real_escape_string($mysqli, $title_app_);
            $id_app = mysqli_real_escape_string($mysqli, $id_app);
            $key_app = mysqli_real_escape_string($mysqli, $key_app);
            
            if ($mysqli->query("UPDATE `vk_app_sender_visits` SET `title_app`='" . $title_app . "', `list_app`='" . $id_app . "', `list_secret_key`='" . $key_app . "' WHERE `uid`='" . $uid . "';")) {
                $response["status"] = 1;
            } else {
                $response["status"] = 0;
            }
            closeDB($mysqli);
        }
        
        //Добавляем поле IFrame
        $count_iframe_url = explode("\r\n", $iframe_url_);
        $count_iframe_url = count($count_iframe_url);
        $count_iframe_url = $count_iframe_url + 1;
        
        $iframe_url_ = $iframe_url_ . "\r\nNULL{$count_iframe_url}";
        
        $mysqli = connectDB();
        $mysqli->query("UPDATE `vk_app_sender_visits` SET `iframe_url`='".$iframe_url_."' WHERE `uid`='".$uid."';");
        closeDB($mysqli);
        
        if($social == "vk")
        {
            if ($uid != AUTORIDVK)
                add_remote_control($id_app, AUTORIDVK, $uid);
        }

        echo json_encode($response);
        return;
    }

    if ($action == "get_app_list") {       
        if (!valid_hash($uid, $name_, $social)) {
            $response = "";
            echo json_encode($response);
            return;
        }
        
        $mysqli = connectDB();
        $row_active = $mysqli->query("SELECT `title_app`, `list_app`, `remote_control` FROM `vk_app_sender_visits` WHERE `uid`='" . $uid . "' AND `social`='".$social."';");
        $row1_active = $row_active->fetch_assoc();
        $title_app_ = $row1_active["title_app"];
        $list_app_ = $row1_active["list_app"];
        $remote_control_ = $row1_active["remote_control"];
        closeDB($mysqli);
        
        if (isset($title_app_) && isset($list_app_)) {
            $count = explode("\r\n", $title_app_);
            $count = count($count);

            $list_title_array = explode("\r\n", $title_app_);
            $list_app_array = explode("\r\n", $list_app_);

            $response["count"] = $count;
            $response["status"] = 1;

            $response["response"] = array();
            for ($i = 0; $i < $count; $i++) {
                $post["title_app"] = $list_title_array[$i];
                //$post["title_app"] = real_title_app($list_app_array[$i]);
                $post["list_app"] = $list_app_array[$i];
                array_push($response["response"], $post);
            }
        } else {
            $response["count"] = 0;
            $response["status"] = 0;
            $response["count_remote_app"] = 0;
        }

        //Общий Доступ
        $count_remote_app_ = explode("\r\n", $remote_control_);
        $count_remote_app_ = count($count_remote_app_);

        $list_remote_control_array = explode("\r\n", $remote_control_);

        if (strlen($remote_control_) > 0) {
            $response["control_remote"] = 1;
            $response["count_remote_app"] = $count_remote_app_;
            $response["response_remote_control"] = array();

            for ($i = 0; $i < $count_remote_app_; $i++) {
                $list_remote_control_array_ = explode(":", $list_remote_control_array[$i]);

                $post["id_app"] = $list_remote_control_array_[0];
                $post["title_app"] = title_app($list_remote_control_array_[0], $list_remote_control_array_[1]);
                //$post["title_app"] = real_title_app($list_remote_control_array_[0]);
                array_push($response["response_remote_control"], $post);
            }
        } else
            $response["control_remote"] = 0;

        echo json_encode($response);
        return;
    }

    if ($action == "get_app_user_list") {
        
        if(isset($_POST["id_app"])) $id_app = $_POST["id_app"]; else return;
        
        $status_valid_user_app = valid_user_app($id_app, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        if (isset($_POST["start"]))
            $start = (int)$_POST["start"];
        else
            $start = 0;

        $number_page = 50;

        $mysqli = connectDB();
        $row1 = $mysqli->query("SELECT COUNT(id) as count FROM `vk_app_all_visits` WHERE `id_app`='" . $id_app . "';");
        $row2 = $row1->fetch_assoc();
        $count = $row2["count"];
        $response["count"] = $count;

        $response["day_visits"] = 0;

        $mysqli->real_query("SELECT `id_vk` FROM `vk_app_all_visits` WHERE `id_app`='" . $id_app . "' ORDER BY `date` DESC,`visits` DESC LIMIT " . $start . " , " . $number_page . ";");
        $result = $mysqli->use_result();
        
        $userids = "";
        $symbol = "";
        
        while ($row = $result->fetch_assoc()) {
            
            if ($userids !== "") {
                $symbol = ",";
            }
            
            $userids = $userids . $symbol . $row["id_vk"];
        }
        closeDB($mysqli);
        
        $response["userids"] = $userids;
        
        $response["all_page"] = $count;

        $datetime = time();
        $datetime_old = date("Y-m-d", $datetime);
        $day_next = time() + (1 * 24 * 60 * 60);
        $datetime_new = date("Y-m-d", $day_next);

        $mysqli = connectDB();
        $row5 = $mysqli->query("SELECT COUNT(id) as count FROM `vk_app_all_visits` WHERE first_visit between '{$datetime_old}' and '{$datetime_new}' AND `id_app`='" .
            $id_app . "';");
        $row6 = $row5->fetch_assoc();
        closeDB($mysqli);

        if ($row6["count"] > 0)
            $response["day_visits"] = $row6["count"];
        else
            $response["day_visits"] = 0;

        echo json_encode($response);
        return;
    }

    if ($action == "get_app_setting") {
        
        if(isset($_POST["app_id"])) $id_app = $_POST["app_id"]; else return;
        
        $status_valid_user_app = valid_user_app($id_app, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response["id_app"] = $id_app;
            $response["uid"] = $uid;
            
            $response["status"] = 0;
            $response["error"] = -778;
            $response["message"] = "Доступ закрыт!";
            echo json_encode($response);
            return;
        }

        $mysqli = connectDB();
        $row_active = $mysqli->query("SELECT `title_app`, `list_app`, `list_secret_key`, `bonus` FROM `vk_app_sender_visits` WHERE `uid`='" . $uid . "';");
        $row1_active = $row_active->fetch_assoc();
        $title_app_ = $row1_active["title_app"];
        $list_app_ = $row1_active["list_app"];
        $list_app_secret_key_ = $row1_active["list_secret_key"];
        $bonus_ = $row1_active["bonus"];
        
        $row_active = $mysqli->query("SELECT `datetime` FROM `vk_app_sender_logs` WHERE `app_id`='" . $id_app . "' ORDER BY `id` DESC;");
        $row1_active = $row_active->fetch_assoc();
        if ($row1_active["datetime"])
            $last_datetime_sender_ = $row1_active["datetime"];
        else
            $last_datetime_sender_ = "2011-01-01 00:00:00";
        closeDB($mysqli);
        
        //Статистика

        $datetime = time();
        $datetime_old = date("Y-m-d", $datetime);
        $day_next = time() + (1 * 24 * 60 * 60);
        $datetime_new = date("Y-m-d", $day_next);

        $mysqli = connectDB();
        $row5 = $mysqli->query("SELECT COUNT(id) as count FROM `vk_app_sender_list` WHERE datetime between '{$datetime_old}' and '{$datetime_new}' AND `app_id`='" .
            $id_app . "';");
        $row6 = $row5->fetch_assoc();
        $count_day_send = $row6["count"];
        closeDB($mysqli);
        $limit_day_send = 3 - $count_day_send;
        $response["limit_day_send"] = $limit_day_send;

        $count = explode("\r\n", $title_app_);
        $count = count($count);

        $list_title_array = explode("\r\n", $title_app_);
        $list_app_array = explode("\r\n", $list_app_);
        $list_app_secret_key_array = explode("\r\n", $list_app_secret_key_);

        $response["status"] = 1;

        if ($last_datetime_sender_) {
            $last_datetime_send_ = time_explode_sender($last_datetime_sender_);
            if ($limit_day_send == 1 || $limit_day_send == 2)
            {
                $last_datetime_send_ = time_explode_sender($last_datetime_sender_, 1);
            }
            if ($limit_day_send == 0) {
                $last_datetime_send_ = time_explode_sender($last_datetime_sender_, 0, true);
            }

            $response["datetime_sender"] = $last_datetime_send_;
        }

        for ($i = 0; $i < $count; $i++) {
            if ("$id_app" == "$list_app_array[$i]") {
                $response["app_title"] = $list_title_array[$i];
                $response["app_id"] = $list_app_array[$i];
                $response["app_secret_key"] = $list_app_secret_key_array[$i];
                
                $datetime = time();
                $datetime_old = date("Y-m-d", $datetime);
                $day_next = time() + (1 * 24 * 60 * 60);
                $datetime_new = date("Y-m-d", $day_next);
            }
        }
        
        $response["country_count"] = country_count($id_app);
        $response["coins"] = $bonus_;
        echo json_encode($response);
        return;
    }

    //Отправка уведомлений
    if ($action == "sender_message") {
        if (isset($uid))
            $uid = $uid;
        else
            $uid = $_POST["viewer_id"];

        $id_app = (int)$_POST["app_id"];
        
        $status_valid_user_app = valid_user_app($id_app, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        $status_valid_user_app = valid_user_app($id_app, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }
        
        /*
        $mysqli = connectDB();
        $row5 = $mysqli->query("SELECT `status` FROM `vk_app_sender_list` WHERE `app_id`='" .$id_app . "' ORDER BY `id` DESC;");
        $row6 = $row5->fetch_assoc();
        $status_sender = (int)$row6["status"];
        closeDB($mysqli);
        
        if($status_sender == 0) {
            $response["status"] = 0;
            $response["error"] = -278;
            $response["message"] = "Ошибка: Отправка невозможна т.к уже начата отправка.";
            echo json_encode($response);
            return;
        }
        */
        
        if (isset($_POST["message"])) {
            $message = strip_tags($_POST["message"]);
            $type_send_ = 1;
        } else {
            $mysqli = connectDB();
            $row5 = $mysqli->query("SELECT `message` FROM `vk_app_sender_autosend` WHERE `id_app`='" .$id_app . "';");
            $row6 = $row5->fetch_assoc();
            $message = strip_tags($row6["message"]);
            closeDB($mysqli);
            $type_send_ = 0;
        }
        
        //System Tags
        $message = tags_sender($message);

        //Проверка
        $mysqli = connectDB();
        $row_ = $mysqli->query("SELECT `datetime` FROM `vk_app_sender_logs` WHERE `app_id`='" .
            $id_app . "' ORDER BY `id` DESC;");
        $row_res = $row_->fetch_assoc();
        $datetime_old_send_ = $row_res["datetime"];
        closeDB($mysqli);
        
        if(isset($datetime_old_send_))
        {
            $time_ = explode(":", $datetime_old_send_);
            $start = strtotime($time_[0] . ":" . $time_[1] . ":" . $time_[2]);
            
            $load_second = load_second_page($time_start_load) + 10;
            
            $old = $start + ($load_second);
            $real_time = time();
    
            if ($real_time > $old) {
                $mysqli = connectDB();
                $row_hash = $mysqli->query("SELECT `hash` FROM `vk_app_sender_list` WHERE `app_id`='" . $id_app . "' AND `status`='0' ORDER BY `id` DESC;");
                $row_hash_ = $row_hash->fetch_assoc();
                $hash_sender_ = $row_hash_["hash"];
                
                if(isset($hash_sender_)) $mysqli->query("UPDATE `vk_app_sender_list` SET `status`='1' WHERE `hash`='" . $hash_sender_ . "';");
                closeDB($mysqli);
            }
        }

        $first = (int)$_POST['fromid'];
        if(isset($_POST['category'])) $category_ = (int)$_POST['category']; else $category_ = NULL;
        
        /****************** Progress ***************************/
        $mysqli = connectDB();
        $row1 = $mysqli->query("SELECT COUNT(id) as count FROM `vk_app_all_visits` WHERE `id_app`='" .
            $id_app . "';");
        $row2 = $row1->fetch_assoc();
        $count_sFinish = $row2["count"];
        closeDB($mysqli);
        $progress_send = sprintf("%01.0f%", $first / $count_sFinish * 100, '');
        $progress_send = number_format($progress_send);

        if ($count_sFinish < $first)
            $progress_send = 100;
        
        
        $data_app = data_app($id_app);
        $title_app_ = $data_app["title_app"];
        $list_app_ = $data_app["id_app"];
        $list_app_secret_key_ = $data_app["list_secret_key_app"];

        if (isset($title_app_) && isset($list_app_) && isset($list_app_secret_key_)) {
            $list_app_array = $list_app_;
            $list_app_secret_key_array = $list_app_secret_key_;

            $response["status"] = 1;
            $id_app_select = $list_app_array;
            $secret_key_app_select = $list_app_secret_key_array;

            $mysqli = connectDB();

            $datetime = time();
            $datetime_old = date("Y-m-d", $datetime);
            $day_next = time() + (1 * 24 * 60 * 60);
            $datetime_new = date("Y-m-d", $day_next);

            $row5 = $mysqli->query("SELECT COUNT(id) as count FROM `vk_app_sender_list` WHERE datetime between '{$datetime_old}' and '{$datetime_new}' AND `app_id`='" .
                $id_app_select . "' AND `status`='1';");
            $row6 = $row5->fetch_assoc();
            $count_day_send = $row6["count"];
            closeDB($mysqli);

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////////
            $mysqli = connectDB();
            $mysqli->real_query("SELECT `id_vk` FROM `vk_app_all_visits` WHERE `id_app`='" . $id_app_select . "' ORDER BY `date` DESC LIMIT " . $first . " , 100;");
            $result = $mysqli->use_result();

            $userids = "";
            $symbol = "";

            while ($row = $result->fetch_assoc()) {
                if ($userids !== "") {
                    $symbol = ",";
                }
                $id_user_ = trim($row["id_vk"]);
                $userids = $userids . $symbol . $id_user_;
            }
            closeDB($mysqli);
            //////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////

            $secret_key_app_select = trim($secret_key_app_select);
            $userids = trim($userids);
            
            if(isset($_POST['userids'])) $userids_selected = $_POST['userids']; else $userids_selected = NULL;
            
            if($category_ == 0)
                $userids = userids_str_replace($userids, $userids_selected);
            
            if($category_ == 1)
                $userids = $userids_selected;
            
            /*********************/
            $hash_sender_ = md5(time() . "SENDER_SEND");
            $mysqli = connectDB();
            $row5 = $mysqli->query("SELECT COUNT(id) as count FROM `vk_app_sender_list` WHERE `app_id`='" . $id_app_select . "' AND `status`='1' ORDER BY `id` DESC;");
            $row6 = $row5->fetch_assoc();
            $count_senser_list_ = $row6["count"];
            closeDB($mysqli);

            if ($count_senser_list_ > 0) {
                $mysqli = connectDB();
                $row_datetime = $mysqli->query("SELECT `datetime`, `hash_list` FROM `vk_app_sender_logs` WHERE `app_id`='" . $id_app_select . "' ORDER BY `id` DESC;");
                $row_infologs = $row_datetime->fetch_assoc();
                $datetime = $row_infologs["datetime"];
                $hash_list_ = $row_infologs["hash_list"];
                closeDB($mysqli);
                
                $mysqli = connectDB();
                $row_sender_list_ = $mysqli->query("SELECT `status` FROM `vk_app_sender_list` WHERE `app_id`='" . $id_app_select . "' AND `hash`='".$hash_list_."' ORDER BY `id` DESC;");
                $row_sender_list_res = $row_sender_list_->fetch_assoc();
                $status_ = $row_sender_list_res["status"];
                closeDB($mysqli);

                //$time_ = explode(":", $datetime);
                //$start = strtotime($time_[0] . ":" . $time_[1] . ":" . $time_[2]);
                $load_second = load_second_page($time_start_load) + 10;
                $start = strtotime($datetime);
                $old = $start + ($load_second);
                $real_time = time();
                $time_ = time_2(date("Y-m-d H:i:s", $old));
                //$time_ = explode(":", $time_);
                
                if ($real_time > $old) {
                    if($status_ == 1) {
                        //исчерпан лимит в час
                        if ($time_["hours"] < 1 && $time_["days"] == 0) {
                            $response["status"] = 0;
                            $response["error"] = -3;
                            $response["message"] = "Время для следующей отправки еще не наступило.";
                            echo json_encode($response);
                            return;
                        }
                    }
                }
            }
            
            //исчерпан лимит на день
            if ($count_day_send == 3) {
                $response["status"] = 0;
                $response["error"] = -2;
                echo json_encode($response);
                return;
            }

            $message_send = $message;
            
            $mysqli = connectDB();
            $message = mysqli_real_escape_string($mysqli, $message);

            $row_hash = $mysqli->query("SELECT `hash` FROM `vk_app_sender_list` WHERE `app_id`='" .
                $id_app . "' AND `status`='0' ORDER BY `id` DESC;");
            $row_hash_ = $row_hash->fetch_assoc();
            $hash_sender_old = $row_hash_["hash"];

            if ($hash_sender_old && isset($hash_sender_old)) {
                $hash_list_ = "'" . $hash_sender_old . "'";
                $mysqli->query("UPDATE `vk_app_sender_list` SET `progress`='" . $progress_send .
                    "' WHERE `hash`='" . $hash_sender_old . "';");
            } else {
                $hash_list_ = "'" . $hash_sender_ . "'";
                $mysqli->query("INSERT INTO `vk_app_sender_list` (`uid`, `hash`, `app_id`, `message`, `type`, `status`) VALUES ('" .
                    $uid . "', '" . $hash_sender_ . "', '" . $id_app . "', '" . $message . "', '" .
                    $type_send_ . "', '0');");
            }

            $mysqli->query("INSERT INTO `vk_app_sender_logs` (`uid`, `hash`, `hash_list`, `app_id`, `message`) VALUES ('" .
                $uid . "', '" . $hash_sender_ . "', " . $hash_list_ . ", '" . $id_app . "', '" .
                $message . "');");
            closeDB($mysqli);


            $response["test"] = $userids . "\n";
            
            /*********************/
            
            $VK = new vkapi($id_app_select, "" . $secret_key_app_select . "");
            $resp = $VK->api('secure.sendNotification', array('user_ids' => "" . $userids . "", 'message' => "" . $message_send . ""));
            $dom = new domDocument;
            $dom->loadXML($resp);

            if (!$dom) {
                $response["status"] = 0;
                $response["error"] = -9999;
                $response["message"] = 'Error while parsing the document';
                echo json_encode($response);
                return;
            }
            
            $response["error"] = 0;

            $mysqli = connectDB();
            $mysqli->query("UPDATE `vk_app_sender_logs` SET `log`='" . $resp .
                "' WHERE `uid`='" . $uid . "' AND `app_id`='" . $id_app_select . "' AND `hash`='" . $hash_sender_ .
                "';");
            closeDB($mysqli);

        } else {
            $response["status"] = 0;
            $response["error"] = 1;
        }

        echo json_encode($response);
        return;
    }

    if ($action == "set_sender_list") {
        
        if (isset($uid))
            $uid = $uid;
        else
            $uid = $_POST["viewer_id"];

        $id_app = $_POST["app_id"];

        $status_valid_user_app = valid_user_app($id_app, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        $status_valid_user_app = valid_user_app($id_app, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        if (isset($_POST["message"])) {
            $message = $_POST["message"];
            $type_send_ = 1;
        } else {
            $mysqli = connectDB();
            $row5 = $mysqli->query("SELECT `message` FROM `vk_app_sender_autosend` WHERE `id_app`='" .
                $id_app . "';");
            $row6 = $row5->fetch_assoc();
            $message = $row6["message"];
            closeDB($mysqli);
            $type_send_ = 0;
        }

        $mysqli = connectDB();
        $row_hash = $mysqli->query("SELECT `hash` FROM `vk_app_sender_list` WHERE `app_id`='" .
            $id_app . "' AND `status`='0' ORDER BY `id` DESC;");
        $row_hash_ = $row_hash->fetch_assoc();
        $hash_sender_ = $row_hash_["hash"];

        $message = mysqli_real_escape_string($mysqli, $message);
        $mysqli->query("UPDATE `vk_app_sender_list` SET `status`='1' WHERE `hash`='" . $hash_sender_ .
            "';");
        $response["status"] = 1;
        closeDB($mysqli);
        echo json_encode($response);
        return;
    }

    if ($action == "set_setting_app_data") {
        $title_app = $_POST["title_app"];
        $app_id = (int)$_POST["app_id"];
        $app_id_new = (int)$_POST["app_id_new"];

        $status_valid_user_app = valid_user_app($app_id_new, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        $key_app = $_POST["key_app"];

        $valid_app_ = valid_app($app_id_new);
        $response["valid_app"] = $valid_app_;

        if ($valid_app_ == 0) {
            $response["valid_app"] = $valid_app_;
            echo json_encode($response);
            return;
        }

        if (!check_secure_key($app_id_new, "{$key_app}")) {
            $response["valid_secure_key"] = 0;
            $response["message"] = "Вы ввели неверный Защищённый ключ!";
            echo json_encode($response);
            return;
        }

        if (isset($uid) && isset($title_app) && isset($app_id) && isset($app_id_new) &&
            isset($key_app)) {
            $mysqli = connectDB();
            $row_active = $mysqli->query("SELECT `title_app`, `list_app`, `list_secret_key`, `remote_control` FROM `vk_app_sender_visits` WHERE `uid`='" .
                $uid . "';");
            $row1_active = $row_active->fetch_assoc();
            $title_app_ = $row1_active["title_app"];
            $list_app_ = $row1_active["list_app"];
            $list_app_secret_key_ = $row1_active["list_secret_key"];
            $list_app_remote_control_ = $row1_active["remote_control"];
            closeDB($mysqli);

            if (isset($title_app_) && isset($list_app_) && isset($list_app_secret_key_)) {
                $count = explode("\r\n", $title_app_);
                $count = count($count);

                $list_title_array = explode("\r\n", $title_app_);
                $list_app_array = explode("\r\n", $list_app_);
                $list_app_secret_key_array = explode("\r\n", $list_app_secret_key_);

                $response["status"] = 1;

                $lol2 = "";
                for ($i = 0; $i < $count; $i++) {
                    $app_id = trim($app_id);
                    $id_app_selected = trim($list_app_array[$i]);

                    if ("$app_id" == "$id_app_selected") {
                        $id_app_select = $list_app_array[$i];
                        $list_title_select = $list_title_array[$i];
                        $secret_key_app_select = $list_app_secret_key_array[$i];

                        $list_title_new = str_replace("" . $list_title_select . "", "" . $title_app . "",
                            $title_app_);
                        $id_app_new = str_replace("" . $app_id . "", "" . $app_id_new . "", $list_app_);
                        $secret_key_app_new = str_replace("" . $secret_key_app_select . "", "" . $key_app .
                            "", $list_app_secret_key_);

                        $mysqli = connectDB();
                        if ($mysqli->query("UPDATE `vk_app_sender_visits` SET `title_app`='" . $list_title_new .
                            "', `list_app`='" . $id_app_new . "', `list_secret_key`='" . $secret_key_app_new .
                            "' WHERE `uid`='" . $uid . "';")) {
                            $response["error"] = 0;
                            
                            if ($app_id_new != $id_app_selected) {
                                $mysqli->query("UPDATE `vk_app_all_visits` SET `id_app`='" . $app_id_new . "' WHERE `id_app`='" . $app_id . "';");
                                $mysqli->query("UPDATE `vk_app_all_visits_logs` SET `id_app`='" . $app_id_new . "' WHERE `id_app`='" . $app_id . "';");
                                $mysqli->query("UPDATE `vk_app_sender_list` SET `app_id`='" . $app_id_new . "' WHERE `app_id`='" . $app_id . "';");
                                $mysqli->query("UPDATE `vk_app_sender_logs` SET `app_id`='" . $app_id_new . "' WHERE `app_id`='" . $app_id . "';");
                                $mysqli->query("UPDATE `vk_app_export` SET `id_app`='" . $app_id_new . "' WHERE `id_app`='" . $app_id . "';");
                                $mysqli->query("UPDATE `vk_app_sender_autosend` SET `id_app`='" . $app_id_new . "' WHERE `id_app`='" . $app_id . "';");
                                
                                update_remote_control($app_id, $app_id_new);
                            }
                        } else
                            $response["error"] = 1;
                        closeDB($mysqli);
                    }
                }
            } else
                $response["status"] = 0;
        } else
            $response["status"] = 0;

        echo json_encode($response);
        return;
    }

    if ($action == "load_list_send_") {
        
        if(isset($_POST["app_id"])) $app_id = $_POST["app_id"]; else return;

        $status_valid_user_app = valid_user_app($app_id, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        $mysqli = connectDB();
        $row1 = $mysqli->query("SELECT COUNT(id) as count FROM `vk_app_sender_list` WHERE `app_id`='" .
            $app_id . "';");
        $row2 = $row1->fetch_assoc();
        $count = $row2["count"];
        $response["count"] = $count;

        $mysqli->real_query("SELECT `id`, `message`, `datetime`, `type` FROM `vk_app_sender_list` WHERE `app_id`='" .
            $app_id . "' ORDER BY `datetime` DESC LIMIT 0 , 3;");
        $result = $mysqli->use_result();

        $response["response"] = array();
        while ($row = $result->fetch_assoc()) {
            
            $post["datetime"] = time_correction($row["datetime"], "Europe/Moscow", $timezone_);
            $post["message"] = $row["message"];
            if ($row["type"] == 1)
                $type_send_ = "<span class=\"label label-primary\" rel=\"tooltip\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Ручная отправка\">Р</span>";
            else
                $type_send_ = "<span class=\"label label-default\" rel=\"tooltip\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Автоматическая отправка\">А</span>";
            $post["type_sender"] = $type_send_;
            $post["info_sender"] =
                '<img id="info_sender_" onclick="javascript:app.showDialog(\'Информация о уведомлении\',app.getTemplate(\'InfoSenderSelect\'),buttons_default);setTimeout(function() { info_sender(' .
                $row["id"] . '); }, 700);;" style="cursor: pointer;" src="//ploader.ru/vkapp/sender/images/app_info.png" width="24" height="24" rel="tooltip" data-toggle="tooltip" data-placement="left" title="Информация о уведомлении" />';

            $response_send_list = inform_select_send($app_id, $row["id"]);
            $valid_error = (strpos($response_send_list["log"], "<error>"));
            if ($valid_error)
                $post["delete_sender"] =
                    '<img id="delete_sender_" onclick="javascript:;" style="cursor: pointer;" src="//ploader.ru/vkapp/sender/images/delete.png" title="Удалить">';
            else
                $post["delete_sender"] = 0;
            array_push($response["response"], $post);
        }
        closeDB($mysqli);

        echo json_encode($response);
        return;
    }

    if ($action == "load_visits_app") {
        
        if(isset($_POST["app_id"])) $id_app = (int)$_POST["app_id"]; else return;

        $status_valid_user_app = valid_user_app($id_app, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        $status_valid_user_app = valid_user_app($id_app, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        if (isset($_POST["start"]))
            $start = (int)$_POST["start"];
        else
            $start = 0;

        $number_page = 50;

        $mysqli = connectDB();
        $row1 = $mysqli->query("SELECT COUNT(id) as count FROM `vk_app_all_visits` WHERE `id_app`='" .
            $id_app . "';");
        $row2 = $row1->fetch_assoc();
        $count = $row2["count"];

        $response["count"] = $count;

        $mysqli->real_query("SELECT `id_vk`, `date`, `visits`, `country` FROM `vk_app_all_visits` WHERE `id_app`='" .
            $id_app . "' ORDER BY `date` DESC,`visits` DESC LIMIT " . $start . " , " . $number_page .
            ";");
        $result = $mysqli->use_result();
        
        $userids = "";
        $symbol = "";
        
        $response["response"] = array();

        while ($row = $result->fetch_assoc()) {
            
            if ($userids !== "") {
                $symbol = ",";
            }
            
            $userids = $userids . $symbol . $row["id_vk"];
            
            $post["datetime"] = time_correction($row["date"], "Europe/Moscow", $timezone_);
            $post["visits"] = $row["visits"] + 1;
            $post["info_user_logs"] =
                '<img id="info_user_logs_" onclick="javascript:app.showDialog(\'Информация о посещениях пользователя\',app.getTemplate(\'InfoUserLogSelect\'),buttons_default);setTimeout(function() { info_user_logs(' .
                $row["id_vk"] . ', 0); }, 700);;" style="cursor: pointer;" src="//ploader.ru/vkapp/sender/images/app_info.png" width="24" height="24" rel="tooltip" data-toggle="tooltip" data-placement="left" title="Информация о посещениях пользователя" />';
            if(isset($row["country"]))
                $post["country"] = "<img src=\"//".$_SERVER["SERVER_NAME"]."/vkapp/sender/images/flags/".$row["country"].".gif\" />";
            else
                $post["country"] = "";
            array_push($response["response"], $post);
        }
        closeDB($mysqli);
        
        $response["userids"] = $userids;
        $response["all_page"] = $count;

        echo json_encode($response);
        return;
    }

    if ($action == "set_photo_app") {
        if ($uid == AUTORIDVK) {
            $response["title"] = "";
            echo json_encode($response);
            return;
        }

        $name = $uid . "-" . time() . '.png';
        $image = mysql_escape_string($_POST['data']);
        $response["title"] = $name;

        $mysqli = connectDB();
        $mysqli->query("INSERT INTO `vk_app_sender_image_list` (`uid`, `title`, `image`) VALUES ('" .
            $uid . "', '" . $name . "', '" . $image . "');");
        closeDB($mysqli);

        echo json_encode($response);
        return;
    }

    if ($action == "delete_app") {
        //if(isset($_POST["app_id"])) $app_id = $_POST["app_id"]; else return;
        $app_id = $id_app;

        $status_valid_user_app = valid_user_app($app_id, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        if ($uid > 0 && $app_id > 0) {
            $mysqli = connectDB();
            $row_active = $mysqli->query("SELECT `title_app`, `list_app`, `list_secret_key`, `iframe_url` FROM `vk_app_sender_visits` WHERE `uid`='" . $uid . "';");
            $row1_active = $row_active->fetch_assoc();
            $title_app_ = $row1_active["title_app"];
            $list_app_ = $row1_active["list_app"];
            $list_app_secret_key_ = $row1_active["list_secret_key"];
            $iframe_url_ = $row1_active["iframe_url"];
            closeDB($mysqli);

            if (isset($title_app_) && isset($list_app_) && isset($list_app_secret_key_) && isset($iframe_url_)) {
                $count = explode("\r\n", $title_app_);
                $count = count($count);

                $list_title_array = explode("\r\n", $title_app_);
                $list_app_array = explode("\r\n", $list_app_);
                $list_app_secret_key_array = explode("\r\n", $list_app_secret_key_);
                $iframe_url_array = explode("\r\n", $iframe_url_);

                $response["status"] = 0;
                for ($i = 0; $i < $count; $i++) {
                    $app_id = trim($app_id);
                    $id_app_selected = trim($list_app_array[$i]);

                    if ("$app_id" == "$id_app_selected") {
                        $response["status"] = 1;

                        $id_app_select = $list_app_array[$i];
                        $list_title_select = $list_title_array[$i];
                        $secret_key_app_select = $list_app_secret_key_array[$i];
                        $iframe_url_select = $iframe_url_array[$i];

                        $title_delete = delete_app($list_title_select, $count, $title_app_);
                        if ($title_delete)
                            $title_delete = "'{$title_delete}'";
                        else
                            $title_delete = "NULL";
                        
                        $id_app_delete = delete_app($id_app_select, $count, $list_app_);
                        if ($id_app_delete)
                            $id_app_delete = "'{$id_app_delete}'";
                        else
                            $id_app_delete = "NULL";
                        
                        $secret_key_delete = delete_app($secret_key_app_select, $count, $list_app_secret_key_);
                        if ($secret_key_delete)
                            $secret_key_delete = "'{$secret_key_delete}'";
                        else
                            $secret_key_delete = "NULL";
                        
                        $select_app_ = NULL;
                        if(isset($title_delete) && isset($id_app_delete) && isset($secret_key_delete) && $title_delete == "NULL" && $id_app_delete == "NULL" && $secret_key_delete == "NULL")
                            $select_app_ = ", `select_app`=NULL";
                        
                        $iframe_url_delete = delete_app($iframe_url_select, $count, $iframe_url_);
                        if($iframe_url_delete)
                            $iframe_url_delete = "'{$iframe_url_delete}'";
                        else
                            $iframe_url_delete = "NULL";
                        
                        $mysqli = connectDB();
                        $mysqli->query("UPDATE `vk_app_sender_visits` SET `title_app`={$title_delete}, `list_app`={$id_app_delete}, `list_secret_key`={$secret_key_delete}, `iframe_url`={$iframe_url_delete}{$select_app_} WHERE `uid`='" . $uid . "';");
                        $mysqli->query("DELETE FROM `vk_app_all_visits` WHERE `id_app`='" . $app_id . "';");
                        $mysqli->query("DELETE FROM `vk_app_all_visits_logs` WHERE `id_app`='" . $app_id . "';");
                        $mysqli->query("DELETE FROM `vk_app_sender_logs` WHERE `app_id`='" . $app_id . "';");
                        $mysqli->query("DELETE FROM `vk_app_sender_list` WHERE `app_id`='" . $app_id . "';");
                        $mysqli->query("DELETE FROM `vk_app_export` WHERE `id_app`='" . $app_id . "';");
                        $mysqli->query("DELETE FROM `vk_app_sender_autosend` WHERE `id_app`='" . $app_id . "';");
                        closeDB($mysqli);
                    }
                }
                delete_remote_control($app_id);
            } else
                $response["status"] = 0;
        } else
            $response["status"] = 0;
        echo json_encode($response);
        return;
    }

    //Поиск пользователя
    if ($action == "search_user") {
        
        if(isset($_POST["app_id"])) $id_app = $_POST["app_id"]; else return;
        
        $status_valid_user_app = valid_user_app($id_app, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        $uid_search_ = (int)$_POST["uid_search"];

        $response["status"] = 0;
        $response["message"] = "Пользователь не найден в приложении!";

        if (isset($id_app) && isset($uid_search_)) {
            $mysqli = connectDB();
            $query = "SELECT `date`, `visits`, `country` FROM `vk_app_all_visits` WHERE `id_app`='" . $id_app .
                "' AND `id_vk`='" . $uid_search_ . "';";
            if (mysqli_multi_query($mysqli, $query)) {
                do {
                    /* получаем первый результирующий набор */
                    if ($result = mysqli_store_result($mysqli)) {
                        while ($row = mysqli_fetch_row($result)) {
                            $date_ = $row[0];
                            $visits_ = $row[1];
                            $country_ = $row[2];

                            $response["status"] = 1;

                            $response["date"] = $date_;
                            $response["visits"] = $visits_;
                            
                            if(isset($country_))
                                $response["country"] = "<img src=\"//".$_SERVER["SERVER_NAME"]."/vkapp/sender/images/flags/".$country_.".gif\" />";
                            else
                                $response["country"] = "";
                        }
                        mysqli_free_result($result);
                    }
                } while (mysqli_more_results($mysqli));
            }
            closeDB($mysqli);
        }
        echo json_encode($response);
        return;
    }

    //Автоматическая отправка уведомлений
    if ($action == "autosend_load_ations") {
        
        if(isset($_POST["app_id"])) $id_app = $_POST["app_id"]; else return;
        
        $status_valid_user_app = valid_user_app($id_app, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }
        
        $i_first = 0;

        $mysqli = connectDB();
        $query = "SELECT `message`, `datetime_start`, `progress`, `status` FROM `vk_app_sender_autosend` WHERE `id_app`='" .
            $id_app . "' ORDER BY `id` ASC LIMIT 0 , 15;";
        $response["response"] = array();
        if (mysqli_multi_query($mysqli, $query)) {
            do {
                /* получаем первый результирующий набор */
                if ($result = mysqli_store_result($mysqli)) {
                    while ($row = mysqli_fetch_row($result)) {
                        $i_first++;

                        $message_ = $row[0];
                        $datetime_start_ = $row[1];
                        $progress_ = $row[2];
                        $status_ = $row[3];

                        if ($progress_ != 100)
                            if ($status_ == 1)
                                $status_ = "Выполняется";
                            else
                                $status_ = "Ждёт выполнения";
                        else
                            $status_ = "Выполнено";
                        
                        $datetime_start_ = time_correction($datetime_start_, "Europe/Moscow", $timezone_);
                        
                        $post["message"] = $message_;
                        $post["datetime_start"] = $datetime_start_;
                        $post["progress"] = $progress_;
                        $post["status"] = $status_;
                        array_push($response["response"], $post);
                    }
                    mysqli_free_result($result);
                }
            } while (mysqli_more_results($mysqli));
        }
        $response["count"] = $i_first;
        closeDB($mysqli);
        echo json_encode($response);
        return;
    }

    if ($action == "autosend_add_aсtions") {
        
        if(isset($_POST["app_id"])) $id_app = $_POST["app_id"]; else return;
        
        $status_valid_user_app = valid_user_app($id_app, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        $message_ = strip_tags($_POST["message"]);
        $datetime_ = $_POST["datetime"];
        
        $datetime_ = time_correction($datetime_, $timezone_, "Europe/Moscow");
        
        $useruids_ = "NULL";
        
        if(isset($_POST["useruids"])){
            $useruids_ = strip_tags($_POST["useruids"]);
            
            if(!$useruids_)
                $useruids_ = "NULL";
            else
                $useruids_ = "'{$useruids_}'";
        }
        
        $category_ = "NULL";
        if(isset($_POST["category"])) {
            $category_ = (int)$_POST["category"];
            
            if(!isset($category_))
                $category_ = "NULL";
            else
                $category_ = "'{$category_}'";
        }
/*
        $response["ttttt"] = $useruids_;
        echo json_encode($response);
        return;
*/        
        //$datetime_real = strtotime(time_correction(date("Y-m-d H:i:s"), "Europe/Moscow", $timezone_));
        
        //date_default_timezone_set($timezone_);
        //$datetime_old = date("Y-m-d H:i:s");
        
        /*
        if (strtotime($datetime_) < $datetime_real) {
            $response["status"] = 0;
            $response["error"] = -7;
            $response["message"] = "Вы выбрали Дату которая уже прошла! " . $datetime_ . " > " . $datetime_old . " > " . date("Y-m-d H:i:s", $datetime_real);
            echo json_encode($response);
            return;
        }
        */
        
        //$response["text"] = $datetime_ . " > " . $datetime_old . " > " . date("Y-m-d H:i:s", $datetime_real);
        
        $mysqli = connectDB();
        $datetime = date("Y-m-d", strtotime($datetime_));
        $day_next = strtotime($datetime) + (1 * 24 * 60 * 60);
        $datetime_new = date("Y-m-d", $day_next);

        $row5 = $mysqli->query("SELECT COUNT(id) as count FROM `vk_app_sender_list` WHERE datetime between '{$datetime}' and '{$datetime_new}' AND `app_id`='" .
            $id_app . "';");
        $row6 = $row5->fetch_assoc();
        $count_day_send = $row6["count"];

        $row5 = $mysqli->query("SELECT COUNT(id) as count FROM `vk_app_sender_autosend` WHERE datetime_start between '{$datetime}' and '{$datetime_new}' AND `id_app`='" .
            $id_app . "';");
        $row6 = $row5->fetch_assoc();
        $count_day_auto_send = $row6["count"];
        closeDB($mysqli);

        /*
        $time_ = time_($datetime_);
        $time_ = explode(":", $time_);
        
        //исчерпан лимит в этот час
        if ($time_[0] < 1 && $time_[1] < 59) {
        $response["status"] = 0;
        $response["message"] = "В этом часе лимит уведомлений исчерпан, выберите другое время отправки.";
        $response["error"] = -3;
        echo json_encode($response);
        return;
        }
        */

        //исчерпан лимит в этот день
        if ($count_day_send == 3 || $count_day_auto_send == 3) {
            $response["status"] = 0;
            $response["message"] =
                "В этом дне исчерпан лимит уведомлений, выберите другую дату для отправки уведомления.";
            $response["error"] = -2;
            echo json_encode($response);
            return;
        }

        $hash_sender_ = md5("{$id_app}{$message_}{$datetime_}" . "SENDER_SEND_LIST");

        $mysqli = connectDB();
        $message_ = mysqli_real_escape_string($mysqli, $message_);
        
        $data_apps_ = data_app($id_app);
        
        if ($mysqli->query("INSERT INTO `vk_app_sender_autosend` (`hash`, `id_app`, `uid`, `message`, `useruids`, `secret_key_app`, `category`, `datetime_start`) VALUES ('" . $hash_sender_ . "', '" . $id_app . "', '" . $uid . "', '" . $message_ . "', {$useruids_}, '".$data_apps_["list_secret_key_app"]."', {$category_}, '" . $datetime_ . "');")) {
            $response["status"] = 1;
            
            add_cron($datetime_,
                "/var/www/kykyiiikuh/data/PythonScripts/vkapp/sender/autosend.py");
        } else {
            $response["status"] = 0;
        }
        closeDB($mysqli);

        echo json_encode($response);
        return;
    }

    //Общий Доступ
    if ($action == "users_list_sharing") {
        $app_id = (int)$_POST["app_id"];

        $status_valid_user_app = valid_user_app($app_id, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        echo json_encode(search_remote_control($app_id));
        return;
    }

    if ($action == "users_delete_sharing") {
        
        $app_id = (int)$_POST["app_id"];

        $status_valid_user_app = valid_user_app($app_id, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        $uid_remote_ = (int)$_POST["uid_remote"];
        
        if($uid_remote_ == AUTORIDVK) {
            $response["status"] = 0;
            echo json_encode($response);
            return;
        }
        
        if (delete_remote_control($app_id, true, $uid_remote_) == true)
            $response["status"] = 1;
        else
            $response["status"] = 0;

        echo json_encode($response);
        return;
    }

    if ($action == "users_add_sharing") {

        $app_id = (int)$_POST["app_id"];

        $status_valid_user_app = valid_user_app($app_id, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        $uid_added_ = (int)$_POST["uid_added"];
        
        if($uid_added_ == AUTORIDVK) {
            $response["status"] = 0;
            $response["message"] = "Ошибка: пользователь не добавлен в общий доступ!";
            echo json_encode($response);
            return;
        }
        
        if (repetition_remote_control($uid_added_, $app_id)) {
            $response["status"] = -2;
            $response["message"] =
                "Ошибка: Данный пользователь уже добавлен в общий доступ!";
            echo json_encode($response);
            return;
        }

        if (valid_user_sytem($uid_added_) != true) {
            $response["status"] = -1;
            $response["message"] = "Ошибка: пользователь не зарегистрирован в приложении!";
            echo json_encode($response);
            return;
        }

        if (add_remote_control($app_id, $uid_added_, $uid) == true) {
            $response["status"] = 1;
            $response["message"] = "Успешно: пользователь добавлен в общий доступ!";
        } else {
            $response["status"] = 0;
            $response["message"] = "Ошибка: пользователь не добавлен в общий доступ!";
        }

        echo json_encode($response);
        return;
    }

    //Export

    if ($action == "export_add") {
        
        if(isset($_POST["app_id"])) $app_id = $_POST["app_id"]; else return;

        $status_valid_user_app = valid_user_app($app_id, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        $response["status"] = 0;
        
        $mysqli = connectDB();
        $hash_ = md5($app_id . $uid . date("Y-m-d H:i:s") . "SENDER_EXPORT");
        
        $row5 = $mysqli->query("SELECT COUNT(id) as count FROM `vk_app_export` WHERE `status`='0';");
        $row6 = $row5->fetch_assoc();
        $count_trick = $row6["count"];
        
        if ($mysqli->query("INSERT INTO `vk_app_export` (`hash`, `id_app`, `uid`, `datetime`) VALUES ('" . $hash_ . "', '" . $app_id . "', '" . $uid . "', '" . date("Y-m-d H:i:s") . "');")) {
            $response["status"] = 1;
            
            if ($count_trick == 0) export();
        }
        closeDB($mysqli);
        
        echo json_encode($response);
        return;
    }

    if ($action == "export_list") {
        
        if(isset($_POST["app_id"])) $app_id = $_POST["app_id"]; else return;

        $status_valid_user_app = valid_user_app($app_id, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        $i_first = 0;

        $mysqli = connectDB();
        $query = "SELECT `file`, `datetime`, `progress`, `status` FROM `vk_app_export` WHERE `id_app`='" .
            $app_id . "' ORDER BY `id` DESC LIMIT 0 , 15;";
        $response["response"] = array();
        if (mysqli_multi_query($mysqli, $query)) {
            do {
                /* получаем первый результирующий набор */
                if ($result = mysqli_store_result($mysqli)) {
                    while ($row = mysqli_fetch_row($result)) {
                        $i_first++;

                        $file_ = $row[0];
                        $datetime_start_ = $row[1];
                        $progress_ = $row[2];
                        $status_ = $row[3];

                        if ($progress_ != 100) {
                            if ($progress_ == 0)
                                $status_ = "Ждёт выполения";
                            else
                                $status_ = "Выполняется";
                        } else
                            $status_ = "Выполнено";
                        
                        $datetime_start_ = time_correction($datetime_start_, "Europe/Moscow", $timezone_);
                        
                        $post["datetime"] = $datetime_start_;
                        $post["progress"] = $progress_;
                        $post["status"] = $status_;
                        $post["download_file"] = $file_;
                        array_push($response["response"], $post);
                    }
                    mysqli_free_result($result);
                }
            } while (mysqli_more_results($mysqli));
        }
        closeDB($mysqli);
        $response["count"] = $i_first;
        echo json_encode($response);
        return;
    }

    if ($action == "inform_select_send") {

        $send_id = (int)$_POST["send_id"];
        
        if(isset($_POST["app_id"])) $app_id = $_POST["app_id"]; else return;
        
        $status_valid_user_app = valid_user_app($app_id, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        $response = inform_select_send($app_id, $send_id);

        echo json_encode($response);
        return;
    }

    if ($action == "load_visits_app_logs") {
        
        $uid_ = (int)$_POST["uid"];
        
        if(isset($_POST["app_id"])) $id_app = $_POST["app_id"]; else return;
        
        $status_valid_user_app = valid_user_app($id_app, $uid);
        if ($status_valid_user_app["status"] == 0) {
            $response = "";
            echo json_encode($response);
            return;
        }

        if (isset($_POST["start"]))
            $start = (int)$_POST["start"];
        else
            $start = 0;

        $number_page = 15;

        $mysqli = connectDB();
        $row1 = $mysqli->query("SELECT COUNT(id) as count FROM `vk_app_all_visits_logs` WHERE `id_app`='" .$id_app . "' AND `id_vk`='" . $uid_ . "';");
        $row2 = $row1->fetch_assoc();
        $count = $row2["count"];

        $response["count"] = $count;

        $mysqli->real_query("SELECT `date` FROM `vk_app_all_visits_logs` WHERE `id_app`='" .
            $id_app . "' AND `id_vk`='" . $uid_ . "' ORDER BY `date` DESC LIMIT " . $start .
            " , " . $number_page . ";");
        $result = $mysqli->use_result();

        $response["response"] = array();

        while ($row = $result->fetch_assoc()) {
            
            $post["datetime"] = time_correction($row["date"], "Europe/Moscow", $timezone_);
            array_push($response["response"], $post);
        }

        closeDB($mysqli);
        $response["all_page"] = $count;
        
        echo json_encode($response);
        return;
    }
    
    if ($action == "load_selected_send_user") {
        
        if(isset($_POST["app_id"])) $id_app = (int)$_POST["app_id"]; else return;
        
        if(isset($_POST["count_page"])) $count_page = $_POST["count_page"]; else {
            $response["error"] = "-3";
            echo json_encode($response);
            return;
        }
        
        $first = (int)$_POST['count_page'];
        
        echo json_encode(selected_send_user($id_app, $count_page, $first));
        return;
    }
    
    if ($action == "save_selecet_app") {
        
        $response["status"] = 0;
        
        if(isset($_POST["id_app"])) {
            $id_app = $_POST["id_app"];
            $response["status"] = 1;
            
            $mysqli = connectDB();
            $mysqli->query("UPDATE `vk_app_sender_visits` SET `select_app`='".$id_app."' WHERE `uid`='".$uid."' AND `social`='".$social."';");
            closeDB($mysqli);
        }
        
        echo json_encode($response);
        return;
    }
    
    if ($action == "get_selected_app") {
        
        $response["status"] = 0;
        
        $mysqli = connectDB();
        $row1 = $mysqli->query("SELECT `select_app` FROM `vk_app_sender_visits` WHERE `uid`='".$uid."' AND `social`='".$social."';");
        $row2 = $row1->fetch_assoc();
        if(isset($row2["select_app"]))
        {
            $select_app_ = $row2["select_app"];
            $response["status"] = 1;
            $response["selected_app"] = $select_app_;
        }
        closeDB($mysqli);
        
        echo json_encode($response);
        return;
    }
    
    if ($action == "load_time_zone") {
        
        $mysqli = connectDB();
        $row_active = $mysqli->query("SELECT `utc` FROM `vk_app_sender_visits` WHERE `uid`='" . $uid . "';");
        $row1_active = $row_active->fetch_assoc();
        $timezone_ = $row1_active["utc"];
        closeDB($mysqli);
        
        $response["status"] = 0;
        $response["your_timezone"] = $timezone_;
                
        $i_number = 0;
        
        $arr_timez_id_lst2 = timezone_identifiers_list();
        $response["response"] = array();
        foreach( $arr_timez_id_lst2 as $timez2) {
            if($timez2 != "UTC")
            {
                $i_number++;
                $response["status"] = 1;
                $post["timezone"] = $timez2;
                array_push($response["response"], $post);
            }
        }
        
        $response["count"] = $i_number;
        
        echo json_encode($response);
        return;
    }
    
    if ($action == "edit_time_zone") {
        
        if(isset($_POST["selecttimezone"])) $timezone = $_POST["selecttimezone"];
        
        $response["status"] = 0;
        
        if(isset($timezone))
        {
            $response["status"] = 1;
            
            $mysqli = connectDB();
            if($mysqli->query("UPDATE `vk_app_sender_visits` SET `utc`='".$timezone."'  WHERE `uid`='" . $uid . "';"))
                $response["status"] = 1;
            else
                $response["status"] = 0;
            closeDB($mysqli);
        }
        
        echo json_encode($response);
        return;
    }
    
    if ($action == "datetime_load") {
        
        $mysqli = connectDB();
        $row_active = $mysqli->query("SELECT `utc` FROM `vk_app_sender_visits` WHERE `uid`='" . $uid . "';");
        $row1_active = $row_active->fetch_assoc();
        $timezone_ = $row1_active["utc"];
        closeDB($mysqli);
        
        date_default_timezone_set($timezone_);
        
        $response["datetime"] = date("Y-m-d H:i:s");
        
        echo json_encode($response);
        return;
    }
    
    return;
} else {
    echo "Send a value for information";
    return;
}
?>