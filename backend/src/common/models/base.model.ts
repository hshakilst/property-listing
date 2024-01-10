import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BaseDocument = BaseModel & Document;

@Schema()
export class BaseModel {
  // @Prop({ default: Date.now })
  // createdAt: Date;

  // @Prop({ default: Date.now })
  // updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const BaseSchema = SchemaFactory.createForClass(BaseModel);

// Soft delete
const excludeSoftDeleted = function (next) {
  this.where({ isDeleted: false });
  next();
};

// Hooks for various find operations
BaseSchema.pre<BaseDocument>('find', excludeSoftDeleted);
BaseSchema.pre<BaseDocument>('findOne', excludeSoftDeleted);
BaseSchema.pre<BaseDocument>('countDocuments', excludeSoftDeleted);

// Static method for upsert
// BaseSchema.statics.upsert = async function (query, update) {
//   const options = { new: true, upsert: true, setDefaultsOnInsert: true };
//   return this.findOneAndUpdate(query, update, options);
// };

// Static method for soft delete
// BaseSchema.statics.softDelete = async function (id) {
//   return this.findByIdAndUpdate(
//     id,
//     { isDeleted: true, deletedAt: new Date() },
//     { new: true },
//   );
// };
