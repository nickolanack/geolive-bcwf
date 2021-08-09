


$config=GetWidget('app-config');
$delay=$config->getParameter('delay', 4);
$delay=max(10,min(intval($delay)*60, 10*60));

$eventArgs->config=$config->getConfigurationValues();
$eventArgs->delay=$delay;
Broadcast('onDelayCreateMapitem','event', $eventArgs);
Emit('onDelayCreateMapitem', $eventArgs, $delay);

