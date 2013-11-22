<?php

use Nette\Security\AuthenticationException;

class PasswordAuthenticator extends Nette\Object implements \Nette\Security\IAuthenticator
{

	/** @var UserModel */
	private $userModel;

	public function __construct(UserModel $userModel)
	{
		$this->userModel = $userModel;
	}

	/**
	 * Performs an authentication
	 * @param array
	 * @return \Nette\Security\Identity
	 * @throws \Nette\Security\AuthenticationException
	 */
	public function authenticate(array $credentials)
	{
		list($mail, $password) = $credentials;
		$user = $this->userModel->getTable()->where('email', $mail)->fetch();

		if (!$user) {
			throw new AuthenticationException("Uživatel '$mail' nebyl nalezen.", self::IDENTITY_NOT_FOUND);
		}

		if (!$user->active) {
			throw new AuthenticationException("Máte deaktivovaný účet, kontaktujte administrátora.", self::NOT_APPROVED);
		} elseif ($user->attempts < 5) {
			if ($user->passwd !== self::calculateSHA256($password, $user->passwd_salt)) {
				$attempts = $user->attempts + 1;
				$this->userModel->update(array('attempts' => $attempts), $user->id);
				if ($attempts == 5) {
					throw new AuthenticationException("Špatné heslo. MÁTE POSLEDNÍ POKUS!", self::INVALID_CREDENTIAL);
				} else {
					throw new AuthenticationException("Špatné heslo.", self::INVALID_CREDENTIAL);
				}
			}
		} else {
			throw new AuthenticationException("Máte zablokovaný účet, kontaktujte administrátora.", self::NOT_APPROVED);
		}
		if($user->attempts != 0){
			$this->userModel->update(array('attempts' => 0), $user->id);
		}
		return $this->userModel->createIdentity($user);
	}

	/**
	 * Computes salted password hash.
	 * @param  string
	 * @return string
	 */
	public static function calculateHash($password)
	{
		return md5($password . str_repeat('*enter any random salt here*', 10));
	}

	/**
	 * Computes salted password hash SHA256 with salt.
	 * @param  string
	 * @param  string
	 * @return string
	 */
	public static function calculateSHA256($password, $salt)
	{
		return hash_hmac("sha256", $password, $salt);
	}

	/**
	 * Generated random string
	 * @param  int
	 * @return string
	 */
	public static function randomStringGenerator($lenght)
	{
		$chars = 'abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ.';
		$temp = '';
		$countChars = strlen($chars);
		for ($i = 0; $i < $lenght; $i++) {
			$temp .= $chars[mt_rand(0, $countChars - 1)];
		}
		return $temp;
	}

}