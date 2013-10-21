<?php

class FacebookAuthenticator {

	/** @var UserModel */
	private $userModel;

	public function __construct(UserModel $userModel) {
		$this->userModel = $userModel;
	}

	public function getUserModel() {
		return clone $this->userModel;
	}

	/**
	 * @param array $fbUser
	 * @return \Nette\Security\Identity
	 */
	public function authenticate(array $fbUser) {

		$user = $this->getUserModel()->findUser(array('fbuid' => $fbUser['id']))->fetch();

		if ($user) {
			$user = $this->updateMissingData($user, $fbUser);
		} else {
			$catch = FALSE;
			try {
				$user = $this->register($fbUser);
			} catch (\PDOException $exc) {
				throw $exc;
				$catch = TRUE;
			}
			if ($catch) {
				throw new \FacebookApiException(NULL);
			}
		}

		return $this->userModel->createIdentity($user);
	}

	public function findUser(array $me) {
		$this->userModel->insert(array(
			'email' => $me['email'],
			'fbuid' => $me['id'],
			'name' => $me['name'],
		));
	}

	public function register(array $me) {
		$passwd_salt = 'fbAuth';
		$passwd = PasswordAuthenticator::calculateSHA256("traktorzetor", $passwd_salt);

		$this->userModel->insert(array(
			'passwd' => $passwd,
			'passwd_salt' => $passwd_salt,
			'email' => $me['email'],
			'fbuid' => $me['id'],
			'name' => $me['name']
		));
		return $this->userModel->findUser(array('fbuid' => $me['id']));
	}

	public function updateMissingData($user, array $me) {
		$updateData = array();

		if (empty($user['name'])) {
			$updateData['name'] = $me['name'];
		}

		if (empty($user['fbuid'])) {
			$updateData['name'] = $me['id'];
		}

		if (!empty($updateData)) {
			$this->userModel->update($updateData, $user->id);
			//$this->userModel->updateUser($user, $updateData);
		}
		return $user;
	}

}
