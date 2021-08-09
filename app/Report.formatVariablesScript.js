
GetPlugin('Attributes');

        $widget=GetWidget(57);
		$export = (new \attributes\TableExport())
			->addFields($widget->getExportMetadata());

		//$this->applyWidgetOptions($export, $json);

        $json=(object) array();
        if(isset($variables->exportOptions)){
            $json=$variables->exportOptions;
            
            
            if(isset($json->{'filter-bounds'})){
               
                $url=HtmlDocument()->website().
                '/php-core-app/core.php?iam=administrator&format=raw&'.
                'controller=plugins&view=plugin&plugin=Maps&pluginView=mapitem.icon&size=300&filter-token='.
                $json->{'filter-bounds'};
                
                 $variables->overviewTile="data://image/png;base64, " . base64_encode(file_get_contents($url));
                
               $regions= $json->{'filter-bounds'};
               $regions=explode('equal-to-',$regions);
               $regions=array_pop($regions);
               $regions=explode('-or-', $regions);
               $variables->regions=$regions;
            }
            
        }
        
        
        $variables->logo="data://image/svg;base64, " . base64_encode(file_get_contents(
            'https://import.cdn.thinkific.com/232268/5Hr9yJteQ2GL7RT9YC5w_logo.svg'));
        
        
        
       

        
        
        //(object)array('filter-bounds'=>'mu-equal-to-1');


        if ($widget->getParameter('skipConsitencyCheck', false)) {
			$export->skipConsistencyCheck();
		}

		$filterRowFn = trim($widget->getParameter('filterRowScript'));
		if (!empty($filterRowFn)) {

			$export->withRowFilterFn((new \core\UserFunction())->createResultFunction(array('record', 'index'), $filterRowFn));

		}

		$filterFieldsFn = trim($widget->getParameter('filterFieldsScript'));

		if (!empty($filterFieldsFn)) {
			$export->withFieldFilter((new \core\UserFunction())->createResultFunction(array('fieldFormat'), $filterFieldsFn));
		}

		$formatFieldsFn = trim($widget->getParameter('formatFieldsScript'));

		if (!empty($formatFieldsFn)) {
			$export->withFieldFormatFn((new \core\UserFunction())->createResultFunction(array('fields'), $formatFieldsFn));
		}

		$formatRowFn = trim($widget->getParameter('formatRowScript'));

		if (!empty($formatRowFn)) {
			$export->withRowFormatFn((new \core\UserFunction())->createResultFunction(array('record', 'index'), $formatRowFn));
		}

		if (key_exists('filter', $json)) {

			//error_log('add attribute filter');

			$filter = $json->filter;
			if ((!empty($filter)) && is_string($filter)) {

				if ($results = (new \attributes\FilterLink())->getFilterLink($filter)) {
					$export->withAttributeFilter(json_decode($results[0]->filter));
				}

			}
		}

// 		$formatExporterScript = trim($widget->getParameter('formatExporterScript'));

// 		if (!empty($formatExporterScript)) {
// 			//error_log('add export script');
// 			$formatExporterScript = (new \core\UserFunction())->createResultFunction(array('exporter', 'json'), $formatExporterScript);
// 			$formatExporterScript($export, $json);
// 		}



        //$regionMap=array();
        $regionUnitMap=array();

        GetPlugin('Maps');
        
        $markerUnits=array();
        
        
        (new \spatial\TableExport())
            ->addSpatialBoundsExportFilter($export, $json)
            ->onMatchedBoundsFilter(function($feature, $boundaryObject) use(&$regionUnitMap,&$markerUnits){
                
                if(!isset($regionUnitMap[$boundaryObject['name']])){
                    $regionUnitMap[$boundaryObject['name']]=0;
                }
                $regionUnitMap[$boundaryObject['name']]+=1.0;
                
                $markerUnits['_'.$feature['id']]=$boundaryObject['name'];
                
               // error_log('matched: '.$feature['title'].' - '.$boundaryObject['name']);
            });
           
        $markers=$export->toArray();   
         
        asort($regionUnitMap);
        $regionUnitMap=array_reverse($regionUnitMap, true);
           
         $total=count($regionUnitMap); 
         $variables->regionCounters=$regionUnitMap;
         
         
         $colors=array_reverse(array(
            '#8c510a',
            '#bf812d',
            '#dfc27d',
            '#f6e8c3',
            '#f5f5f5',
            '#c7eae5',
            '#80cdc1',
            '#35978f',
            '#01665e'
        ));
        
        $_colors=$colors;
        
        
        $regionUnitMap=array_map(function($v)use($total, &$colors, $_colors){
            if(count($colors)==0){
                $colors=$_colors;
            }
            return array('color'=>array_shift($colors), 'value'=>$v/$total);
        }, $regionUnitMap);


        $variables->regionData=$regionUnitMap;
         


        $years=array();
        $months=array();
        
        foreach($markers as $marker){
            
            $createdDate=$marker['created date'];
            
            $year=substr($createdDate, 0,4);
            
            if(!isset($years[$year])){
                $years[$year]=0;
            }
            $years[$year]+=1.0;
            
            $month=substr($createdDate, 5,2);
            
            if(!isset($months[$month])){
                $months[$month]=0;
            }
            $months[$month]+=1.0;
            
            
        }
        
        ksort($years);
        ksort($months);

        $variables->years=$years;
        $variables->months=$months;
        
      
        
        $markers=array_map(function($marker)use($markerUnits){
            

            
            $marker['tileUrl']=HtmlDocument()->website().'/php-core-app/core.php?iam=administrator'.
            '&format=raw&controller=plugins&view=plugin&plugin=Maps&pluginView=mapitem.icon'.
            '&size=100&mapitem='.$marker['id'];
            
            
             $marker['mu']='unknown mu';
            if(isset($markerUnits['_'.$marker['id']])){
                $marker['mu']=$markerUnits['_'.$marker['id']];
            }
            
            return $marker;
        }, $markers);
        
        
        $data=array();
        
        foreach($markers as $marker){
            $title=$marker['title'];
            $title=explode(' - ', $title);
            
            if(count($title)<2){
                $title=trim($title[0]);
                $title=str_replace('Report', '', $title);
                
                if(!isset($data[$title])){
                    $title='Other';
                }
                
                
            }else{
                $title=array_pop($title);
                $title=str_replace('Report', '', $title);
                $title=trim($title);
            }
            
            if(empty($title)){
                $title='Other';
            }
            
            
            
            if(!isset($data[$title])){
                $data[$title]=0;
            }
             $data[$title]+=1.0;
            
        }
        
        asort($data);
        $data=array_reverse($data, true);
        
        $total=count($markers);
        
        $variables->counters=$data;
        
        $colors=array_reverse(array(
            '#f7fcfd',
            '#e5f5f9',
            '#ccece6',
            '#99d8c9',
            '#66c2a4',
            '#41ae76',
            '#238b45',
            '#006d2c',
            '#00441b'
        ));
        
        $_colors=$colors;
        
        
        $data=array_map(function($v)use($total, &$colors, $_colors){
            if(count($colors)==0){
                $colors=$_colors;
            }
            return array('color'=>array_shift($colors), 'value'=>$v/$total);
        }, $data);


        $variables->data=$data;

        require_once('/var/www/html/app.geolive/vendor/autoload.php');

        $donut = new \Fundevogel\Donut(
            array_values($data),
            8
        );
        
        $donut->setSize(100);
        
      
        
        $svg = $donut->render();//Image(300,300);
        
    //     ob_start();
    //     imagepng($svg);
    //     $svgdata=ob_get_contents();
	   // ob_end_clean();

        error_log($svg);
       $variables->chart="data://image/svg;base64," . base64_encode($svg);



		return array_merge(get_object_vars($variables), array('results' => $markers));


return $variables;