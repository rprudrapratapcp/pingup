import { Inngest } from "inngest";
import User from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ name: "pingup-app" });


// inngest function to save data to a database 
const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' }, // ✅ fixed
  { event: 'user.created' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    let username = email_addresses[0].email_address.split('@')[0];

    const user = await User.findOne({ username });

    if (user) {
      username = username + Math.floor(Math.random() * 10000);
    }

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      full_name: first_name + " " + last_name, // ✅ fixed
      profile_picture: image_url,
      username
    };

    await User.create(userData);
  }
);


// inngest function to update data in database 
const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' }, // ✅ fixed
  { event: 'user.updated' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const updatedUserData = {
      email: email_addresses[0].email_address,
      full_name: first_name + " " + last_name, // ✅ fixed
      profile_picture: image_url,
    };

    await User.findByIdAndUpdate(id, updatedUserData);
  }
);


// inngest function to delete data from database 
const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-from-clerk' }, // ✅ fixed
  { event: 'user.deleted' },
  async ({ event }) => {
    const { id } = event.data;

    await User.findByIdAndDelete(id);
  }
);


// export functions
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion
];