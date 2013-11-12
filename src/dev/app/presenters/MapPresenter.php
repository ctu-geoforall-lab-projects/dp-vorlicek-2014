<?php

/**
 * Description of map presenter
 * @author	Chrudos Vorlicek
 * @email	<chrudos.vorlicek@gmail.com>
 * @link	http://topovo.php5.cz
 */
class MapPresenter extends BasePresenter {

	/**
	 * render Map Window
	 */
	public function renderDefault()
	{
		$params = $this->getHttpRequest()->getQuery();
		if($params == null){
			$params = array('zoom' => 8,
				'lon' => 1725452.10706,
				'lat' => 6415161.17028
					);
		}
		$this->template->params = $params;
	}
	
}
