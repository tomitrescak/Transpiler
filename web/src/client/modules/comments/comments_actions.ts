import { mutation } from 'meteor/tomi:apollo-mantra';

export function insert(type: string, id: string, comment: string) {
  return {
    type,
    id,
    comment
  };
}

export function addComment(e: React.SyntheticEvent, context: IContext, query: string, variables: any, insertCallback: Function) {

  const button = $(e.currentTarget);

  // stop the original event
  e.preventDefault();

  if (!variables.comment) {
    context.Utils.Ui.alertDialog('comments.empty', 'error');
    return;
  }

  button.addClass('loading');

  return mutation({
    query,
    variables,
    thenCallback: (data: any) => {
      insertCallback(data);
      context.Utils.Ui.alert('comment.inserted');
    },
    errorCallback: () => context.Utils.Ui.alert('failed'),
    finalCallback: () => button.removeClass('loading')
  });
}
