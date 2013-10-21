<?php

/**
 * Base presenter for all application presenters.
 * @author	Chrudos Vorlicek
 * @email	<chrudos.vorlicek@gmail.com>
 * @link	http://topovo.php5.cz
 */
abstract class BasePresenter extends Nette\Application\UI\Presenter
{	
	protected function startup()
	{
		$user = $this->getUser();
		if (!$user->isAllowed($this->reflection->name, $this->getAction())) {
			if (!$user->isLoggedIn()) {
				$this->flashMessage('Musíte se přihlásit', 'error');
				$this->redirect(':Admin:Base:');
			} else {
				$this->flashMessage('Na předešlou akci nemáte pravomoce', 'error');
				$this->redirect(':Admin:Main:');
			}
		}
		//$this->registerHelpers();
		parent::startup();
	}
	
	protected function beforeRender()
	{
		if ($this->user->isLoggedIn()) {
			$this->template->name = $this->getUser()->getIdentity()->name;
		}
		parent::beforeRender();
	}

	
	public function createComponentVp()
	{
		return new \VisualPaginator();
	}

}
