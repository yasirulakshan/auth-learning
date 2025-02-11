import {
  getModelForClass,
  modelOptions,
  pre,
  prop,
  Severity,
  DocumentType,
  index,
} from "@typegoose/typegoose";
import argon2 from "argon2";
import log from "../utils/logger";
import { v4 as uuidv4 } from "uuid"; // Importing uuid

@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const hash = await argon2.hash(this.password);

  this.password = hash;
})
@index({ email: 1 })
@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ lowercase: true, unique: true, required: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: uuidv4 })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean;

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (error) {
      log.error(error, "Error validating password");
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
