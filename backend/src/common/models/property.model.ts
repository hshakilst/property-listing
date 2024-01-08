import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base, BaseDocument } from './base.model';
import { PropertySource, PropertySourceEnum } from '../types/property.type';

export type PropertyDocument = Property & BaseDocument;

@Schema({
  autoIndex: true,
  collection: 'properties',
  timestamps: true,
  id: true,
  versionKey: false,
})
export class Property extends Base {
  @Prop({ required: true, unique: true })
  externalId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true, type: Number })
  zip: number;

  @Prop({ required: true })
  state: string;

  @Prop({ type: [String] })
  imageUrls: string[];

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  county: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, type: Number })
  capacity: number;

  @Prop({
    required: true,
    type: String,
    enum: PropertySourceEnum,
  })
  source: PropertySource;
}

export const PropertySchema = SchemaFactory.createForClass(Property);

// Needed for updating properties from scraper
PropertySchema.index({ externalId: 1, source: 1 }, { unique: true });

// Needed for searching properties by name
PropertySchema.index({ name: 1 });
