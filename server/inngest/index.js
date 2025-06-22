import { Inngest } from "inngest";
import User from "../models/User.js";
// import Booking from "../models/Booking.js";
// import Show from "../models/Show.js";
// import sendEmail from "../configs/nodeMailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Function 1: Save new user
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.create(userData);
  }
);

// Function 2: Delete user
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

// Function 3: Update user
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.findByIdAndUpdate(id, userData);
  }
);

// Export all valid functions here (others are commented)
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  // releaseSeatsAndDeleteBooking,
  // sendBookingConfirmationEmail,
  // sendShowReminders,
  // sendNewShowNotifications
];

// Log which functions are being exported
console.log("Inngest functions being served:");
functions.forEach((fn, index) => {
  if (!fn || !fn.config || !fn.config.id) {
    console.error(`Function at index ${index} is invalid:`, fn);
  } else {
    console.log(`Function ${index}: ${fn.config.id}`);
  }
});
