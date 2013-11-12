<?php

use Nette\Application\UI\Form;

/**
 * Sign in/out presenters.
 */
class SignPresenter extends BasePresenter {

	public function actionOut() {
		$this->getUser()->logout();
		$this->flashMessage('You have been signed out.');
		$this->redirect('in');
	}

	public function actionIn() {
		// facebook
		$fbUrl = $this->context->facebook->getLoginUrl(array(
			'scope' => 'email,publish_actions',
			'redirect_uri' => $this->link('//fbLogin'), // absolute
		));
		$this->template->fbUrl = $fbUrl;
	}

	public function actionFbLogin() {
		$me = $this->context->facebook->api('/me');
		$identity = $this->context->facebookAuthenticator->authenticate($me);

		$this->getUser()->login($identity);
		$this->redirect('Homepage:');
	}

	/**
	 * Sign-in form factory.
	 * @return Nette\Application\UI\Form
	 */
	protected function createComponentSignInForm() {
		$form = new Form;
		$form->addText('email', 'E-mail:')
				->setRequired('Zadejte email.')
				->addRule(Form::EMAIL, 'Zadaný e-mail je v nespravném tvaru.')
				->setAttribute('placeholder', 'vas.email@nejaky.host')
				->setAttribute('autofocus', 'on');
		$form->addHidden('mail', 'prazdne pole')->setAttribute(!Form::FILLED); // bots protection;
		$form->addPassword('passwd', 'Heslo:')
				->setRequired('Zadejte heslo.')
				->setAttribute('placeholder', 'heslo');
		$form->addCheckbox('remember', 'Pamatuj si mě.');
		$form->addSubmit('send', 'Přihlásit')
				->setAttribute('class', 'btn');
		$form->onSuccess[] = $this->onSignInFormSuccess;
		return $form;
	}

	public function onSignInFormSuccess($form) {
		$values = $form->getValues();

		if ($values->remember) {
			$this->getUser()->setExpiration('14 days', FALSE);
		} else {
			$this->getUser()->setExpiration('20 minutes', TRUE);
		}

		try {
			$this->getUser()->login($values->email, $values->passwd);
			$this->redirect('Homepage:');
		} catch (Nette\Security\AuthenticationException $e) {
			$form->addError($e->getMessage());
		}
	}

}
