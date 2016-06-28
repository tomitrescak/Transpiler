import React from 'react';
import { Item, Button, Text, Label, Link } from 'semanticui-react';

//////////////////////////////////////////////////////////////////////////////
// PracticalItem Component                                                      //
//////////////////////////////////////////////////////////////////////////////

export interface IComponentProps {
  scheduleId: string;
  scheduleName: string;
  isAdmin: boolean;
  isVisible: boolean;
  canWrite: boolean;
  context: IContext;
  practical: IPracticalDAO;
}

export const PracticalItem = ({ canWrite, practical, context, scheduleId, scheduleName, isAdmin, isVisible }: IComponentProps) => {
  const { Utils, Config } = context;
  const { _id, name, description, image, createdBy, updatedAt } = practical;
  const e = Utils.Router.encodeUrlName;

  return (
    <Item.Main key={practical._id} image={image ? (Config.S3Bucket + image) : '/images/wireframe.png'}>
      <Item.Content>
        <Item.Header>
          <div style={{ marginBottom: 6 }}>
            <If condition={canWrite}>
              <Button compact icon="edit" color="orange" url={`/admin/practical/${e(name)}/${_id}`}  />
            </If>
            <Link link={`${scheduleId ? '' : '/admin'}/practical/${e(name)}/${e(scheduleName)}/${_id}/${scheduleId}`}>{name}</Link>
          </div>
        </Item.Header>
        <Item.Meta>
          <span className="cinema" key="0">
            <Text text="createdBy" />{createdBy} · { Utils.Ui.relativeDate(updatedAt) }
            { isAdmin && isVisible && <span> · <Label color="green" text="Open" /></span>  }
          </span>
        </Item.Meta>
        <Item.Description>{ Utils.Ui.previewMarkdown(description, 300) }</Item.Description>
      </Item.Content>
    </Item.Main >
  );
};

export default PracticalItem;
