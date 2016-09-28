<?php

$cache = '/srv/www/vhosts/production/bcwf.s54.ok.ubc.ca/http/templates/protostar/_github.txt';
if (file_exists($cache)) {

    if (time() - filemtime($cache) > 3600) {

        shell_exec('php /srv/www/vhosts/production/bcwf.s54.ok.ubc.ca/http/templates/protostar/github.php >/dev/null &');

    } else {
        echo file_get_contents($cache);
        return;
    }

    if (basename(__FILE__) !== 'github.php') {

        echo file_get_contents($cache);
        return;
    }

}

echo __FILE__ . "\n";

ob_start();
?>
<style>

.commits-listing {
    display: inline-block;
    max-width:25%;
    float: left;
    margin-right: 7%;
}


.commits-listing .btn-group > .btn, .commits-listing a.btn, .commits-listing button.ellipsis-expander {
    border: none;
    background: none;
}

.commits-listing img.avatar {
    display: none;
}

button.js-zeroclipboard.btn.btn-outline.zeroclipboard-button.tooltipped.tooltipped-s{
	display:none;
}

pre.text-small {
    border: none;
}

</style>

<?php
echo '<h3>Project Developement (mobile) Activity</h3>';

?>
<p>
	The following is an overview of the changes made to the (public) mobile application. The mobile application consists of a number of Objective-c libraries/projects. Only libraries and components considered to be open-source are visible here. Only developers can access the private libraries which have not been made visible due to copyright and security concerns
</p>
<?php

echo '<div style="width: 100%; display: inline-table;">';

foreach (array(
    'https://github.com/nickolanack/IOS-Geolive-Map/commits/master',
    'https://github.com/nickolanack/IOS-Map/commits/master',
    'https://github.com/nickolanack/IOS-Geolive/commits/master',
) as $url) {

    echo '<div class="github-commits">';
    $page = file_get_contents($url);

    $openingTag = '<div class="commits-listing commits-listing-padded js-navigation-container js-active-navigation-container" data-navigation-scroll="page">';
    $start      = strpos($page, $openingTag);
    $s          = $start + strlen($openingTag);
    $open       = 1;

    $sClose = $s;
    $sOpen  = $s;

    while ($open > 0) {

        $openIndex  = strpos($page, '<div', $sOpen);
        $closeIndex = strpos($page, '</div>', $sClose);

        if ($openIndex < $closeIndex && $openIndex !== false) {
            $open++;
            $sOpen = $openIndex + 1;
        } else if ($closeIndex !== false) {
            $open--;
            $sClose = $closeIndex + 1;
        } else {
            break;
        }

        // echo $open . '(o:' . $sOpen . ' c:' . $sClose . ')' . "\n";

    }

    echo "\n";

    $end  = strpos($page, '>', $sClose);
    $page = (substr($page, $start, $end - $start + 1));

    $page = str_replace('href="/', 'href="https://github.com/', $page);

    echo $page;

    echo '</div>';

}

echo '</div><div></div>';

$content = ob_get_contents();
ob_end_clean();

file_put_contents($cache, $content);
echo $content;
