import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel, BaseDocument } from './base.model';
import { PropertySource, PropertySourceEnum } from '../types/property.type';

export type PropertyDocument = PropertyModel & BaseDocument;

@Schema({
  autoIndex: true,
  collection: 'properties',
  timestamps: true,
  id: true,
  versionKey: false,
})
export class PropertyModel extends BaseModel {
  @Prop({ required: true })
  externalId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  zip: string;

  @Prop({ required: true })
  state: string;

  @Prop({ type: [String] })
  imageUrls?: string[];

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  county: string;

  @Prop({ required: true, default: '' })
  phone?: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, type: Number, default: 0 })
  capacity?: number;

  @Prop({
    required: true,
    type: String,
    enum: PropertySourceEnum,
  })
  source: PropertySource;

  @Prop({ required: true })
  sourceUrl: string;

  @Prop({ required: true })
  detailsUrl: string;

  @Prop({ required: true, default: '' })
  mapUrl?: string;
}

export const PropertySchema = SchemaFactory.createForClass(PropertyModel);

// Needed for updating properties from scraper
PropertySchema.index({ externalId: 1, source: 1 });

// Needed for scraping properties from crawler
PropertySchema.index({ detailsUrl: 1, source: 1 });

// Needed for searching properties by name
PropertySchema.index({ name: 1 });

// Needed for Scraping Details
PropertySchema.index({ detailsUrl: 1 });
