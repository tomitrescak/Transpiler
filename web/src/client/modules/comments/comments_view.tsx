import React from 'react';
import Markdown from '../core/containers/markdown_container';
import { Comments, Comment, Text, Button, IButton } from 'semanticui-react';

//////////////////////////////////////////////////////////////////////////////
// Comments Component                                                      //
//////////////////////////////////////////////////////////////////////////////

declare global {
  export interface ICommentable {
    _id?: string;
    comments?: ICommentDAO[];
  }
}

interface IContainerProps {
//  owner: ICommentable;
}

export interface IComponentActions {
  addComment(e: React.SyntheticEvent, text: string): void;
}

export interface IComponentProps {
  owner: ICommentable;
  context: IContext;
}

interface IComponent extends IContainerProps, IComponentProps, IComponentActions { }

let commentItem: ICommentDAO;
let index: number;

const CommentsView = ({ context, owner, addComment }: IComponent) => (
  <div>
    <Comments commentPlaceholder="comments.canUseMarkdown"
      addButtonText="comments.addComment"
      addComment={addComment}
      previewButtonText="preview"
      previewComment={(commentText: string) => context.Utils.Ui.showMarkdownModal(commentText, 'comment') }
      >
      <Choose>
        <When condition={owner.comments.length}>
          <For each="commentItem" index="index" of={owner.comments}>
            <CommentView key={index} comment={commentItem} context={context} />
          </For>
        </When>
        <Otherwise>
          <Text text="comments.noComments" />
        </Otherwise>
      </Choose>
    </Comments>
  </div>
);

//////////////////////////////////////////////////////////////////////////////
// Comment Component                                                      //
//////////////////////////////////////////////////////////////////////////////

function avatar(comment: ICommentDAO) {
  return '/images/avatars/' + (comment.senderAvatar ? (comment.senderAvatar + '.png') : 'Default.png');
}

interface ICommentProps {
  comment: ICommentDAO;
  context: IContext;
}

const CommentView = ({ comment, context }: ICommentProps) => (
  <Comment
    image={avatar(comment)}
    author={comment.senderName}
    date={context.Utils.Ui.relativeDate(comment.sent)}>
    <Markdown text={comment.message} />
  </Comment>
);

export default CommentsView;
