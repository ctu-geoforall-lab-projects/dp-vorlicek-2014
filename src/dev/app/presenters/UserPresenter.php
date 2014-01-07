<?php

use Nette\Application\UI\Form;

/**
 * Description of user presenter
 * @author	Chrudos Vorlicek
 * @email	<chrudos.vorlicek@gmail.com>
 * @link	http://topovo.php5.cz
 */
class UserPresenter extends BasePresenter
{

	/**
	 * render register form
	 */
	public function renderRegister()
	{
		
	}

	public function renderSetting($id)
	{
		$editedUser = $this->context->userModel->get($id);
		$this['settingManagerForm']->setDefaults($editedUser);
	}

	public function renderFeedback()
	{
		$visitingUser = $this->getUser()->getIdentity();
		if ($visitingUser != NULL) {
			$this['feedbackForm']->setDefaults(array("user_id" => $visitingUser->id,
				"liame" => $visitingUser->email,
				"name" => $visitingUser->name));
		}
	}

	/**
	 * register Form
	 */
	public function createComponentRegistrationForm()
	{
		$form = new Form();
		$form->addHidden('email')->setAttribute(!Form::FILLED); //bot filter
		$form->addText('liame', 'E-mail:')
				->addRule(Form::EMAIL)
				->setRequired("Je požadován e-mail");
		$form->addPassword('passwd', 'Heslo:')
				->addRule(Form::MIN_LENGTH, "Heslo musí mít minimálně 6 znaků.", 6)
				->setRequired("Vložte heslo.");
		$form->addPassword('passwd_again', 'Heslo:')
				->addRule(Form::EQUAL, "Hesla se musí shodovat.", $form['passwd'])
				->setRequired("Vložte znova heslo.");
		$form->addText('name', 'Uživatelské jméno:')
				->setRequired("Vložte uživatelské jméno.");
		$form->onSuccess[] = $this->onRegistrationFormSuccess;
		$form->addSubmit('register', 'Registrovat')
				->setAttribute('class', 'btn');

		return $form;
	}

	public function onRegistrationFormSuccess($form)
	{
		$data = $form->getValues();

		$save = array(
			'email' => $data->liame,
			'passwd' => $data->passwd,
			"name" => $data->name,
		);
		$email  = $save['email'];
		$passwd = $save['passwd'];

		try {
			$this->context->userModel->addUser($save);
			$this->getUser()->login($email,$passwd);
			$this->flashMessage("Účet byl vytvořen.", "success");
			$this->flashMessage("Uživatel byl přihlášen.", "success");			
			$this->redirect("Homepage:");
		} catch (DuplicateEmailException $e) {
			$this->flashMessage("Uživatel se zadaným e-mailem již existuje.", "error");
			$this->redirect("User:registration");
		}
	}

	//Send mail with new password
	public function createComponentResetPasswdForm()
	{
		$form = new Form();
		$form->addHidden('email')->setAttribute(!Form::FILLED); //bot filter
		$form->addText('liame', 'E-mail:')
				->addRule(Form::EMAIL)
				->setRequired("Je požadován e-mail");
		$form->onSuccess[] = $this->onResetPasswdFormSuccess;
		$form->addSubmit('send', 'Resetovat heslo')
				->setAttribute('class', 'btn');
		return $form;
	}

	public function onResetPasswdFormSuccess($form)
	{
		$data = $form->getValues();
		$existingUser = $this->context->userModel->findUser(array('email' => $data->liame))->fetch();
		if ($existingUser) {
			$passwd = PasswordAuthenticator::randomStringGenerator(16);
			$this->context->userModel->changePassword($passwd, $existingUser->passwd_salt, $existingUser->id);

			$this->context->emailer->template->passwd = $passwd;
			$this->context->emailer->template->email = $data->liame;
			$this->context->emailer->send("passwordChange", "Nové heslo", $data->liame);

			$this->flashMessage("Nové heslo bylo úspěšně odesláno.", "success");
			$this->redirect("Homepage:default");
		} else {
			$this->flashMessage('Uživatel se zadaným mailem nebyl nalezen.', 'error');
			$this->redirect('Homepage:default');
		}
	}

	public function createComponentChangePasswordForm()
	{
		$form = new Form();
		$form->addHidden("id", $this->getParameter("id"));
		$form->addPassword("pass_old", "Staré heslo")
				->setRequired("Musíte zadat staré heslo.");
		$form->addPassword("pass", "Nové heslo:")
				->setRequired("Musíte zadat nové heslo.");
		$form->addPassword("pass_check", "Ověření hesla:")
				->setRequired("Musíte zadat ověření hesla.")
				->addRule(Form::EQUAL, "Hesla se musí shodovat.", $form["pass"]);
		$form->addSubmit("saveChangePassword", "Změnit heslo")
				->setAttribute("class", "btn btn-dismiss-alerts");
		$form->onSuccess[] = $this->onChangePasswordFormSuccess;
		return $form;
	}

	public function onChangePasswordFormSuccess($form)
	{
		$data = $form->getValues();
		$userId = $data->id;
		$editedUser = $this->context->userModel->findUser(array("id" => $userId))->fetch();
		$oldPasswdHash = PasswordAuthenticator::calculateSHA256($data->pass_old, $editedUser->passwd_salt);

		if ($oldPasswdHash == $editedUser->passwd) {
			$newPasswdHash = PasswordAuthenticator::calculateSHA256($data->pass, $editedUser->passwd_salt);
			$this->context->userModel->update(array('passwd' => $newPasswdHash), $userId);
			$this->flashMessage("Změna hesla proběhla úspěšně.", "success");
			$this->redirect('this', $userId);
		} else {
			$this->flashMessage("Zadané heslo neodpovídá starému.", "error");
			$this->redirect('this', $userId);
		}
	}

	public function createComponentSettingManagerForm()
	{
		$form = new Form();
		$form->addText('name', 'Jméno:')
				->setRequired();
		$form->addTextArea('about', "Informace o uživateli:");
		$form->addSubmit('save', 'Uložit')
				->setAttribute("class", "btn");
		$form->onSuccess[] = $this->onSettingManagerFormSuccess;
		return $form;
	}

	public function onSettingManagerFormSuccess($form)
	{
		$userId = $this->getParameter("id");
		$data = $form->getValues();
		$this->context->userModel->update($data, $userId);
		$this->flashMessage('Informace byly uloženy.', "success");
		$this->redirect('Homepage:default');
	}

	public function createComponentFeedbackForm()
	{
		$form = new Form();
		$form->addHidden('user_id');
		$form->addHidden('email')->setAttribute(!Form::FILLED); //bot filter
		$form->addText('liame', 'E-mail pro odpověď:')
				->addRule(Form::EMAIL)
				->setRequired("Je požadován e-mail");
		$form->addText('name', 'Jméno:')
				->setRequired("Je požadováno jméno");
		$form->addTextArea('message', 'Zpráva:')
				->setRequired("Zadejte popis problému či návrhu.");
		$form->addSubmit('save', 'Poslat')
				->setAttribute("class", "btn");
		$form->onSuccess[] = $this->onFeedbackFormSuccess;
		return $form;
	}

	public function onFeedbackFormSuccess($form)
	{
		$data = $form->getValues();
		$this->context->emailer->template->userId = $data->user_id;
		$this->context->emailer->template->name = $data->name;
		$this->context->emailer->template->email = $data->liame;
		$this->context->emailer->template->message = $data->message;

		$this->context->emailer->send("feedback", "Toulavej - hlášení chyby", "chrudos.vorlicek@gmail.com");

		$this->flashMessage("Upozornění bylo odesláno", "success");
		$this->redirect("Homepage:default");
	}

}
