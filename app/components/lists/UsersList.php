<?php

namespace App\Components\Lists;

use Nette\Application\UI\Control;

class UsersList extends Control {

	private $registrationModel;

	public function __construct( $parent, $name, $registrationModel ) {
		$this->registrationModel = $registrationModel;
	}

	public function render() {
		$this->template->registerHelper('twitterize', array( 'App\Components\Helpers', 'twitterize'));
		$this->template->registerHelper('biggerTwitterPicture', array( 'App\Components\Helpers', 'biggerTwitterPicture'));
		$this->template->setFile( __DIR__ . '/templates/usersList.latte');
		$users = $this->registrationModel->getConferrees();
		$this->template->users = $users->toArray();
		$this->template->usersCount = count($this->template->users);
		$this->template->currentUser = $this->getPresenter()->getUser();
		$this->template->render();
	}
}