<?php

use Nette\Application\UI\Form;

/**
 * Description of track presenter for adding and presenting tracks and pictures
 * @author	Chrudos Vorlicek
 * @email	<chrudos.vorlicek@gmail.com>
 * @link	http://topovo.php5.cz
 */
class TrackPresenter extends BasePresenter
{
	//-------RENDERS------------
	//seznam tras
	public function renderDefault()
	{
		//$tracks = $this->context->createTrackModel()->getTable();
	}

	// přidat trasu
	public function renderAddTrack()
	{
		$visitingUser = $this->getUser();
		if ($visitingUser->isInRole('guest')) {
			$this->flashMessage('Na požadovanou akci nemáte dostatečné oprávnění.', 'error');
			$this->redirect('Homepage:');
		} else {
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
	}
	
	public function renderTrack($id)
	{
		if($id == null){
			$this->flashMessage("Neplatný odkaz", "error");
			$this->redirect("Track:default");
		}
		$this->template->track=$this->context->createTrackModel()->get(array('id' => $id));
	}

	public function renderDetail($id)
	{
		$this->template->track = $this->context->createTrackModel()->get(array('id' => $id));
		$this->template->trackReviews = $this->context->createTrackReviewModel()->getTrackReview($id);
	}

	public function renderAddReview($id)
	{
		$visitingUser = $this->getUser();
		if ($visitingUser->isInRole('guest')) {
			$this->flashMessage('Na požadovanou akci nemáte dostatečné oprávnění.', 'error');
			$this->redirect('Homepage:');
		}
	}

	//galerie
	public function renderGalery()
	{
		
	}

	//přidání fotky
	public function renderAddPhoto()
	{
		$visitingUser = $this->getUser();
		if ($visitingUser->isInRole('guest')) {
			$this->flashMessage('Na požadovanou akci nemáte dostatečné oprávnění.', 'error');
			$this->redirect('Homepage:');
		}
	}

	//-------COMPONENTS-----------
	public function createComponentTracksGrid($name)
	{
		$grid = new Grido\Grid($this, $name);
		$grid->setFilterRenderType(\Grido\Components\Filters\Filter::RENDER_INNER);
		$grid->setModel($this->context->createTrackModel()->getTable());
		$users = array(null => '- Nerozhoduje -');
		$users = array_merge($users, $this->context->userModel->getTable()->fetchPairs('id', 'name'));

		$grid->addColumn('name', 'Trasa')
				->setSortable()
				->setFilter();
		$grid->addColumn('length', 'Délka [km]')
				->setSortable()
				->setCustomRender(function($item){
						return number_format($item->length/1000, 3, ',', ' ');
					});
		$grid->addColumn('created', 'Vytvořeno')
				->setSortable()
				->setCustomRender(function($item) {
					return $item->created->format("d.m.Y H:i");
				});
		$grid->addColumn('user_id', 'Přidal')
				->setSortable()
				->setCustomRender(function($item) {
					return $item->ref('users', 'user_id')->name;
				})
				->setFilterSelect($users);

		$grid->addColumn('note', 'Poznámka')
				->setFilter();
		$grid->addAction('detail', 'Detail');
		$grid->getAction('detail')->elementPrototype->class[] = 'btn-info';
	}

	public function createComponentAddTrackReviewForm()
	{
		$params = $this->getParameter();
		$visitingUser = $this->getUser();
		$form = new Form();
		$form->addHidden('track_id', $params['id']);
		$form->addHidden('user_id', $visitingUser->id);
		$form->addTextArea('review', 'Článek: ')
				->setRequired('Nelze odeslat prázdné pole.');
		$form->addSubmit('save', 'Uložit')->setAttribute('class', 'btn');
		$form->onSuccess[] = $this->onAddTrackReviewFormSuccess;
		return $form;
	}

	public function onAddTrackReviewFormSuccess(Form $form)
	{
		$data = $form->getValues();
		$track = $this->context->createTrackModel()->get(array('id' => $data->track_id));
		$data['created'] = 'NOW()';
		$notice = array('user_id' => $data->user_id,
			'note' => 'Byl přidán článek k trase ' . $track->id . ' - ' . $track->name . '.',
			'created' => 'now()');
		$this->context->createTrackReviewModel()->insert($data);
		$this->context->createNewsModel()->insert($notice);
		$this->flashMessage('Článek byl přidán.', 'success');
		$this->redirect('Track:default');
	}
	
	public function createComponentAddTrackForm(){
		$visitingUser = $this->getUser();
		$form = new Form();
		$form->addHidden('user_id',$visitingUser->id);
		$form->addText('name','Jméno trasy: ')
				->setRequired('Vyplňte jméno.')
				->setAttribute('class','input-medium');
		$form->addTextArea('the_geom','Geometrie:')
				->setRequired('Zadejte minimálně dva body.')
				->setAttribute('class', 'inputTextAreaTrack');
		$form->addTextArea('note','Cíle:')
				->setAttribute('class', 'inputTextAreaTrack');		
		$form->addSubmit('save', 'Uložit')->setAttribute('class', 'btn');
		$form->onSuccess[] = $this->onAddTrackFormSuccess;
		return $form;
	}
	
	public function onAddTrackFormSuccess($form){
		$data = $form->getValues();
	}
}
