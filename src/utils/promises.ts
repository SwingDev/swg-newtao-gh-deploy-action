export function sleepFor(secs): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, secs);
  });
}
