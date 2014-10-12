<?php defined('C5_EXECUTE') or die('Access denied.'); ?>

<div class="alert alert-info">
    <h4><?php echo t('Twitter Login Configuration'); ?></h4>
    <p><?php echo t('<a href="%s" target="_blank">Click here</a> to obtain your access keys.', 'https://apps.twitter.com/'); ?></p>
    <p><?php echo t('Check the box labeled "Allow this application to be used to Sign in with Twitter".'); ?></p>
    <p><?php echo t('Set the "Callback URL" to:%s.', ' <code>'.BASE_URL.DIR_REL.\URL::to('/system/authentication/twitter/callback').'</code>'); ?></p>
</div>

<div class='form-group'>
    <?=$form->label('apikey', t('Consumer Key (API Key)'))?>
    <?=$form->text('apikey', $apikey, array('autocomplete' => 'off'))?>
</div>
<div class='form-group'>
    <?=$form->label('apisecret', t('Consumer Secret (API Secret)'))?>
    <div class="input-group">
        <?=$form->password('apisecret', $apisecret, array('autocomplete' => 'off'))?>
        <span class="input-group-btn">
        <button id="showsecret" class="btn btn-warning" type="button"><?php echo t('Show API secret')?></button>
      </span>
    </div>
</div>

<script type="text/javascript">
    var button = $('#showsecret');
    button.click(function() {
        var apisecret = $('#apisecret');
        if(apisecret.attr('type') == 'password') {
            apisecret.attr('type', 'text');
            button.html('<?php echo addslashes(t('Hide API secret'))?>');
        } else {
            apisecret.attr('type', 'password');
            button.html('<?php echo addslashes(t('Show API secret'))?>');
        }
    });
</script>