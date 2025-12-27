/**
 * Console output utilities
 * Provides colored output functions for CLI
 */

// Check if terminal supports colors
const isColorSupported = Deno.stdout.isTerminal?.() ?? true;

const color = (code: number) => (text: string) =>
  isColorSupported ? `\x1b[${code}m${text}\x1b[0m` : text;

export const bold = color(1);
export const cyan = color(36);
export const green = color(32);
export const yellow = color(33);
export const red = color(31);
export const gray = color(90);

/**
 * Print success message
 */
export function success(message: string): void {
  console.log(green(`✅ ${message}`));
}

/**
 * Print error message
 */
export function error(message: string): void {
  console.log(red(`❌ ${message}`));
}

/**
 * Print warning message
 */
export function warn(message: string): void {
  console.log(yellow(`⚠️  ${message}`));
}

/**
 * Print info message
 */
export function info(message: string): void {
  console.log(cyan(`ℹ️  ${message}`));
}
