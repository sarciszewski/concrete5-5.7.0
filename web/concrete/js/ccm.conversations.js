(function(e,t){"use strict";e.extend(e.fn,{ccmconversation:function(t){return this.each(function(){var r=e(this),i=r.data("ccmconversation");i||r.data("ccmconversation",i=new n(r,t))})}});var n=function(e,t){this.publish("beforeInitializeConversation",{element:e,options:t});this.init(e,t);this.publish("initializeConversation",{element:e,options:t})};n.fn=n.prototype={publish:function(e,n){n=n||{};n.CCMConversation=this;t.ccm_event.publish(e,n)},init:function(n,r){var i=this;i.$element=n;i.options=e.extend({method:"ajax",paginate:!1,displayMode:"threaded",itemsPerPage:-1,activeUsers:[],uninitialized:!0},r);var s=i.options.posttoken!=""?1:0,o=i.options.paginate?1:0,u=i.options.orderBy,a=i.options.enableOrdering,f=i.options.displayPostingForm,l=i.options.insertNewMessages,c=i.options.enableCommentRating;if(i.options.method=="ajax")e.post(CCM_TOOLS_PATH+"/conversations/view_ajax",{cnvID:i.options.cnvID,cID:i.options.cID,blockID:i.options.blockID,enablePosting:s,itemsPerPage:i.options.itemsPerPage,paginate:o,displayMode:i.options.displayMode,orderBy:u,enableOrdering:a,displayPostingForm:f,insertNewMessages:l,enableCommentRating:c},function(e){var n=t.obj;t.obj=i;i.$element.empty().append(e);t.obj=n;i.attachBindings();i.publish("conversationLoaded")});else{i.attachBindings();i.finishSetup();i.publish("conversationLoaded")}},mentionList:function(t,n,r){var i=this;if(!n)return;i.dropdown.parent.css({top:n.y,left:n.x});if(t.length==0){i.dropdown.handle.dropdown("toggle");i.dropdown.parent.remove();i.dropdown.active=!1;i.dropdown.activeItem=-1;return}i.dropdown.list.empty();t.slice(0,20).map(function(t){var n=e("<li/>"),s=e("<a/>").appendTo(n).text(t.getName());s.click(function(){ccm_event.fire("conversationsMentionSelect",{obj:i,item:t},r)});n.appendTo(i.dropdown.list)});if(!i.dropdown.active){i.dropdown.active=!0;i.dropdown.activeItem=-1;i.dropdown.parent.appendTo(i.$element);i.dropdown.handle.dropdown("toggle")}i.dropdown.activeItem>=0&&i.dropdown.list.children().eq(i.dropdown.activeItem).addClass("active")},attachBindings:function(){var t=this;if(t.options.uninitialized){t.options.uninitialized=!1;ccm_event.bind("conversationsMention",function(e){t.mentionList(e.eventData.items,e.eventData.coordinates||!1,e.eventData.bindTo||t.$element.get(0))},t.$element.get(0));t.dropdown={};t.dropdown.parent=e("<div/>").css({position:"absolute",height:0,width:0});t.dropdown.active=!1;t.dropdown.handle=e("<a/>").appendTo(t.dropdown.parent);t.dropdown.list=e("<ul/>").addClass("dropdown-menu").appendTo(t.dropdown.parent);t.dropdown.handle.dropdown();ccm_event.bind("conversationsTextareaKeydownUp",function(e){t.dropdown.activeItem==-1&&(t.dropdown.activeItem=t.dropdown.list.children().length);t.dropdown.activeItem-=1;t.dropdown.activeItem+=t.dropdown.list.children().length;t.dropdown.activeItem%=t.dropdown.list.children().length;t.dropdown.list.children().filter(".active").removeClass("active").end().eq(t.dropdown.activeItem).addClass("active")},t.$element.get(0));ccm_event.bind("conversationsTextareaKeydownDown",function(e){t.dropdown.activeItem+=1;t.dropdown.activeItem+=t.dropdown.list.children().length;t.dropdown.activeItem%=t.dropdown.list.children().length;t.dropdown.list.children().filter(".active").removeClass("active").end().eq(t.dropdown.activeItem).addClass("active")},t.$element.get(0));ccm_event.bind("conversationsTextareaKeydownEnter",function(e){t.dropdown.list.children().filter(".active").children("a").click()},t.$element.get(0));ccm_event.bind("conversationPostError",function(t){var n=t.eventData.form,r=t.eventData.messages,i="";e.each(r,function(e,t){i+=t+"<br>"});n.find("div.ccm-conversation-errors").html(i).show()});ccm_event.bind("conversationSubmitForm",function(e){e.eventData.form.find("div.ccm-conversation-errors").hide()})}var n=t.options.paginate?1:0,r=t.options.posttoken!=""?1:0;t.$replyholder=t.$element.find("div.ccm-conversation-add-reply");t.$newmessageform=t.$element.find("div.ccm-conversation-add-new-message form");t.$deleteholder=t.$element.find("div.ccm-conversation-delete-message");t.$attachmentdeleteholder=t.$element.find("div.ccm-conversation-delete-attachment");t.$messagelist=t.$element.find("div.ccm-conversation-message-list");t.$messagecnt=t.$element.find(".ccm-conversation-message-count");t.$postbuttons=t.$element.find("button[data-submit=conversation-message]");t.$sortselect=t.$element.find("select[data-sort=conversation-message-list]");t.$loadmore=t.$element.find("[data-load-page=conversation-message-list]");t.$messages=t.$element.find("div.ccm-conversation-messages");t.$messagerating=t.$element.find("span.ccm-conversation-message-rating");t.$messagescore=2;t.$newmessageform.dropzone&&t.$newmessageform.dropzone({url:CCM_TOOLS_PATH+"/conversations/add_file",success:function(n,r){var i=JSON.parse(r);if(!i.error)e('div[rel="'+i.tag+'"] form.main-reply-form').append('<input rel="'+i.timestamp+'" type="hidden" name="attachments[]" value="'+i.id+'" />');else{var s=e('.preview.processing[rel="'+i.timestamp+'"]').closest("form");t.handlePostError(s,[i.error]);e('.preview.processing[rel="'+i.timestamp+'"]').remove();s.children(".ccm-conversation-errors").delay(3e3).fadeOut("slow",function(){e(this).html("")})}},sending:function(n,r,i){e(n.previewTemplate).attr("rel",(new Date).getTime());i.append("timestamp",e(n.previewTemplate).attr("rel"));i.append("tag",e(t.$newmessageform).parent("div").attr("rel"))},init:function(){this.on("complete",function(t){e(".preview.processing").click(function(){e('input[rel="'+e(this).attr("rel")+'"]').remove();e(this).remove()})})}});t.$element.on("click","button[data-submit=conversation-message]",function(){t.submitForm(e(this));return!1});var i=1;t.$element.on("click","a[data-toggle=conversation-reply]",function(n){n.preventDefault();e(".preview.processing").each(function(){e('input[rel="'+e(this).attr("rel")+'"]').remove();e(this).remove()});e(".ccm-conversation-attachment-container").each(function(){e(this).is(":visible")&&e(this).toggle()});var r=t.$replyholder.appendTo(e(this).closest("div[data-conversation-message-id]"));r.attr("data-form","conversation-reply").show();r.find("button[data-submit=conversation-message]").attr("data-post-parent-id",e(this).attr("data-post-parent-id"));i<2&&r.find(".dropzone").dropzone({url:CCM_TOOLS_PATH+"/conversations/add_file",success:function(n,r){var i=JSON.parse(r);if(!i.error)e('div[rel="'+i.tag+'"] form.main-reply-form').append('<input rel="'+i.timestamp+'" type="hidden" name="attachments[]" value="'+i.id+'" />');else{var s=e('.preview.processing[rel="'+i.timestamp+'"]').closest("form");t.handlePostError(s,[i.error]);e('.preview.processing[rel="'+i.timestamp+'"]').remove();s.children(".ccm-conversation-errors").delay(3e3).fadeOut("slow",function(){e(this).html("")})}},sending:function(n,r,i){e(n.previewTemplate).attr("rel",(new Date).getTime());i.append("timestamp",e(n.previewTemplate).attr("rel"));i.append("tag",e(t.$newmessageform).parent("div").attr("rel"))},init:function(){this.on("complete",function(t){e(".preview.processing").click(function(){e('input[rel="'+e(this).attr("rel")+'"]').remove();e(this).remove()})})}});r.attr("rel","newReply"+i);i++;return!1});e(".ccm-conversation-attachment-container").hide();e(".ccm-conversation-add-new-message .ccm-conversation-attachment-toggle").click(function(t){t.preventDefault();e(".ccm-conversation-add-reply .ccm-conversation-attachment-container").is(":visible")&&e(".ccm-conversation-add-reply .ccm-conversation-attachment-container").toggle();e(".ccm-conversation-add-new-message .ccm-conversation-attachment-container").toggle()});e(".ccm-conversation-add-reply .ccm-conversation-attachment-toggle").click(function(t){t.preventDefault();e(".ccm-conversation-add-new-message .ccm-conversation-attachment-container").is(":visible")&&e(".ccm-conversation-add-new-message .ccm-conversation-attachment-container").toggle();e(".ccm-conversation-add-reply .ccm-conversation-attachment-container").toggle()});t.$element.on("click","a[data-submit=delete-conversation-message]",function(){var n=e(this);t.$deletedialog=t.$deleteholder.clone();t.$deletedialog.dialog?t.$deletedialog.dialog({modal:!0,dialogClass:"ccm-conversation-dialog",title:t.$deleteholder.attr("data-dialog-title"),buttons:[{text:t.$deleteholder.attr("data-cancel-button-title"),"class":"btn pull-left",click:function(){t.$deletedialog.dialog("close")}},{text:t.$deleteholder.attr("data-confirm-button-title"),"class":"btn pull-right btn-danger",click:function(){t.deleteMessage(n.attr("data-conversation-message-id"))}}]}):confirm("Remove this message? Replies to it will not be removed.")&&t.deleteMessage(n.attr("data-conversation-message-id"));return!1});t.$element.on("click","a[data-submit=flag-conversation-message]",function(){var n=e(this);confirm("Are you sure you want to flag this messge as spam?")&&t.flagMessage(n.attr("data-conversation-message-id"));return!1});e("a.attachmentDelete").click(function(){var n=e(this);t.$attachmentdeletetdialog=t.$attachmentdeleteholder.clone();t.$attachmentdeletetdialog.dialog?t.$attachmentdeletetdialog.dialog({modal:!0,dialogClass:"ccm-conversation-dialog",title:t.$attachmentdeletetdialog.attr("data-dialog-title"),buttons:[{text:t.$attachmentdeleteholder.attr("data-cancel-button-title"),"class":"btn pull-left",click:function(){t.$attachmentdeletetdialog.dialog("close")}},{text:t.$attachmentdeleteholder.attr("data-confirm-button-title"),"class":"btn pull-right btn-danger",click:function(){t.deleteAttachment(n.attr("rel"))}}]}):confirm("Remove this message? Replies to it will not be removed.")&&t.deleteAttachment(n.attr("rel"));return!1});t.$element.on("change","select[data-sort=conversation-message-list]",function(){t.$messagelist.load(CCM_TOOLS_PATH+"/conversations/view_ajax",{cnvID:t.options.cnvID,task:"get_messages",cID:t.options.cID,blockID:t.options.blockID,enablePosting:r,displayMode:t.options.displayMode,itemsPerPage:t.options.itemsPerPage,paginate:n,orderBy:e(this).val(),enableOrdering:t.options.enableOrdering,displayPostingForm:displayPostingForm,insertNewMessages:insertNewMessages,enableCommentRating:t.options.enableCommentRating},function(e){t.$replyholder.appendTo(t.$element);t.attachBindings()})});t.$element.on("click","[data-load-page=conversation-message-list]",function(){var n=parseInt(t.$loadmore.attr("data-next-page")),i=parseInt(t.$loadmore.attr("data-total-pages")),s={cnvID:t.options.cnvID,cID:t.options.cID,blockID:t.options.blockID,itemsPerPage:t.options.itemsPerPage,displayMode:t.options.displayMode,enablePosting:r,page:n,orderBy:t.$sortselect.val(),enableCommentRating:t.options.enableCommentRating};e.ajax({type:"post",data:s,url:CCM_TOOLS_PATH+"/conversations/message_page",success:function(e){t.$messages.append(e);n+1>i?t.$loadmore.hide():t.$loadmore.attr("data-next-page",n+1)}})});t.$element.on("click",".conversation-rate-message",function(){t.$messagerating.load(CCM_TOOLS_PATH+"/conversations/rate");var n={cnvID:t.options.cnvID,cID:t.options.cID,blockID:t.options.blockID,cnvMessageID:e(this).closest("[data-conversation-message-id]").attr("data-conversation-message-id"),cnvRatingTypeHandle:e(this).attr("data-conversation-rating-type")};e.ajax({type:"post",data:n,url:CCM_TOOLS_PATH+"/conversations/rate",success:function(e){}})})},handlePostError:function(e,t){if(!t)var t=["An unspecified error occurred."];this.publish("conversationPostError",{form:e,messages:t})},deleteMessage:function(n){var r=this;r.publish("conversationBeforeDeleteMessage",{msgID:n});var i=[{name:"cnvMessageID",value:n}];e.ajax({type:"post",data:i,url:CCM_TOOLS_PATH+"/conversations/delete_message",success:function(t){var i=e("div[data-conversation-message-id="+n+"]");i.length&&i.after(t).remove();r.updateCount();r.$deletedialog.dialog&&r.$deletedialog.dialog("close");r.publish("conversationDeleteMessage",{msgID:n})},error:function(e){r.publish("conversationDeleteMessageError",{msgID:n,error:arguments});t.alert("Something went wrong while deleting this message, please refresh and try again.")}})},flagMessage:function(n){var r=this;r.publish("conversationBeforeFlagMessage",{msgID:n});var i=[{name:"cnvMessageID",value:n}];e.ajax({type:"post",data:i,url:CCM_TOOLS_PATH+"/conversations/flag_message",success:function(t){var i=e("div[data-conversation-message-id="+n+"]");i.length&&i.after(t).remove();r.updateCount();r.publish("conversationFlagMessage",{msgID:n})},error:function(e){r.publish("conversationFlageMessageError",{msgID:n,error:arguments});t.alert("Something went wrong while flagging this message, please refresh and try again.")}})},addMessageFromJSON:function(n,r){var i=this;i.publish("conversationBeforeAddMessageFromJSON",{json:r,form:n});var s=i.options.posttoken!=""?1:0,o=[{name:"cnvMessageID",value:r.cnvMessageID},{name:"enablePosting",value:s},{name:"displayMode",value:i.options.displayMode},{name:"enableCommentRating",value:i.options.enableCommentRating}];e.ajax({type:"post",data:o,url:CCM_TOOLS_PATH+"/conversations/message_detail",success:function(s){var o=e("div[data-conversation-message-id="+r.cnvMessageParentID+"]");if(o.length){o.after(s);i.$replyholder.appendTo(i.$element);i.$replyholder.hide()}else{i.options.insertNewMessages=="bottom"?i.$messages.append(s):i.$messages.prepend(s);i.$element.find(".ccm-conversation-no-messages").hide()}i.publish("conversationAddMessageFromJSON",{json:r,form:n});i.updateCount();t.location="#cnvMessage"+r.cnvMessageID}})},deleteAttachment:function(n){var r=this;r.publish("conversationBeforeDeleteAttachment",{cnvMessageAttachmentID:n});var i=[{name:"cnvMessageAttachmentID",value:n}];e.ajax({type:"post",data:i,url:CCM_TOOLS_PATH+"/conversations/delete_file",success:function(t){var i=JSON.parse(t);console.log(i);e('p[rel="'+i.attachmentID+'"]').fadeOut(300,function(){e(this).remove()});if(r.$attachmentdeletedialog.dialog){r.$attachmentdeletedialog.dialog("close");r.publish("conversationDeleteAttachment",{cnvMessageAttachmentID:n})}},error:function(e){r.publish("conversationDeleteAttachmentError",{cnvMessageAttachmentID:n,error:arguments});t.alert("Something went wrong while deleting this attachment, please refresh and try again.")}})},updateCount:function(){var e=this;e.publish("conversationBeforeUpdateCount");e.$messagecnt.load(CCM_TOOLS_PATH+"/conversations/count_header",{cnvID:e.options.cnvID},function(){e.publish("conversationUpdateCount")})},submitForm:function(t){var n=this;n.publish("conversationBeforeSubmitForm");var r=t.closest("form");t.prop("disabled",!0);r.parent().addClass("ccm-conversation-form-submitted");var i=r.serializeArray(),s=t.attr("data-post-parent-id");i.push({name:"token",value:n.options.posttoken},{name:"cnvID",value:n.options.cnvID},{name:"cnvMessageParentID",value:s});e.ajax({dataType:"json",type:"post",data:i,url:CCM_TOOLS_PATH+"/conversations/add_message",success:function(e){if(!e){n.handlePostError(r);return!1}if(e.error){n.handlePostError(r,e.messages);return!1}n.addMessageFromJSON(r,e);n.publish("conversationSubmitForm",{form:r,response:e})},error:function(e){n.handlePostError(r);return!1},complete:function(e){t.prop("disabled",!1);r.parent().closest(".ccm-conversation-form-submitted").removeClass("ccm-conversation-form-submitted")}})},tool:{setCaretPosition:function(e,t){if(e!=null)if(e.createTextRange){var n=e.createTextRange();n.move("character",t);n.select()}else if(e.selectionStart){e.focus();e.setSelectionRange(t,t)}else e.focus()},getCaretPosition:function(e){if(e.selectionStart)return e.selectionStart;if(document.selection){e.focus();var t=document.selection.createRange();if(t==null)return 0;var n=e.createTextRange(),r=n.duplicate();n.moveToBookmark(t.getBookmark());r.setEndPoint("EndToStart",n);return r.text.length}return 0},testMentionString:function(e){return/^@[a-z0-9]+$/.test(e)},getMentionMatches:function(e,t){return t.filter(function(t){return t.indexOf(e)>=0})},isSameConversation:function(e,t){return e.options.blockID===t.options.blockID&&e.options.cnvID===t.options.cnvID},MentionUser:function(e){this.getName=function(){return e}}}}})(jQuery,window);(function(e){var t={init:function(t){return e.each(e(this),function(t,n){e(this).find(".ccm-conversation-attachment-container").each(function(){e(this).is(":visible")&&e(this).toggle()})})}};e.fn.ccmconversationattachments=function(n){if(t[n])return t[n].apply(this,Array.prototype.slice.call(arguments,1));if(typeof n=="object"||!n)return t.init.apply(this,arguments);e.error("Method "+n+" does not exist on jQuery.tooltip")}})(jQuery);(function(e){var t={init:function(t){this.options=e.extend({title:"Add Topic",buttonTitleCancel:"Cancel",buttonTitlePost:"Post",dialogWrapper:"ccm-discussion-form"},t);var n=this;return e.each(e(this),function(t,r){var i=e(this);i.$postbutton=i.find("[data-action=add-conversation]");i.$postdialog=i.find("div[data-dialog-form=add-conversation]");i.options=n.options;i.$postbutton.on("click",function(){i.$postdialog.dialog({width:620,height:550,modal:!0,dialogClass:"ccm-discussion-dialog-post",title:n.options.title,open:function(){e(".ccm-discussion-form").ccmconversationattachments()},buttons:[{text:n.options.buttonTitleCancel,"class":"btn pull-left",click:function(){e(this).dialog("close")}},{text:n.options.buttonTitlePost,"class":"btn pull-right btn-primary",id:"ccm-discussion-dialog-post-btn",click:function(){i.ccmdiscussion("submitForm")}}]});return!1});var s=i.data("ccmdiscussion");s||i.data("ccmdiscussion",i)})},getForm:function(){var t=this;return e("."+t.options.dialogWrapper+" form[data-form=discussion-form]")},triggerError:function(t){var n=this,r="";if(!t)r="An unspecified error occurred.";else for(i=0;i<t.length;i++)r+=t[i]+"<br/>";var s=n.ccmdiscussion("getForm").find(".ccm-conversation-errors");s.html(r).show();s.delay(3e3).fadeOut("slow",function(){e(this).html("")})},submitForm:function(t){var n=this,r=n.ccmdiscussion("getForm").serializeArray(),i=this.options.posttoken?this.options.posttoken:"";r.push({name:"cParentID",value:this.options.cParentID},{name:"ctID",value:this.options.ctID},{name:"token",value:i});e("#ccm-discussion-dialog-post-btn").prop("disabled",!0);e.ajax({dataType:"json",type:"post",data:r,url:CCM_TOOLS_PATH+"/conversations/discussion/add_conversation",success:function(e){if(!e){n.ccmdiscussion("triggerError");return!1}if(e.error){n.ccmdiscussion("triggerError",e.messages);return!1}},error:function(e){n.ccmdiscussion("triggerError");return!1},complete:function(t){e("#ccm-discussion-dialog-post-btn").prop("disabled",!1)}})}};e.fn.ccmdiscussion=function(n){if(t[n])return t[n].apply(this,Array.prototype.slice.call(arguments,1));if(typeof n=="object"||!n)return t.init.apply(this,arguments);e.error("Method "+n+" does not exist on jQuery.tooltip")}})(jQuery);