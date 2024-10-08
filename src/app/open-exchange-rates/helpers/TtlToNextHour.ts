/**
 * Calculate the time-to-live (TTL) in seconds based on the response timestamp.
 * TTL is a diff between current time and next round hour in seconds.
 *
 * @param {number} responseTimestamp - The timestamp (in seconds) of the response.
 * @return {number} - The time-to-live (TTL) in seconds, or 0 if the TTL has already expired.
 */
export function calculateTTL(responseTimestamp: number): number {
  // Get the date object from the response timestamp (in seconds) and the current timestamp (in milliseconds)
  const responseDate = new Date(responseTimestamp * 1000);
  const currentDate = new Date();

  // Extract hours, minutes, and seconds from the response time
  const responseHours = responseDate.getUTCHours();
  const responseMinutes = responseDate.getUTCMinutes();

  // Set the target expiry date at the next round hour (11:00) after the response
  const expiryDate = new Date(responseDate);
  expiryDate.setUTCHours(
    responseHours + (responseMinutes >= 0 ? 1 : 0),
    0,
    0,
    0,
  );

  // Calculate the TTL (time-to-live) in seconds
  const ttlMilliseconds = expiryDate.getTime() - currentDate.getTime();
  const ttlSeconds = Math.floor(ttlMilliseconds / 1000);

  // Return TTL in seconds or 0 if expired
  return ttlSeconds > 0 ? ttlSeconds : 0;
}
