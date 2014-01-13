<?php

/**
 * @author Top - Chrudos Vorlicek <chrudos.vorlicek@gmail.com>
 */
class TrackReviewModel extends BaseModel
{
	/**
	 * Base filter on table
	 * @return \Nette\Database\Table\Selection
	 */
	public function baseFilter()
	{
		return parent::baseFilter();
	}
	
	public function getTrackReview($trackId)
	{
		return $this->getTable()->where('track_id',$trackId);
	}
}
