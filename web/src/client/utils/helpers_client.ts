import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import marked from 'marked';
import config from '../configs/config';
import sAlert from 'react-s-alert';
import swal from 'sweetalert';
import { mf } from '../configs/i18n';

import store from '../configs/store';
import { push } from 'react-router-redux';

export const RouterUtils = {
  encodeUrlName(name: string): string {
    let result = name.replace(/\:/g, '');
    result = result.replace(/ - /g, '-');
    result = result.replace(/\W/g, '-');
    return result.replace(/--/g, '-');
  },
  go(route: string) {
    store.dispatch(push(route));
  }
};

/////////////////////////////////////////////////////////////////////////////
// UI Utils                                                                //
/////////////////////////////////////////////////////////////////////////////

declare global {
  interface IError {
    error: string | number;
    reason?: string;
    details?: string;
  }

  interface IAsyncCallback {
    (error: IError, result: any): void;
  }

  interface ISaveable {
    save(callback?: IAsyncCallback): void;
  }
}

let saveableObject: ISaveable;
let saveCallback: Function;

const saveListener = function(e: KeyboardEvent) {
  if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
    e.preventDefault();
    if (saveCallback) {
      saveCallback();
    }
    /* tslint:disable */
    saveableObject.save(UiUtils.announceSaved());
    /* tslint:enable */
  }
};

export const UiUtils = {
  datePicker(elem: Element, context: any, field: string) {
    $(elem).pickadate({
      format: 'dd mmm yyyy',
      onSet: function(value: any) {
        context[field] = new Date(value.select);
      }
    });
  },
  niceDate(date: Date) {
    if (date) {
      return moment(date).format('DD MMM YYYY');
    }
    return '';
  },
  fullDate(date: Date) {
    if (date) {
      return moment(date).format('DD MMM YYYY, HH:mm');
    }
    return '';
  },
  relativeDate(date: Date) {
    if (date) {
      return moment(date).fromNow();
    }
    return '';
  },
  previewMarkdown(text: string, length: number): string {
    if (!text) {
      return '';
    }

    if (length == null) {
      length = text.length;
    }

    let html = marked(text);
    let regex = /(<([^>]+)>)/ig;
    html = html.replace(regex, '');

    // find a good cutoff position
    while (html[length] !== ' ' && length < html.length) {
      length++;
    }

    html = html.substring(0, length + 1);
    html = html.replace(/(\r|\n)/, ' ');

    // remove all double spaces
    while (html.indexOf('  ') >= 0) {
      html = html.replace(/  /g, ' ');
    }

    // add elipsis
    if (text.length > length) {
      html += '...';
    }

    return html;
  },
  hResize(lDiv: JQuery, rDiv: JQuery, marker: JQuery) {
    return function(e: MouseEvent) {
      let minLeft = lDiv.position().left + 50;
      let maxRight = rDiv.position().left + rDiv.width() - 50;
      if (e.clientX > minLeft && e.clientX < maxRight) {
        lDiv.css('right', (((window.innerWidth - e.clientX) / window.innerWidth) * 100) + '%');
        rDiv.css('left', ((e.clientX / window.innerWidth) * 100) + '%');
        marker.css('left', ((e.clientX / window.innerWidth) * 100) + '%');
      }
    };
  },
  pageTransition() {
    $('html, body').animate({ scrollTop: 0 }, 400);
    $('#main').hide().fadeIn(1000);
  },
  removeSaveListener() {
    document.removeEventListener('keydown', saveListener);
  },
  registerSaveListener(obj: ISaveable, saveFunction?: Function) {
    saveableObject = obj;
    saveCallback = saveFunction;

    // TODO: ApplicationState.editor = obj;
    UiUtils.removeSaveListener();
    document.addEventListener('keydown', saveListener, false);

    throw new Error("not implemented")
  },
  alert(text: string, params?: Object) {
    sAlert.success(text, params);
  },
  announce(infoText: string, errorText: string, callback?: Meteor.AsyncCallback): Meteor.AsyncCallback {
    return (error: Meteor.Error, value: any) => {
      if (error) {
        if (error.reason != null || error.details != null) {
          sAlert.error(mf(errorText) + ': ' + (error.reason ? error.reason : error.details), { type: 'error' });
        } else {
          sAlert.error(error.toString());
        }
      } else {
        sAlert.success(mf(infoText));
      }

      if (callback) {
        callback(error, value);
      }
    };
  },
  announceCreated(callback?: Meteor.AsyncCallback): Meteor.AsyncCallback {
    return UiUtils.announce('info.createSuccess', 'info.createError', callback); // mf('info.createSuccess', ''); mf('info.createError', '');
  },
  announceSaved(callback?: Meteor.AsyncCallback): Meteor.AsyncCallback {
    return UiUtils.announce('info.saveSuccess', 'info.saveError', callback); // mf('info.saveSuccess', ''); mf('info.saveError', '');
  },
  announceDeleted(callback?: Meteor.AsyncCallback): Meteor.AsyncCallback {
    return UiUtils.announce('info.deleted', 'info.deleteFailed', callback); // mf('info.deleted', ''); mf('info.deleteFailed', '');
  },
  announceDuplicated(callback?: Meteor.AsyncCallback): Meteor.AsyncCallback {
    return UiUtils.announce('info.duplicated', 'info.duplicateFailed', callback); // mf('info.duplicated', ''); mf('info.duplicateFailed', '');
  },
  showMarkdownModal(raw: string, header?: string): void {
    let html = marked(raw);
    html = html.replace(/<table/g, '<table class=\'ui striped table\'');

    // now fill in the data
    $('#previewModalHeader').html(header ? (header[0] === '?' ? mf(header) : header) : mf('description'));

    let content = raw[0] === '?' ? mf(html) : html;
    content = UiUtils.parseText(content);

    $('#previewModalContent').html(content);
    $('#previewModal').modal('show');

    setTimeout(function() {
      $('#previewModal').modal('refresh');
    }, 1000);
  },
  alertDialog(title: string, text: string, type = 'error') {
    swal(mf(title), mf(text), type);
  },
  confirmDialog(text: string,
    callback: Function,
    title = 'areYouSure',
    confirmButtonText = 'deleteIt',
    type = 'warning',
    closeOnConfirm = true) {
    swal({
      title: mf(title),
      text: mf(text),
      type: type,
      showCancelButton: true,
      confirmButtonText: mf(confirmButtonText),
      closeOnConfirm: closeOnConfirm,
      html: false
    }, function() {
      callback();
    });
  },
  deletedDialog() {
    swal(mf('deleted'), mf('recordDeleted'), 'success');
  },
  relativeResize(lDiv: JQuery, rDiv: JQuery, marker: JQuery, boardViewModel: any) {
    return function(e: MouseEvent) {

      let left = lDiv.offset().left;
      let relativeWindow = window.innerWidth - left;
      let relativePosition = e.clientX - left;
      let minLeft = left + 150;
      let maxRight = window.innerWidth - 300;

      if (e.clientX > minLeft && e.clientX < maxRight) {
        lDiv.css('width', ((relativePosition / relativeWindow) * 100) + '%');
        rDiv.css('width', (((relativeWindow - relativePosition) / relativeWindow) * 100) + '%');
        marker.css('left', ((relativePosition / relativeWindow) * 100) + '%');
        if (boardViewModel) {
          boardViewModel.checkDrawBoard();
        }
      }
      throw new Error('has to change!');
    };
  },
  parseText(text: string) {
    return text.replace(/img src='/g, 'img src=\'' + config.S3Bucket);
  }
};

/////////////////////////////////////////
// SYSTEM UTILS                        //
/////////////////////////////////////////

export const ClassUtils = {
  indexArray(arr: any[]): any[] {
    if (arr.length === 0) {
      return arr;
    }

    if (typeof arr[0] === 'string') {
      let arr1 = <any>[];
      for (let i = 0; i < arr.length; i++) {
        arr1.push({ value: arr[i], index: i, nextIndex: i + 1 });
      }
      return arr1;
    } else {
      for (let i = 0; i < arr.length; i++) {
        arr[i].index = i;
        arr[i].nextIndex = i + 1;
      }
    }

    return arr;
  },
  find<T>(obj: Object, callback: (elem: T) => boolean): T {
    let props = Object.getOwnPropertyNames(obj);
    for (let prop of props) {
      if (callback(obj[prop])) {
        return obj[prop];
      }
    }
    return null;
  }
};
