<?

define ("TIMEZONESERVER", "Europe/Moscow");

define ("IDAPP", "");
define ("SECRETKEY", "");
define ("AUTORIDVK", "");

define ("SSH2_IP", "");
define ("SSH2_LOGIN", "");
define ("SSH2_PASSWORD", "");

function connectDB()
{
    $hostname = "localhost";
    $username = "";
    $password = "";
    $dbName = "";

    $mysqli = new mysqli($hostname, $username, $password, $dbName);
    $mysqli->query('SET NAMES "utf8"');
    if ($mysqli->connect_errno) {
        echo "Не удалось подключиться к MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->
            connect_error;
    }
    return $mysqli;
}

function closeDB($mysqli)
{
    $mysqli->close();
}

function time_2($time_input)
{
    date_default_timezone_set(TIMEZONESERVER);
    
    $met = $time_input;
    $metTS = strtotime($met);

    $sub = $metTS - time();
    $sub = abs($sub);
    $days = (int)($sub / (24 * 60 * 60));
    $hours = (int)(($sub - $days * 24 * 60 * 60) / (60 * 60));
    $min = (int)(($sub - $days * 24 * 60 * 60 - $hours * 60 * 60) / 60);
    $sec = $sub - $days * 24 * 60 * 60 - $hours * 60 * 60 - $min * 60;
    
    $data["days"] = $days;
    $data["hours"] = $hours;
    $data["min"] = $min;
    $data["sec"] = $sec;
    
    return $data;
}

function time_explode_sender($datetime, $hour_plus = 0, $next_day = false)
{
    $last_datetime_sender_date = explode("-", $datetime);
    $last_datetime_sender_time = explode(" ", $last_datetime_sender_date[2]);
    if ($next_day == true)
        $last_datetime_sender_time[0] = $last_datetime_sender_time[0] + 1;
    $last_datetime_sender_ = $last_datetime_sender_date[0] . "-" . $last_datetime_sender_date[1] .
        "-" . $last_datetime_sender_time[0] . " ";
    $last_datetime_sender_time = explode(":", $last_datetime_sender_time[1]);
    if ($hour_plus != 0)
        $last_datetime_sender_time[0] = $last_datetime_sender_time[0] + $hour_plus;
    if ($next_day == true) {
        $last_datetime_sender_time[0] = "00";
        $last_datetime_sender_time[1] = "00";
        $last_datetime_sender_time[2] = "00";
    }
    
    $last_datetime_sender_ .= $last_datetime_sender_time[0] . ":" . $last_datetime_sender_time[1] . ":" . $last_datetime_sender_time[2];

    return $last_datetime_sender_;
}

function convertUrlQuery($query, $search = '&')
{
    $queryParts = explode($search, $query);

    $params = array();
    $params["error"] = true;
    
    if(count($queryParts) > 1)
    {
        foreach ($queryParts as $param) {
            $item = explode("=", $param);
            if(isset($item[0]) && isset($item[1]))
                $params[$item[0]] = $item[1];
        }
    }

    return $params;
}

function curl_info($url) {
    $ch = curl_init();
    $options = array(
        CURLOPT_URL => $url,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_HEADER => false,
        CURLOPT_POST => 0,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FRESH_CONNECT => true
    ); // cURL options
    curl_setopt_array($ch, $options);
    
    $json = curl_exec($ch);
    curl_close($ch);
    return $json;
}

function valid_app($app_id, $social = "vk")
{
    $status = 1;
    $valid_app_admin_bool = false;
    $valid_app_not_download_bool = false;
    
    if($social == "vk")
    {
        //Проверка на валидность приложения
        $url = "https://vk.com/app".$app_id;
        $json = curl_info($url);
        $json = mb_convert_encoding($json, 'utf-8', "windows-1251");
        
        $valid_app_admin_bool = (strpos($json, " was disabled by site administrators."));
        $valid_app_not_download_bool = (strpos($json,
            " has not been uploaded by the user."));
        
        if ($valid_app_admin_bool == true || $valid_app_not_download_bool == true) {
            $status = 0;
        }
    }
    
    if($social == "ok")
    {
        $json = ok_parse_data($app_id, "iframe");
        
        $valid_app_bool = $json["valid"];
        
        if ($valid_app_bool == true) {
            $status = 1;
        }
    }
    
    return $status;
}

function delete_app($text_delete, $count, $array)
{
    $text_new_utf2 = array(
        "" . $text_delete . "",
        "\r\n",
        "\n",
        "\r");
    $text_new_cyr2 = array(
        null,
        "<>",
        null,
        null);

    $text_new = str_replace($text_new_utf2, $text_new_cyr2, $array);

    $text_new2 = explode("<>", $text_new);
    $result = "";
    $symbol = "";

    for ($i = 0; $i < $count; $i++) {
        if ($result !== "") {
            $symbol = "\r\n";
        }

        if ($text_new2[$i] != "")
            $result = $result . $symbol . $text_new2[$i];
    }
    return $result;
}

function data_app($id_app)
{
    $data[] = array();
    $mysqli = connectDB();
    $query = "SELECT `title_app`, `list_app`, `list_secret_key`, `uid`, `name`, `iframe_url` FROM `vk_app_sender_visits`;";
    if (mysqli_multi_query($mysqli, $query)) {
        do {
            /* получаем первый результирующий набор */
            if ($result = mysqli_store_result($mysqli)) {
                while ($row = mysqli_fetch_row($result)) {
                    $title_app_ = $row[0];
                    $list_app_ = $row[1];
                    $list_secret_key_app_ = $row[2];
                    $uid_user_app_ = $row[3];
                    $name_user_app_ = $row[4];
                    $iframe_url_ = $row[5];

                    if (isset($title_app_) && isset($list_app_) && isset($list_secret_key_app_) && isset($iframe_url_)) {
                        $count = explode("\r\n", $list_app_);
                        $count = count($count);

                        $title_app_array = explode("\r\n", $title_app_);
                        $list_app_array = explode("\r\n", $list_app_);
                        $list_secret_key_app_array = explode("\r\n", $list_secret_key_app_);
                        $list_iframe_url_array = explode("\r\n", $iframe_url_);

                        for ($i = 0; $i < $count; $i++) {
                            if ("$id_app" == "$list_app_array[$i]") {
                                $data["uid_add"] = $uid_user_app_;
                                $data["name_add"] = $name_user_app_;
                                $data["title_app"] = $title_app_array[$i];
                                $data["id_app"] = $list_app_array[$i];
                                $data["list_secret_key_app"] = $list_secret_key_app_array[$i];
                                $data["iframe_url"] = $list_iframe_url_array[$i];
                            }
                        }
                    }
                }
                mysqli_free_result($result);
            }
        } while (mysqli_more_results($mysqli));
    }
    closeDB($mysqli);

    return $data;
}

function title_app($id_app, $uid)
{
    $result = "";
    $mysqli = connectDB();
    $row_active = $mysqli->query("SELECT `title_app`, `list_app` FROM `vk_app_sender_visits` WHERE `uid`='" .
        $uid . "';");
    $row1_active = $row_active->fetch_assoc();
    $title_app_ = $row1_active["title_app"];
    $list_app_ = $row1_active["list_app"];
    closeDB($mysqli);

    if (isset($title_app_) && isset($list_app_)) {
        $count = explode("\r\n", $title_app_);
        $count = count($count);

        $list_title_array = explode("\r\n", $title_app_);
        $list_app_array = explode("\r\n", $list_app_);

        for ($i = 0; $i < $count; $i++) {
            if ("$id_app" == "$list_app_array[$i]") {
                $result = $list_title_array[$i];
            }
        }
    }

    return $result;
}

function repetition_data_app($title_app, $id_app, $secret_key, $uid = false) {
    
    $data[] = array();
    
    $data["status_id_app"] = false;
    $data["status_title"] = false;
    $data["status_secret_key"] = false;
    
    $mysqli = connectDB();
    $query = "SELECT `title_app`, `list_app`, `list_secret_key`, `uid` FROM `vk_app_sender_visits`;";
    if (mysqli_multi_query($mysqli, $query)) {
        do {
            //получаем первый результирующий набор
            if ($result = mysqli_store_result($mysqli)) {
                while ($row = mysqli_fetch_row($result)) {
                    $title_app_ = $row[0];
                    $list_app_ = $row[1];
                    $list_secret_key_app_ = $row[2];
                    $uid_app_ = $row[3];
                    
                    if (isset($title_app_)) {
                        $count = explode("\r\n", $title_app_);
                        $count = count($count);
                        
                        $title_app_array = explode("\r\n", $title_app_);
                        $list_app_array = explode("\r\n", $list_app_);
                        $list_secret_key_app_array = explode("\r\n", $list_secret_key_app_);
                        $uid_app_array = explode("\r\n", $uid_app_);
                        
                        for ($i = 0; $i < $count; $i++) {
                            if ((strpos($title_app, "$title_app_array[$i]")) !== false) {
                                $data["status_title"] = true;
                            }
                            
                            if ((strpos($id_app, "$list_app_array[$i]")) !== false) {
                                $data["status_id_app"] = true;
                            }
                            
                            if ((strpos($secret_key, "$list_secret_key_app_array[$i]")) !== false) {
                                $data["status_secret_key"] = true;
                            }
                        }
                    }
                }
                mysqli_free_result($result);
            }
        } while (mysqli_more_results($mysqli));
    }
    closeDB($mysqli);
    
    return $data;
}

function repetition_app($id_app, $title = "", $secret_key = "")
{
    $data = false;
    $repetition_data_app = false;
    
    if((repetition_data_app($title, $id_app, $secret_key))) {
        $repetition_data_app_ = repetition_data_app($title, $id_app, $secret_key);
    }
    
    if(isset(data_app($id_app)["id_app"]) && $id_app == data_app($id_app)["id_app"] || $repetition_data_app_ != false && $repetition_data_app_["status_title"]){
        $data = true;
    }
    
    return $data;
}

function delete_remote_control($id_app, $delete_user = false, $uid = false)
{
    $data = false;
    $mysqli = connectDB();
    $query = "SELECT `uid`, `remote_control` FROM `vk_app_sender_visits`;";
    if (mysqli_multi_query($mysqli, $query)) {
        do {
            /* получаем первый результирующий набор */
            if ($result = mysqli_store_result($mysqli)) {
                while ($row = mysqli_fetch_row($result)) {
                    $list_app_ = $row[1];
                    $uid_ = $row[0];

                    if (isset($list_app_)) {
                        $count = explode("\r\n", $list_app_);
                        $count = count($count);

                        $list_app_array = explode("\r\n", $list_app_);
                        for ($i = 0; $i < $count; $i++) {
                            $value_app_remote = explode(":", $list_app_array[$i]);
                            if ("$id_app" == "$value_app_remote[0]") {
                                $id_app_delete = delete_app($id_app . ":" . $value_app_remote[1], $count, $list_app_);

                                if ($delete_user == false) {
                                    if ($id_app_delete == "")
                                        $query_update = "NULL";
                                    else
                                        $query_update = "'" . $id_app_delete . "'";
                                    
                                    if($query_update == "NULL")
                                        $query_select_app = ",`select_app`=NULL";
                                    
                                    $mysqli->query("UPDATE `vk_app_sender_visits` SET `remote_control`={$query_update}{$query_select_app} WHERE `uid`='" . $uid_ . "';");
                                }
                                if ($delete_user == true) {
                                    if ($id_app_delete == "")
                                        $query_update = "NULL";
                                    else
                                        $query_update = "'" . $id_app_delete . "'";
                                    
                                    if($query_update == "NULL")
                                        $query_select_app = ",`select_app`=NULL";
                                    
                                    $mysqli->query("UPDATE `vk_app_sender_visits` SET `remote_control`={$query_update}{$query_select_app} WHERE `uid`='" . $uid . "';");
                                }
                                $data = true;
                            }
                        }
                    }
                }
                mysqli_free_result($result);
            }
        } while (mysqli_more_results($mysqli));
    }
    closeDB($mysqli);
    return $data;
}

function add_remote_control($id_app, $uid_added, $uid_remote)
{
    $data = false;
    $mysqli = connectDB();
    $query = "SELECT `remote_control`, `select_app` FROM `vk_app_sender_visits` WHERE `uid`='" . $uid_added . "';";
    if (mysqli_multi_query($mysqli, $query)) {
        do {
            /* получаем первый результирующий набор */
            if ($result = mysqli_store_result($mysqli)) {
                while ($row = mysqli_fetch_row($result)) {
                    $list_app_ = $row[0];
                    $select_app_ = $row[1];

                    $count = explode("\r\n", $list_app_);
                    $count = count($count);

                    $info_remote_app = explode("\r\n", $list_app_);

                    $result_ = "";
                    $symbol = "";

                    $count_all = $count + 1;

                    for ($i = 0; $i < $count_all; $i++) {
                        if ($i == $count_all - 1) {
                            if ($result_ !== "") {
                                $symbol = "\r\n";
                            }
                            $result_ = $result_ . $symbol . $id_app . ":" . $uid_remote;
                        } else {
                            $value_app_remote = explode(":", $info_remote_app[$i]);
                            if ($value_app_remote[0] != "" && $value_app_remote[1] != "") {
                                if ($result_ !== "") {
                                    $symbol = "\r\n";
                                }
                                $result_ = $result_ . $symbol . $value_app_remote[0] . ":" . $value_app_remote[1];
                            }
                        }
                    }
                    
                    if(!$select_app_) $select_app_field = "`select_app`='".$id_app."', ";
                    
                    if ($mysqli->query("UPDATE `vk_app_sender_visits` SET {$select_app_field}`remote_control`='" . $result_ . "' WHERE `uid`='" . $uid_added . "';"))
                        $data = true;
                    else
                        $data = false;
                }
                mysqli_free_result($result);
            }
        } while (mysqli_more_results($mysqli));
    }
    closeDB($mysqli);
    return $data;
}

function search_remote_control($id_app)
{
    $mysqli = connectDB();
    $query = "SELECT `uid`, `remote_control` FROM `vk_app_sender_visits`;";
    $response["response"] = array();
    $i_first = 0;
    if (mysqli_multi_query($mysqli, $query)) {
        do {
            /* получаем первый результирующий набор */
            if ($result = mysqli_store_result($mysqli)) {
                while ($row = mysqli_fetch_row($result)) {
                    $remote_control_ = $row[1];
                    $uid_admin_remote_control_ = $row[0];

                    $count = explode("\r\n", $remote_control_);
                    $count = count($count);

                    $info_remote_app = explode("\r\n", $remote_control_);

                    for ($i = 0; $i < $count; $i++) {
                        $value_app_remote = explode(":", $info_remote_app[$i]);

                        if ($value_app_remote[0] != "") {
                            if ("$id_app" == "$value_app_remote[0]") {
                                if ($uid_admin_remote_control_ != AUTORIDVK) {
                                    $i_first++;

                                    $row_active = $mysqli->query("SELECT `name` FROM `vk_app_sender_visits` WHERE `uid`='" . $uid_admin_remote_control_ . "';");
                                    $row1_active = $row_active->fetch_assoc();

                                    $post["id_app"] = $id_app;
                                    $post["uid_added"] = $value_app_remote[1];
                                    $post["uid_remote"] = $uid_admin_remote_control_;
                                    $post["real_name"] = $row1_active["name"];
                                    array_push($response["response"], $post);
                                }
                            }
                        }
                    }
                }
                mysqli_free_result($result);
            }
        } while (mysqli_more_results($mysqli));
    }
    $response["count"] = $i_first;
    closeDB($mysqli);
    return $response;
}

function valid_user_sytem($uid)
{
    $data = false;
    $mysqli = connectDB();
    $query = "SELECT `uid` FROM `vk_app_sender_visits`;";
    if (mysqli_multi_query($mysqli, $query)) {
        do {
            /* получаем первый результирующий набор */
            if ($result = mysqli_store_result($mysqli)) {
                while ($row = mysqli_fetch_row($result)) {
                    $uid_ = $row[0];
                    if ("$uid" == "$uid_")
                        $data = true;
                }
                mysqli_free_result($result);
            }
        } while (mysqli_more_results($mysqli));
    }
    closeDB($mysqli);
    return $data;
}

function repetition_remote_control($uid, $id_app)
{
    $data = false;
    $mysqli = connectDB();
    $query = "SELECT `uid`, `remote_control` FROM `vk_app_sender_visits`;";
    if (mysqli_multi_query($mysqli, $query)) {
        do {
            /* получаем первый результирующий набор */
            if ($result = mysqli_store_result($mysqli)) {
                while ($row = mysqli_fetch_row($result)) {
                    $uid_ = $row[0];
                    $remote_control_ = $row[1];

                    if ("$uid" == "$uid_") {
                        $count = explode("\r\n", $remote_control_);
                        $count = count($count);

                        $info_remote_app = explode("\r\n", $remote_control_);

                        for ($i = 0; $i < $count; $i++) {
                            $value_app_remote = explode(":", $info_remote_app[$i]);
                            if ($value_app_remote[0] != "") {
                                if ("$id_app" == "$value_app_remote[0]") {
                                    $data = true;
                                }
                            }
                        }
                    }
                }
                mysqli_free_result($result);
            }
        } while (mysqli_more_results($mysqli));
    }
    closeDB($mysqli);
    return $data;
}

function update_remote_control($id_app_old, $id_app_new)
{
    $data = false;
    $mysqli = connectDB();
    $query = "SELECT `uid`, `remote_control` FROM `vk_app_sender_visits`;";
    if (mysqli_multi_query($mysqli, $query)) {
        do {
            /* получаем первый результирующий набор */
            if ($result = mysqli_store_result($mysqli)) {
                while ($row = mysqli_fetch_row($result)) {
                    $remote_control_ = $row[1];
                    $uid_vk_ = $row[0];

                    $count = explode("\r\n", $remote_control_);
                    $count = count($count);

                    $info_remote_app = explode("\r\n", $remote_control_);

                    for ($i = 0; $i < $count; $i++) {
                        $value_app_remote = explode(":", $info_remote_app[$i]);

                        if ($value_app_remote[0] != "") {
                            if ("$id_app_old" == "$value_app_remote[0]") {
                                $id_new_remote_list = str_replace("" . $id_app_old . "", "" . $id_app_new . "",
                                    $remote_control_);

                                if ($mysqli->query("UPDATE `vk_app_sender_visits` SET `remote_control`='" . $id_new_remote_list .
                                    "' WHERE `uid`='" . $uid_vk_ . "';"))
                                    $data = true;
                            }
                        }
                    }
                }
                mysqli_free_result($result);
            }
        } while (mysqli_more_results($mysqli));
    }
    closeDB($mysqli);
    return $data;
}

function iframe_url($url, $api_id, $social = 'vk')
{
    $result_data = false;
    
    $value_app_frame = explode("://", $url);
    if(isset($value_app_frame[1]))
    {
        $value_app_frame = explode("?", $value_app_frame[1]);
        $value_app_frame = $value_app_frame[0];
    
        $info_app = data_app($api_id);
        $uid_add_ = $info_app["uid_add"];
    
        $mysqli = connectDB();
        $query = "SELECT `list_app` FROM `vk_app_sender_visits` WHERE `uid`='" . $uid_add_ .
            "';";
        $row_active = $mysqli->query($query);
        $row1_active = $row_active->fetch_assoc();
        $list_app_ = $row1_active["list_app"];
        closeDB($mysqli);
    
        $count_user_app = explode("\r\n", $list_app_);
        $count_user_app = count($count_user_app);
    
        //№ положения среди добавленных приложений
        $number_list = 0;
    
        $mysqli = connectDB();
        $query = "SELECT `uid`, `list_app`, `iframe_url` FROM `vk_app_sender_visits`;";
        if (mysqli_multi_query($mysqli, $query)) {
            do {
                /* получаем первый результирующий набор */
                if ($result = mysqli_store_result($mysqli)) {
                    while ($row = mysqli_fetch_row($result)) {
                        $uid_ = $row[0];
                        $list_app_ = $row[1];
                        $iframe_url_ = $row[2];
    
                        if ("$uid_add_" == "$uid_") {
                            $result_iframe_url_ = "";
                            $symbol = "";
    
                            $info_list_app = explode("\r\n", $list_app_);
                            $i_app = 0;
    
                            for ($i = 0; $i < $count_user_app; $i++) {
                                $i_app++;
    
                                if (!isset($iframe_url_)) {
                                    if ($result_iframe_url_ !== "") {
                                        $symbol = "\r\n";
                                    }
                                    $result_iframe_url_ = $result_iframe_url_ . $symbol . "NULL" . $i_app;
                                }
                            }
    
                            if ($result_iframe_url_) {
                                if ($mysqli->query("UPDATE `vk_app_sender_visits` SET `iframe_url`='" . $result_iframe_url_ .
                                    "' WHERE `uid`='" . $uid_add_ . "';"))
                                    $result_data = true;
                            }
                        }
                    }
                    mysqli_free_result($result);
                }
            } while (mysqli_more_results($mysqli));
        }
        closeDB($mysqli);
    
        $mysqli = connectDB();
        $query = "SELECT `uid`, `list_app`, `iframe_url` FROM `vk_app_sender_visits`;";
        if (mysqli_multi_query($mysqli, $query)) {
            do {
                /* получаем первый результирующий набор */
                if ($result = mysqli_store_result($mysqli)) {
                    while ($row = mysqli_fetch_row($result)) {
                        $uid_ = $row[0];
                        $list_app_ = $row[1];
                        $iframe_url_ = $row[2];
    
                        if ("$uid_add_" == "$uid_") {
                            $result_iframe_url_new = "";
                            $symbol = "";
    
                            $info_list_app = explode("\r\n", $list_app_);
                            $i_app = 0;
    
                            for ($i = 0; $i < $count_user_app; $i++) {
                                $i_app++;
    
                                if (isset($iframe_url_)) {
                                    if ($result_iframe_url_new !== "") {
                                        $symbol = "\r\n";
                                    }
    
                                    $iframe_url_info = explode("\r\n", $iframe_url_);
    
                                    $value_list_app = explode(":", $info_list_app[$i]);
                                    if ($value_list_app[0] != "") {
                                        if ("$api_id" == "$value_list_app[0]") {
                                            $number_list = $i_app;
                                            $result_iframe_url_new = $result_iframe_url_new . $symbol . $value_app_frame;
                                        } else {
                                            $result_iframe_url_new = $result_iframe_url_new . $symbol . $iframe_url_info[$i];
                                        }
                                    }
                                }
                            }
    
                            if ($result_iframe_url_new) {
                                if ($mysqli->query("UPDATE `vk_app_sender_visits` SET `iframe_url`='" . $result_iframe_url_new .
                                    "' WHERE `uid`='" . $uid_add_ . "';"))
                                    $result_data = true;
                            }
                        }
                    }
                    mysqli_free_result($result);
                }
            } while (mysqli_more_results($mysqli));
        }
        closeDB($mysqli);
        
        return $result_data;
    }
}

function add_cron($datetime, $dirname)
{
    $connection = ssh2_connect(SSH2_IP, 22);
    if (!$connection)
        die('Connection failed');
    ssh2_auth_password($connection, SSH2_LOGIN, SSH2_PASSWORD);
    $stream = ssh2_exec($connection,
        'cd /var/www/kykyiiikuh/data/PythonScripts/vkapp/sender;python add_cron.py -d "' . $datetime . '" -dir "' . $dirname . '"& 2>&1');
    fclose($stream);
}

function delete_cron($datetime)
{
    $connection = ssh2_connect(SSH2_IP, 22);
    if (!$connection)
        die('Connection failed');
    ssh2_auth_password($connection, SSH2_LOGIN, SSH2_PASSWORD);
    $stream = ssh2_exec($connection,
        'cd /var/www/kykyiiikuh/data/PythonScripts/vkapp/sender;python delete_cron.py -d "' . $datetime . '"& 2>&1');
    fclose($stream);
    //$connection->disconnect();
}

function export()
{
    $connection = ssh2_connect(SSH2_IP, 22);
    if (!$connection)
        die('Connection failed');
    ssh2_auth_password($connection, SSH2_LOGIN, SSH2_PASSWORD);
    //'cd /var/www/kykyiiikuh/data/PythonScripts/vkapp/sender;nohup python export.py -d "' .$id_app . '" -hash "' . $hash_ . '" &');
    $stream = ssh2_exec($connection,
        'cd /var/www/kykyiiikuh/data/PythonScripts/vkapp/sender;python export.py& 2>&1');
    fclose($stream);
    $connection->disconnect();
}

function testi($id_app)
{
    $result = "";
    $connection = ssh2_connect(SSH2_IP, 22);
    if (!$connection)
        die('Connection failed');
    ssh2_auth_password($connection, SSH2_LOGIN, SSH2_PASSWORD);
    $stream = ssh2_exec($connection,
        'cd /var/www/kykyiiikuh/data/PythonScripts/vkapp/sender;nohup python countdayvisits.py -d "' .
        $id_app . '"& 2>&1');
    stream_set_blocking($stream, true);
    $result = fread($stream, 4096);
    fclose($stream);

    return $result;
}

function check_secure_key($app_id, $secure_key, $social = 'vk')
{
    $data = false;
    $name_ = null;
    
    if($social == "vk") {
        $VK = new vkapi2("{$app_id}", "{$secure_key}");
        $resp = $VK->api2('users.get', array('user_ids' => AUTORIDVK, 'fields' => 'first_name, last_name'), 1);
        $resp = json_encode($resp);
        $xml = json_decode($resp, true);
        
        foreach ($xml as $movie) {
            if(!isset($movie["error_msg"])) {
                $name_ = $movie[0]["last_name"] . " " . $movie[0]["first_name"];
            }
        }
    }
    
    if($social == "ok") {
        $name_ = "42424";
    }
    
    if (isset($name_)) {
        $data = true;
    }
    
    return $data;
}

function count_install_user_app($id_app)
{
    $data_ = "";

    $data_ = file_get_contents("http://vk.com/app" . $id_app);
    $data_ = mb_convert_encoding($data_, 'utf-8', "windows-1251");
    $data_ = str_get_html($data_);
    $data_ = $data_->find('div.app_users', 0)->plaintext;
    $data_ = strip_tags($data_);
    $data_ = preg_replace('/\s\s+/', null, $data_);
    $data_ = explode(",", $data_);
    $data_ = $data_[1];
    $data_ = preg_replace('/\s\s+/', null, $data_);
    $data_ = explode(" ", $data_);
    $data_ = $data_[1];

    return $data_;
}

function real_title_app($id_app)
{
    $data_ = "";
    $json = file_get_contents("http://vk.com/app" . $id_app);
    $json = mb_convert_encoding($json, 'utf-8', "windows-1251");
    $json = str_get_html($json);
    $json = $json->find('div.app_layer_name', 0)->plaintext;
    $json = strip_tags($json);
    $json = preg_replace('/\s\s+/', null, $json);
    return $json;
}

function valid_hash($uid, $name_, $social = "vk")
{
    usleep(700);
    $data = false;

    $mysqli = connectDB();
    $row_active = $mysqli->query("SELECT `hash` FROM `vk_app_sender_visits` WHERE `uid`='" . $uid . "';");
    $row1_active = $row_active->fetch_assoc();
    $hash_db = $row1_active["hash"];
    closeDB($mysqli);

    if ($hash_db) {
        $hash_register = md5($uid . "SENDER");

        if ($hash_register == $hash_db)
            $data = true;
    }

    return $data;
}

function inform_select_send($app_id, $send_id)
{
    //echo "\n 11 \n";
    //echo "SELECT `datetime`, `message`, `hash` FROM `vk_app_sender_list` WHERE `app_id`='" . $app_id . "' AND `id`='" . $send_id . "';";
    $mysqli = connectDB();
    $row_active = $mysqli->query("SELECT `datetime`, `message`, `hash` FROM `vk_app_sender_list` WHERE `app_id`='" . $app_id . "' AND `id`='" . $send_id . "';");
    $row1_active = $row_active->fetch_assoc();
    $message_ = $row1_active["message"];
    $datetime_ = $row1_active["datetime"];
    $hash_sender_old = $row1_active["hash"];
    closeDB($mysqli);
    
    //echo "\n 12 \n";
    
    if (isset($message_) && isset($datetime_) && isset($hash_sender_old)) {
        
        //echo "\n 13 \n";
        
        $datetime = date("Y-m-d", strtotime($datetime_));
        $day_next = strtotime($datetime) + (1 * 24 * 60 * 60);
        $datetime_new = date("Y-m-d", $day_next);
        $time_ = date("H", strtotime($datetime_));
        
        $query = "SELECT `id`, `log` FROM `vk_app_sender_logs` WHERE datetime between '{$datetime} {$time_}' and '{$datetime_new} 00' AND `hash_list`='".$hash_sender_old."' AND `app_id`='" . $app_id . "'";
        
        //echo $query . "\n";
        
        $mysqli = connectDB();
        $row_active = $mysqli->query("SELECT `datetime` FROM `vk_app_sender_logs` WHERE `app_id`='".$app_id."' AND `hash_list`='".$hash_sender_old."' ORDER BY `id` DESC;");
        $row1_active = $row_active->fetch_assoc();
        $d_logs = $row1_active["datetime"];
        closeDB($mysqli);
        
        //echo "\n 14 \n";
        
        if($hash_sender_old != NULL && isset($d_logs)) $time_send_old = GetDaysBetween($datetime_, $d_logs); else $time_send_old = "00:00:00";
        
        $mysqli = connectDB();
        $mysqli->real_query($query.";");
        $result = $mysqli->use_result();

        $userids = "";
        $symbol = "";
        //$loging = "";
        
        while ($row = $result->fetch_assoc()) {
            
            //echo "\n 15 \n";
            
            if ($row["id"]) {
                //echo "\n 151 \n";
                if ($userids !== "") {
                    $symbol = ",";
                }
                
                //$loging = $row["log"];
                
                if (isset($row["log"])) {
                    /*$valid_ = (strpos($row["log"], '<?xml version="1.0" encoding="utf-8"?><response/>'));*/
                    
                    $resp2 = str_replace("\"{", "{", $row["log"]);
                    $resp2 = str_replace("}\"", "}", $resp2);
                    
                    //var_dump(json_decode($resp2));
                    
                    $resp2 = json_decode($resp2, true);
                    
                    //echo $resp2["response"];
                    
                    if (isset($resp2["response"])) {
                        
                        if (!isset($resp2["response"])) {
                            echo 'Error while parsing the document';
                            exit;
                        }
                        
                        if (isset($resp2["response"])) {
                            //$resp = json_encode($resp);
                            $userids = $userids . $symbol . $resp2["response"];
                        }
                    }
                }
            }
        }
        closeDB($mysqli);

        if ($userids != "") {
            $count_send_uid = explode(",", $userids);
            $count_send_uid = count($count_send_uid);
        } else
            $count_send_uid = 0;
                
        //$response["log"] = $loging;
        
        $response["id_app"] = $app_id;
        $response["send_id"] = $send_id;
        
        $response["count"] = $count_send_uid;
        $response["userssend"] = $userids;
        $response["time_send"] = $time_send_old;
        $response["status"] = 777;
    } else {
        $response["count"] = 0;
        $response["userssend"] = 0;
        $response["status"] = 0;
    }
    return $response;
}

function GetDaysBetween($date1 , $date2){
    $datetime1 = new DateTime($date1);
    $datetime2 = new DateTime($date2);
    $interval = $datetime1->diff($datetime2); 
    return $interval->format('%H:%i:%s');
 }

function valid_user_app($id_app, $uid) {
    
    $response["status_remote"] = false;
    
    $info_app = data_app($id_app);
    
    if(isset($info_app["uid_add"])) {
        $uid_add_app = $info_app["uid_add"];
        
        $info_remote_control_app = repetition_remote_control($uid, $id_app);
        $uid_remote_control_app = $info_remote_control_app;
        
        if($uid == $uid_add_app || $uid_remote_control_app == true) {
            $response["status"] = 1;
            
            $response["status_remote"] = $uid_remote_control_app;
        } else {
            $response["status"] = 0;
        }
    } else $response["status"] = 0;
    
    return $response;
}

function selected_send_user($id_app, $count_page, $first) {
    
    $data["status"] = 0;
    $data["count"] = 0;
    
    if(isset($id_app) && isset($count_page) && isset($first))
    {
        $mysqli = connectDB();
        
        $row1 = $mysqli->query("SELECT COUNT(id) as count FROM `vk_app_all_visits` WHERE `id_app`='" . $id_app . "';");
        $row2 = $row1->fetch_assoc();
        if(isset($row2["count"])) $data["count"] = $row2["count"];
        
        $mysqli->real_query("SELECT `id_vk` FROM `vk_app_all_visits` WHERE `id_app`='" . $id_app . "' ORDER BY `date` DESC LIMIT " . $first . " , 50;");
        $result = $mysqli->use_result();
        
        $userids = "";
        $symbol = "";
        
        //$data["response"] = array();
        while ($row = $result->fetch_assoc()) {
            
            if ($userids !== "") {
                $symbol = ",";
            }
            $userids = $userids . $symbol . $row["id_vk"];
            
            //$post["id_vk"] = $row["id_vk"];
            //array_push($data["response"], $post);
        }
        closeDB($mysqli);
        $data["userids"] = $userids;
    }
    
    return $data;
}

function user_app_added($uid) {
    $mysqli = connectDB();
    $row_active = $mysqli->query("SELECT `list_app` FROM `vk_app_sender_visits` WHERE `uid`='" .$uid . "';");
    $row1_active = $row_active->fetch_assoc();
    $list_app_ = $row1_active["list_app"];
    closeDB($mysqli);
    
    $count = 0;
    if(isset($list_app_) && $list_app_ != NULL)
    {
        $count = explode("\r\n", $list_app_);
        $count = count($count);
    }
    
    return $count;
}

function user_app($id_app) {
    $mysqli = connectDB();
    $row_active = $mysqli->query("SELECT COUNT(id) as count FROM `vk_app_all_visits` WHERE `id_app`='".$id_app."';");
    $row1_active = $row_active->fetch_assoc();
    $count = $row1_active["count"];
    closeDB($mysqli);
    
    return $count;
}

function userids_str_replace($userids, $userids_selected) {
    $count = explode(",", $userids_selected);
    $count = count($count);
    
    $info_selected_user = explode(",", $userids_selected);
    
    for ($i = 0; $i < $count; $i++) {
        $userids = str_replace($info_selected_user[$i], NULL, $userids);
    }
    
    $count = explode(",", $userids);
    $count = count($count);
    
    $info_selected_user = explode(",", $userids);
    
    $userids = "";
    $symbol = "";
    
    for ($i = 0; $i < $count; $i++) {
        if($info_selected_user[$i])
        {
            if ($userids !== "") {
                $symbol = ",";
            }
            $userids = $userids . $symbol . $info_selected_user[$i];
        }
    }
    
    return $userids;
}

function load_second_page($time_start_load)  {   
    $time_end_load = microtime(true);
    $time_load = $time_end_load - $time_start_load;
    $time_load = $time_load * 1000;
    $res_load = strlen($time_load) -1;
    $time_load = substr($time_load, 0, -$res_load);
    
    return $time_load;
}

function time_correction($datetime, $timezone1, $timezone2) {
    
    date_default_timezone_set($timezone1);
    $new_datetime = strtotime($datetime);
    date_default_timezone_set($timezone2);
    
    return date("Y-m-d H:i:s", $new_datetime);
}

function country_count($id_app) {
    $mysqli = connectDB();
    $row_active = $mysqli->query("SELECT DISTINCT `country` FROM `vk_app_all_visits` WHERE `id_app`='".$id_app."' AND `country` NOT IN ('NULL');");
    $count = mysqli_num_rows($row_active);
    closeDB($mysqli);
    
    return $count;
}

function tags_sender($message_send) {
    
    preg_match_all('/{d\+?([0-9]+)}/', $message_send, $day_plus, PREG_PATTERN_ORDER);
    
    preg_match_all('/{H\+?([0-9]+)}/', $message_send, $hour_plus, PREG_PATTERN_ORDER);
    
    $count_tags = count($day_plus[1]);
    
    $count_tags2 = count($hour_plus[1]);
    
    $i3 = 0;
    $i2 = -1;
    
    $day_output = date("d");
    $day_output_double = $day_output;
    $month_output = date("m");
    $month_output_double = $month_output;
    
    $year_output = date("Y");
    $year_output_double = $year_output;
    $hour_output = date("H");
    
    for ($i = 0; $i < $count_tags; $i++) {
        $i2++;
        if($i3 != 1)
            $i3++;
        
        if(isset($day_plus[$i3][$i2]))
        {
            $timestap = strtotime("+{$day_plus[$i3][$i2]} day");
            
            $day_output = date("d", $timestap);
            $month_output = date("m", $timestap);
        }
        
        $tags_array = array("{Y}", "{Yplus}", "{m}", "{mplus}", "{d}", "{dplus}", $day_plus[0][$i2], "{H}", "{i}", "{s}");
        $replace_array = array(date("Y"), $year_output, date("m"), $month_output, date("d"), $day_output, $day_output, $hour_output, date("i"), date("s"));
        $message_send = str_replace($tags_array, $replace_array, $message_send);
    }
    
    $i3 = 0;
    $i2 = -1;
    
    for ($i = 0; $i < $count_tags2; $i++) {
        $i2++;
        if($i3 != 1)
            $i3++;
                
        if(isset($hour_plus[$i3][$i2]))
        {
            $timestap = strtotime("+{$hour_plus[$i3][$i2]} hours");
            $day_output_double = date("d", $timestap);
            $month_output_double = date("m", $timestap);
            $year_output_double = date("Y", $timestap);
            
            $hour_output = date("H", $timestap);
        }
        
        if(isset($hour_plus[0][$i2]) && $hour_plus[0][$i2] != NULL)
            $hour_tags = $hour_plus[0][$i2];
        else
            $hour_tags = null;
        
        $tags_array = array("{Yplush}", $hour_tags, "{mplush}", "{dplush}");
        $replace_array = array($year_output_double, $hour_output, $month_output_double, $day_output_double);
        $message_send = str_replace($tags_array, $replace_array, $message_send);
    }
    
    return $message_send;
}
?>