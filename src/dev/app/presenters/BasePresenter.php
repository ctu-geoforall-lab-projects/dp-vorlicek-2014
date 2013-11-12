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
				$this->redirect('Homepage:default');
			} else {
				$this->redirect('Homepage:default');
			}
		}
		if (!$this->context->emailer->getParent()) { // workaround for "Component '' already has a parent."
			$this->context->emailer->setParent($this);
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

	public function createComponentEmailer()
	{
		return new \VisualPaginator();
	}

	public function createComponentShoutboard()
	{
		return new \Shoutboard($this->context->createShoutboardModel(), $this->user);
	}

}
