class ResError extends Error {
  status: number = 500;

  constructor(aMessage: string, aStatus?: number) {
    super(aMessage);
    this.status = aStatus;
  }
}

export default ResError;
