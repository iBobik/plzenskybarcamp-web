<?php

namespace App\Presenters;

use Nette,
	App\Model;


/**
 * Base presenter for all application presenters.
 */
abstract class BasePresenter extends Nette\Application\UI\Presenter
{

	public function beforeRender() {
		$this->template->isDevelop = $this->getContext()->getService("developFlag")->isDevelop();
	}

}
