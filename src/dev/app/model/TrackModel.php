<?php

/**
 * @author Top - Chrudos Vorlicek <chrudos.vorlicek@gmail.com>
 * @author Michal Odcházel <michal.odchazel@litea.cz>
 */
class TrackModel extends BaseModel
{
	/**
	 * Base filter on table
	 * @return \Nette\Database\Table\Selection
	 */
	public function baseFilter()
	{
		return parent::baseFilter();
	}
}
