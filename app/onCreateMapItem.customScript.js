


$config=GetWidget('app-config');
$delay=$config->getParameter('delay', 4);
$delay=max(0,min(intval($delay),10));

$eventArgs->config=$config->getConfigurationValues();
$eventArgs->delay=$delay;
Broadcast('onDelayCreateMapitem','event', $eventArgs);
Emit('onDelayCreateMapitem', $eventArgs, $delay);

