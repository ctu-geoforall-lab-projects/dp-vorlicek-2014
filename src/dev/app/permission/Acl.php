<?php

use Nette\Security\Permission;

/**
 * Description of Acl
 *
 * @author Pavel
 */
class Acl extends Permission
{

	function __construct()
	{
		$this->addRole("guest");
		$this->addRole("user", "guest");
		$this->addRole("admin", "user");

		$this->addResource("HomepagePresenter");
		$this->addResource("MapPresenter");
		$this->addResource("SignPresenter");
		
		$this->allow("guest", "HomepagePresenter", Permission::ALL);
		$this->allow("guest",'SignPresenter',  Permission::ALL);
		$this->allow("guest", "MapPresenter", Permission::ALL);
	}

}

