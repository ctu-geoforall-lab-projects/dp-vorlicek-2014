<?php

use Nette\Security\Permission;

/**
 * Description of Acl
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
		$this->addResource("UserPresenter");
		$this->addResource("ShoutboardPresenter");
		$this->addResource("TrackPresenter");
		
		$this->allow("guest", "HomepagePresenter", Permission::ALL);
		$this->allow("guest", "SignPresenter",  Permission::ALL);
		$this->allow("guest", "MapPresenter", array("default","about"));
		$this->allow("guest", "ShoutboardPresenter", Permission::ALL);
		$this->allow("guest", "UserPresenter",array("registration","passwdReset","feedback"));
		$this->allow("guest", "TrackPresenter",array("default","galery","detail"));
		
		$this->allow("user", "UserPresenter", array("setting","osmAssign"));
		$this->allow("user", "MapPresenter", array("editMap"));
		$this->allow("user", "TrackPresenter",array("addTrack","addPhoto","addReview"));
	}

}

