registerForm = function(container, nextContainer) {
    $('#registration').on('click', container + ' .registration-button', function(e) {
        e.preventDefault();
        form = $('.form', container);
        nextForm = $('.form', nextContainer);
        if (form.is(':visible')) {
            form.hide();
            $.scrollTo(container);
        } else {
            nextForm.hide();
            form.show();
        }
    })
}

registerAjaxRegistration = function(container) {
    $(container).on('submit', 'form', function(e) {
        form = this;
        e.preventDefault();
        action = this.action;
        $('body').css('cursor', 'wait');
        $.ajax({
            type: 'POST',
            url: action,
            data: $(form).serialize()
        }).done(function(data) {
            if (data.redirect) {
                $.ajax({
                    type: "GET",
                    url: data.redirect
                }).done(function(data) {
                    $('body').css('cursor', 'auto');
                    container.html(data.html);
                    $.scrollTo(container);
                });
            }
        })
    })
}

ajaxPost = function(form) {
    return $.ajax({
        type: 'POST',
        url: form.get(0).action,
        data: form.serialize()
    }).promise();
}

validateForms = function(forms) {
    for (index in forms) {
        if (!Nette.validateForm(forms[index].get(0))) {
            return $.Deferred().reject().promise();
        }
    }
    return forms;
}

commitForms = function(forms) {
    commitForm = function(form) {
        return ajaxPost(form).then(function(res) {
            if (!res.updated) {
                return $.Deferred().reject('Během uloženi došlo k chybě').promise();
            }
            return 'Změny byly úspěšně uloženy';
        });
    }
    return $.when.apply($, forms.map(commitForm));
}

showMessage = function(container, elmClass) {
    return function(message) {
        if (message) {
            elm = $('<p class="' + elmClass + '">' + message + '</p>');
            container.html('').append(elm);
            $.scrollTo(container);
            setTimeout(function() {
                elm.hide();
            }, 5000);
        }
    }
}

registerAjaxProfileUpdate = function(talkOnButton, actionButton, userContainer, talkContainer) {
    talkOnButton.on('click', function() {
        if (!talkContainer.is(':visible')) {
            talkContainer.show();
        } else {
            talkContainer.hide();
        }
    })
    actionButton.on('click', function(e) {
        actionButton.get(0).disabled = true;
        forms = [$('form', userContainer)]
        if (talkContainer.is(":visible")) {
            forms.push($('form', talkContainer));
        }
        unLockSave = function(msg) {
            actionButton.get(0).disabled = false;
            return msg;
        }
        messageContainer = $('#messages', userContainer);
        $.when(validateForms(forms)).then(commitForms)
                .then(unLockSave, unLockSave)
                .done(showMessage(messageContainer, 'success'))
                .fail(showMessage(messageContainer, 'error'));
    });
}

registerVotes = function(container) {
    actionAdd = container.data( 'actionAdd' );
    actionRemove = container.data( 'actionRemove' );
    processSubmit = function(doAdded, talkId) {
        action = doAdded ? actionAdd : actionRemove;
        return $.ajax({
            type: 'GET',
            url: action,
            data: 'talkId=' + talkId
        }).promise().then(function(res){
            if ( res.votes_count >= 0 ) {
                return res.votes_count;
            }
            return $.Deferred().reject().promise();
        })
    }
    $('tr.talks-detail', container).each(function(index, elem){
        elem = $(elem);
        talkId = elem.data('id');
        $('.vote', elem).click((function(talkId){
            return function(e) {
                e.preventDefault();
                e.stopPropagation();
                box = this;
                processSubmit(box.checked, talkId).done(function(count){
                    $('.votes_count', elem).html(count);
                    box.checked = !box.checked;
                })
            }
        })(talkId));
    })
}

$(document).ready(function() {
    $('.tooltip').tooltipster();
    $('a').smoothScroll();
    registerForm('#speaker-regestration', '#user-regestration');
    registerForm('#user-regestration', '#speaker-regestration');
    registerAjaxRegistration($('#registration'));
    registerAjaxProfileUpdate($('#talk-registration'), $('#profile-save'), $('#user-form'), $('#talk-form'));
    registerVotes($('#talks-list'));
});
// window.fbAsyncInit = function() {
// 	FB.init({
// 		appId: '504432792996629',
// 		status: true,
// 		cookie: true,
// 		xfbml: true
// 	});

// 	FB.Event.subscribe('auth.authResponseChange', function(response) {
// 		if (response.status === 'connected') {
// 			console.log('Logged');
// 		} else if (response.status === 'not_authorized') {
// 			console.log('Not authorized');
// 		} else {
// 			console.log('Never logged');
// 		}
// 	});
// }

// function login() {
// 	FB.login(function(response) {

// 	}, {scope: 'email'});
// }

// $(function(){$('#login-buton').click(function(){login();return false;});});


$(document).ready(function() {
    var $listTableTr = $('.table-list tr');
    $listTableTr.on('click touchstart', function() {
        var _$this = $(this);
        if (_$this.hasClass('active')) {
            _$this.removeClass('active').find('.crop').removeClass('more');
        } else {
            $listTableTr.removeClass('active').find('.crop').removeClass('more');
            _$this.addClass('active').find('.crop').addClass('more');
        }
    });

    var $listTableTalks = $('.table-list#talks-list tr');
    $listTableTalks.on('click touchstart', function() {
        var
                _$this = $(this),
                _id = _$this.attr('data-id'),
                _$detailTrHead = $listTableTalks.parent().find('.talks-head'),
                _$detailTr = $listTableTalks.parent().find('.talks-detail'),
                _$detailTrHeadCurrent = $listTableTalks.parent().find('.talks-head[data-id="' + _id + '"]'),
                _$detailTrCurrent = $listTableTalks.parent().find('.talks-detail[data-id="' + _id + '"]');

        _$detailTr.hide();
        _$detailTrHead.show();

        if (_$this.hasClass('active-detail-head')) {
            _$detailTrHeadCurrent.show();
            _$detailTrCurrent.hide();
        } else {
            _$detailTrHeadCurrent.hide();
            _$detailTrCurrent.addClass('active-detail').show();
        }

        if (_$this.hasClass('active-detail')) {
            _$detailTrCurrent.hide();
            _$detailTrHeadCurrent.show();
        }
    });
});