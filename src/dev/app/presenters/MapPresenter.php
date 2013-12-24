<?php

/**
 * Description of map presenter
 * @author	Chrudos Vorlicek
 * @email	<chrudos.vorlicek@gmail.com>
 * @link	http://topovo.php5.cz
 */
class MapPresenter extends BasePresenter
{
	/**
	 * render Map Window
	 */
	public function renderDefault()
	{
		$this->template->visitingUser = $this->getUser()->getIdentity();
		$params = $this->getHttpRequest()->getQuery();
		if ($params == null) {
			$params = array('zoom' => 8,
				'lon' => 1725452.10706,
				'lat' => 6415161.17028
			);
		}
		$this->template->params = $params;
	}

	/**
	 * open window with editation tool (if possible it will be iD editor)
	 */
	public function renderEditMap()
	{
		$visitingUser = $this->getUser();
		if ($visitingUser->isInRole('guest')) {
			$this->flashMessage('Na požadovanou akci nemáte dostatečné oprávnění.', 'error');
			$this->redirect('Homepage:');
		}
		$this->template->visitingUser =$this->getUser()->getIdentity()->osm_account;
	}
}
