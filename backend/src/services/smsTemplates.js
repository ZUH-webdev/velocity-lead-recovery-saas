/**
 * SMS Templates for Velocity
 * All message templates used in conversations
 */

const templates = {
  // Openers
  openMissedCall: (clinicName) =>
    `Hi — Velocity from ${clinicName}. I saw a missed call — is now a good time? What's your name?`,

  openFormSubmit: (leadName, clinicName) =>
    `Hi ${leadName}, Velocity from ${clinicName}. Thanks for your request — quick Q: what service or concern should we book for?`,

  // Qualification
  qualReason: () => `What's the reason for your visit?`,
  qualNewOrReturning: () => `Are you a new or returning patient?`,
  qualUrgency: () => `Is this urgent or routine?`,
  qualInsurance: () => `Do you have insurance or will you self-pay?`,
  qualTimePreference: () => `Mornings or afternoons better?`,

  // Booking
  bookingTwoSlots: (slot1, slot2) =>
    `Would ${slot1} or ${slot2} work better for you?`,

  bookingAlternate: () =>
    `What day/time this week works best? I'll hold it while you confirm.`,

  confirmAppointment: (day, date, time, clinicName) =>
    `Great — you're set for ${day}, ${date} at ${time}. See you at ${clinicName}. We'll text a reminder 24 hours before.`,

  // Emergency
  emergencyResponse: () =>
    `If this is an emergency please call 911 or go to the nearest ER right away. If urgent but not life-threatening, reply "urgent" and I'll prioritize a callback.`,

  // Handoff
  handoffFrontDesk: () =>
    `I'll connect you with our front desk for details — what's the best number and when can they call?`,

  handoffAck: (timeWindow, clinicPhone) =>
    `Thanks — someone will call between ${timeWindow}. If you need faster help, call ${clinicPhone}.`,

  // Misc
  confirmName: (name) => `Thanks, ${name}.`,
  clarification: () => `Sorry, didn't catch that. Can you say that again?`
};

/**
 * Get available time slots
 * For now, return hardcoded slots. Integrate with calendar API later.
 */
const getTimeSlots = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const wednesday = new Date();
  wednesday.setDate(wednesday.getDate() + (3 - wednesday.getDay()));

  const tomorrowFormatted = tomorrow.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const wednesdayFormatted = wednesday.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return [
    { slot: `tomorrow at 2:00 PM`, date: tomorrowFormatted, time: '2:00 PM' },
    { slot: `Wednesday at 10:00 AM`, date: wednesdayFormatted, time: '10:00 AM' }
  ];
};

module.exports = {
  templates,
  getTimeSlots
};
