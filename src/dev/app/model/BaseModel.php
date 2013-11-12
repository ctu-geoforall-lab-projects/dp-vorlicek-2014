<?php

/**
 * BaseModel for construct, insert, update, delete and get DB table row or rows
 *
 * @author Chrudoš Vorlíček <chrudos.vorlicek@gmail.com>
 * @author Michal Odcházel <michal.odchazel@litea.cz>
 */
abstract class BaseModel extends \Nette\Object
{
	/** @var \Nette\Database\Table\Selection */
	protected $table;
	
	/** @var int limit db select */
	protected $limit = NULL;
	protected $offset = NULL;
	
	/** @var string order in sql query */
	protected $order = NULL;

	function __construct(\Nette\Database\Table\Selection $table)
	{
		$this->table = $table;
	}

	/**
	 * @return \Nette\Database\Table\Selection
	 */
	public function getTable()
	{
		return clone $this->table;
	}

	/**
	 * @param int $key
	 * @return Nette\Database\Table\ActiveRow
	 */
	public function get($key)
	{
		return $this->getTable()->get($key);
	}

	/**
	 * @param array $data
	 * @return Nette\Database\Table\ActiveRow
	 */
	public function insert($data)
	{
		return $this->getTable()->insert($data);
	}

	/**
	 * @param array $data
	 * @param int $key
	 * @return int number of affected rows or FALSE in case of an error
	 */
	public function update($data, $key)
	{
		return $this->get($key)->update($data);
	}

	/**
	 * @param int $id
	 * @return int number of affected rows or FALSE in case of an error
	 */
	public function delete($id)
	{
		return $this->get($id)->delete();
	}
	
	/**
	 * @param int $limit
	 * @param int $offset
	 * @return \BaseModel
	 */
	public function limit($limit, $offset = NULL)
	{
		$this->limit = $limit;
		$this->offset = $offset;
		return $this;
	}

	/**
	 * @param string $order
	 * @return \BaseModel
	 */
	public function order($order)
	{
		$this->order = $order;
		return $this;
	}
	
	/**
	 * @return Nette\Database\Table\Selection
	 */
	protected function baseFilter()
	{
		$table = $this->getTable();
		
		if($this->order !== NULL){
			$table->order($this->order);
		}
		
		if($this->limit !== NULL){
			$table->limit($this->limit, $this->offset);
		}
		
		return $table;
	}
	
	/**
	 * Counts number of rows.
	 * @param string $column if it is not provided returns count of result rows, otherwise runs new sql counting query
	 * @return int
	 */
	public function count($column = NULL)
	{
		$table = $this->getTable();
		
		if($this->limit !== NULL){
			$table->limit($this->limit, $this->offset);
		}
		
		return $table->count($column);
	}

}
