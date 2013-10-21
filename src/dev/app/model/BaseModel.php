<?php

use \Nette\Database\Table\Selection;
use \Nette\Database\Table\ActiveRow;

/**
 *
 * @author   Chrudos Vorlicek 
 * @mail	<chrudos.vorlicek@gmail.com>
 */
abstract class BaseModel extends \Nette\Object {

	/**
	 * @var Selection
	 */
	protected $table;

	/**
	 * Creates a new base model using the given table.
	 * @param Selection $table
	 */
	function __construct(Selection $table) {
		$this->table = $table;
	}

	/**
	 * @return Selection
	 */
	public function getTable() {
		return clone $this->table;
	}

	/**
	 * @param int $key
	 * @return ActiveRow
	 */
	public function get($key) {
		return $this->getTable()->get($key);
	}

	/**
	 * @param array $data
	 * @return ActiveRow
	 */
	public function insert($data) {
		return $this->getTable()->insert($data);
	}

	/**
	 * @param array $data
	 * @param int $key
	 * @return int number of affected rows or FALSE in case of an error
	 */
	public function update($data, $key) {
		return $this->get($key)->update($data);
	}

	/**
	 * @param int $id
	 * @return int number of affected rows or FALSE in case of an error
	 */
	public function delete($id) {
		return $this->get($id)->delete();
	}

}
