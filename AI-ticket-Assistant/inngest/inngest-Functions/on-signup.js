import { inngest } from "../client.js";
import User from "../../models/user.model.js"
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import logger from "../../utils/logger.js";


export const onUserSignup = inngest.createFunction(
  { id: "on-user-signup", retries: 2 },
  { event: "user/signup" },
  async ({ event, step }) => {
    try {
      const { email } = event.data;
      const userSearch = await step.run("get-user-email", async () => {
        const user = await User.findOne({ email });
        if (!user) {
          throw new NonRetriableError("User not found.");
        }
        return user;
      })
      logger.info(`userSearch: ${JSON.stringify(userSearch)}`);

      await step.run("send-welcome-email", async () => {
        const subject = `Welcome to the App`
        const message = `Hi,
        \n\n 
        Thanks for signing-up,we're glad to have you
        `
        await sendMail(userSearch.email, subject, message)
      })

      return { success: true }

    } catch (error) {
      logger.error(`❌ Error Running Step: ${error.message}`);
      return { success: false }
    }
  }
)