import { Request, Response } from "express";
import { CreateUserInput, VerifyUserInput } from "../schema/user.schema";
import { createUser, findUserById } from "../service/user.service";
import sendEmail from "../utils/mailer";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);

    await sendEmail({
      from: "test@example.com",
      to: user.email,
      subject: "Please verify account",
      text: `verification code ${user.verificationCode}. Id: ${user._id}`,
    });

    return res.send("User created successfully !");
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).send("User already exists");
    }
    return res.status(500).send(error.message);
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  //find user by id

  const user = await findUserById(id);

  if (!user) {
    return res.send("Could not verify user");
  }

  //check if user already verified

  if (user.verified) {
    return res.send("User already verified");
  }

  //check if verification code is correct

  if (user.verificationCode === verificationCode) {
    user.verified = true;
    await user.save();
    return res.send("User verified successfully");
  }

  return res.send("Could not verify user");
}
