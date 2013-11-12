<?php

use \Nette\Application\UI;

/**
 * Description of Shoutboard
 * @author Top - Chrudos Vorlicek
 */
class Shoutboard extends UI\Control
{

	/** @var \model\Shoutboard */
	private $shoutboardModel;
	private $itemsPerPage = 20;

	/** @var Nette\Security\User */
	private $user;

	/**
	 * @param model\Shoutboard $shoutboard
	 * @param \Nette\Security\Identity|NULL $user
	 */
	public function __construct(ShoutboardModel $shoutboard, Nette\Security\User $user)
	{
		parent::__construct(); // vždy je potřeba volat rodičovský konstruktor
		$this->shoutboardModel = $shoutboard;
		$this->user = $user;
	}

	public function render()
	{
		$vp = $this["vp"];
		$paginator = $vp->getPaginator();

		$paginator->itemsPerPage = $this->itemsPerPage;
		$paginator->itemCount = $this->shoutboardModel->count();

		$this->shoutboardModel->limit($paginator->itemsPerPage, $paginator->offset);
		$this->shoutboardModel->order("posted DESC");

		$this->template->discusion = $this->shoutboardModel->baseFilter();
		$this->template->setFile(dirname(__FILE__) . '/template.latte');
		$this->template->render();
	}

	/**
	 * @return \Nette\Application\UI\Form
	 */
	public function createComponentSendingForm()
	{
		$form = new UI\Form;

		if($this->user->isLoggedIn()){
			$user = $this->user->getIdentity();
			$form->addHidden("user_id")
					->setDefaultValue($user->id);
			$form->addText("name", "Jméno: ")
					->setDefaultValue($user->name)
					->setDisabled()
					->setRequired("Zadejte jméno.");
		} else {
			$form->addText("name", "Jméno: ")
					->setRequired("Zadejte jméno.");
		}
		
		$form->addHidden("email")
				->setAttribute('class', 'element-invisible')
				->addRule(~$form::FILLED);
		$form->addTextArea("message", "Vzkaz: ", 25, 5)
				->setRequired("Zadejte vzkaz.");
		$form->addSubmit("save", "Odeslat")
				->setAttribute('class', 'btn');
		$form->onSuccess[] = $this->saveMessage;

		return $form;
	}

	/**
	 * Threatment data from Shoutboard::createComponentSendingForm()
	 * @param UI\Form $form
	 */
	public function saveMessage(UI\Form $form)
	{
		$data = $form->getValues();
		unset($data->email);
		if($this->user->isLoggedIn()){
			$data->name = $this->user->getIdentity()->name;
		}
		$this->shoutboardModel->insert($data);
		$this->presenter->flashMessage("Vzkaz byl uložen");
		$this->redirect("this");
	}

	/**
	 * @return \VisualPaginator
	 */
	public function createComponentVp()
	{
		return new VisualPaginator();
	}

}

