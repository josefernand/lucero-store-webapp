// Global Error Handler to manipulate catch block errors into a type Error value.

export const isErrWithMsg = (e: unknown): e is Error => {
  /**
   * The possible error:
   *   1) needs to be an object,
   *   2) needs to not be null because null can be an object,
   *   3) must have a key of message,
   *   4) and must have a value type of string at key of message.
   * If this criteria is met, returns true.
   * Else this is not an error and needs to be manipulated into an error, returns false.
   * Record<string, unknown> --> An object with keys of type string and unknown values.
   */
  return (
    typeof e === 'object' && e !== null && 'message' in e && typeof (e as Record<string, unknown>).message === 'string'
  );
};

export const toErrWithMsg = (err: unknown): Error => {
  // If value is type Error, return immediately.
  if (isErrWithMsg(err)) return err;

  try {
    // This will error on circular references.
    return new Error(JSON.stringify(err));
  } catch {
    // Handles circular references, or an object referencing itself within its Key Value pairs.
    return new Error(String(err));
  }
};

export const errorFormatter = (error: unknown): Error => {
  // Ensures whatever error a catch block receives, this will turn that error into a type Error value.
  return toErrWithMsg(error);
};
