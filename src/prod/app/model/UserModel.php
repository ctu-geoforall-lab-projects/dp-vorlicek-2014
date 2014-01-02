<?php

use \Nette\Database\Table\ActiveRow;
use \Nette\Security\Identity;

/**
 * Model for operation with the users data.
 * @author Chrudos Vorlicek <chrudos.vorlicek@gmail.com>
 * @author Michal Odcházel <michal.odchazel@litea.cz>
 */
class UserModel extends \BaseModel {

	/**
	 * Creates and returns a new user with the given data.
	 * @param array   data for the new user
	 * @return ActiveRow
	 * @throws DuplicateEmailException
	 * @throws PDOException
	 */
	public function addUser($data) {
		$existingUser = $this->getTable()->where("email", $data["email"]);
		if (count($existingUser)) {
			throw new DuplicateEmailException;
		}
		$data["passwd_salt"] = mt_rand();
		$data["passwd"] = PasswordAuthenticator::calculateSHA256($data["passwd"], $data["passwd_salt"]);
		$user = $this->insert($data);
		return $user;
	}

	/**
	 * Creates and returns a new user identity with the data from the given ActiveRow of a user.
	 * @param ActiveRow $user user with the data for the new identity
	 * @return Identity
	 */
	public function createIdentity(ActiveRow $user) {
		return new Identity($user->id, $user->role, $user->toArray());
	}

	/**
	 * Changes the password of the user with the given id to the given clear password using the given salt.
	 * @param string $clearPassword	new password in clear (not hashed) form
	 * @param string $salt			salt used for the password hash calculation
	 * @param int $id				user id
	 * @return string				new password hash
	 */
	public function changePassword($clearPassword, $salt, $id) {
		$newPassword = PasswordAuthenticator::calculateSHA256($clearPassword, $salt);
		$this->update(array("passwd" => $newPassword), $id);
		return $newPassword;
	}

	/**
	 * @param array $array	array of values for where condition
	 * @return \Nette\Database\Table\Selection
	 */
	public function findUser($array) {
		return $this->getTable()->where($array);
	}

}
