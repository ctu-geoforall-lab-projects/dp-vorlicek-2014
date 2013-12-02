<?php

use Nette\Application\UI\Form;
/**
 * Homepage presenter.
 */
class HomepagePresenter extends BasePresenter
{
	private $itemsPerPage = 20;
	
	public function renderDefault()
	{
		$news = $this->context->createNewsModel()->getTable();
		$news->order('created DESC');
		
		$vp = $this["vp"];
		$paginator = $vp->getPaginator();

		$paginator->itemsPerPage = $this->itemsPerPage;
		$paginator->itemCount = $news->count();
		$news->limit($paginator->itemsPerPage, $paginator->offset);
		$this->template->news = $news;
	}

	public function createComponentAddNewsForm()
	{
		$form = new Form();
		$form->addHidden('email')
				->setAttribute('class', 'element-invisible')
				->addRule(~$form::FILLED);
		$form->addTextArea('note', 'Aktualita:')
				->setRequired()
				->setAttribute('class', 'inputTextArea');
		$form->addSubmit('save', 'Uložit')
				->setAttribute('class','btn');
		$form->onSuccess[] = $this->onAddNewsFormSuccess;
		return $form;
	}

	public function onAddNewsFormSuccess($form)
	{
		$visitingUser = $this->getUser()->getIdentity();

		if ($visitingUser->role == 'admin') {
			$data = $form->getValues();
			if ($data->email == null) {
				unset($data['email']);
				$data['user_id'] = $visitingUser->id;
				$data['created'] = 'NOW()';
				$this->context->createNewsModel()->insert($data);
				$this->flashMessage('Aktualita byla přidána.', 'success');
				$this->redirect('Homepage:');
			} else {
				$this->redirect('Homepage:');
			}
		} else {
			$this->flashMessage('Nemáte potřebná oprávnění.', 'error');
			$this->redirect('Homepage:');
		}
	}

}
