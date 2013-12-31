<?php

/**
 * @author Top - Chrudos Vorlicek <chrudos.vorlicek@gmail.com>
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
	
	public function saveTrack($data)
	{
		$data['the_geom'] = `ST_GeomFromText("` . $data->the_geom . `","900913")`;
		$data['created'] = 'now()';
		$this->insert($data);
	}
}
