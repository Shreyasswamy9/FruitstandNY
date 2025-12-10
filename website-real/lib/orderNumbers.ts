export function generateOrderNumber(): string {
  const timePart = Date.now().toString().slice(-4);
  const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
  return `${timePart}${randomPart}`;
}
