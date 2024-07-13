import {
  getModelForClass,
  modelOptions,
  pre,
  prop,
  Severity,
  DocumentType,
} from "@typegoose/typegoose";
import argon2 from "argon2";
import log from "../utils/logger";

// Assuming you need to use nanoid in an asynchronous function
async function generateId() {
  const { nanoid } = await import("nanoid");
  return nanoid();
}

@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const hash = await argon2.hash(this.password);

  this.password = hash;
})
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

  @prop({ required: true, default: () => generateId() })
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
