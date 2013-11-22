<?php

use Nette\Application\UI\Control;
use Nette\Mail\IMailer;
use Nette\Mail\Message;
use Nette\Mail\SendmailMailer;

/**
 * Email sender extending the Control class to employ the Latte templates.
 *
 * @author   Litea Solution s.r.o <info@litea.cz>
 * @link     www.litea.cz
 */
class Emailer extends Control
{

	/** @var array */
	public $attachments = array();

	/** @var string */
	protected $defaultFromEmail;

	/** @var string */
	protected $defaultToEmail;

	/** @var IMailer */
	protected $mailer;

	public function __construct($defaultFromEmail, $defaultToEmail = NULL)
	{
		$this->defaultFromEmail = $defaultFromEmail;
		$this->defaultToEmail = $defaultToEmail;
		$this->mailer = new SendmailMailer();
	}

	public function getTemplateFilePath($templateFileName)
	{
		return dirname(__FILE__) . '/templates/' . $templateFileName . '.latte';
	}

	public function send($templateFileName, $subject, $toEmail = NULL, $fromEmail = NULL, $htmlBody = NULL)
	{
		$message = new Message();
		if ($fromEmail === NULL) {
			$fromEmail = $this->defaultFromEmail;
		}
		if (($toEmail === NULL) || ($this->presenter->context->parameters["environment"] != "production")) {
			$toEmail = $this->defaultToEmail; // don't spam the real e-mails when in the development or testing mode
		}
		if (is_string($toEmail)) {
			$message->addTo($toEmail);
		} elseif (is_array($toEmail)) {
			foreach ($toEmail as $email) {
				$message->addTo($email);
			}
		}
		foreach ($this->attachments as $attachment) {
			$message->addAttachment($attachment);
		}

		$this->template->htmlBody = ($htmlBody !== NULL ? nl2br($htmlBody) : NULL);
		$this->template->subject = $subject;
		$this->template->setFile($this->getTemplateFilePath($templateFileName));
		$message->setFrom($fromEmail)
				->setSubject($subject)
				->setHtmlBody($this->template);
		$this->mailer->send($message);

		return $this->template;
	}

}
