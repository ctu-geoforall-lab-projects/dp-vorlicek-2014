<?php

/**
 * Description of map presenter
 * @author	Chrudos Vorlicek
 * @email	<chrudos.vorlicek@gmail.com>
 * @link	http://topovo.php5.cz
 */
class ShoutboardPresenter extends BasePresenter {

	public function renderDefault(){
		
	}
	
	public function createComponentShoutboard()
	{
		$user = $this->getUser();
		$shoutboardModel = $this->context->createShoutboardModel();
		$shoutboard = new \Shoutboard($shoutboardModel, $user);
		return $shoutboard;
	}
}