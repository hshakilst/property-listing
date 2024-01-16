import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel, BaseDocument } from './base.model';

export type FileDocument = FileModel & BaseDocument;

@Schema({
  autoIndex: true,
  collection: 'files',
  timestamps: true,
  id: true,
  versionKey: false,
})
export class FileModel extends BaseModel {
  @Prop({ required: true })
  externalId: string;

  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  name: string;
}

export const FileSchema = SchemaFactory.createForClass(FileModel);

FileSchema.index({ externalId: 1 });

FileSchema.index({ key: 1 });
