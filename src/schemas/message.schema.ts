import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as moment from 'moment-timezone';

@Schema()
export class Message extends Document {
  @Prop({ type: Number, required: true })
  userId: number;

  @Prop({ type: Number, required: true })
  friendId: number;

  @Prop({ enum: ['text', 'image', 'voice'], default: 'text' })
  type: 'text' | 'image' | 'voice';

  @Prop(raw({
    text: { type: String }
  }))
  text?: {
    text: string;
  };

  @Prop(raw({
    uri: { type: String },
    thumbnail: { type: String }
  }))
  image?: {
    uri: string;
    thumbnail: string;
  };

  @Prop(raw({
    uri: { type: String }
  }))
  voice?: {
    uri: string;
  };

  @Prop({ type: String, default: () => moment.tz('Asia/Shanghai').format() })
  createTime: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
