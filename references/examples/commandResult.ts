export class CommandResult<E> {
  private _value?: unknown;

  private constructor(
    private readonly _success: boolean,
    private readonly _error?: E,
  ) {}

  static success<E>(value?: unknown): CommandResult<E> {
    const result = new CommandResult<E>(true);
    result._value = value;
    return result;
  }

  static failure<E>(error: E): CommandResult<E> {
    return new CommandResult<E>(false, error);
  }

  isSuccess(): boolean {
    return this._success;
  }

  isFailure(): boolean {
    return !this._success;
  }

  getError(): E {
    if (this._success) {
      throw new Error('Cannot get error from a successful result');
    }
    return this._error as E;
  }

  getValue<T>(): T {
    if (!this._success) {
      throw new Error('Cannot get value from a failed result');
    }
    return this._value as T;
  }
}
