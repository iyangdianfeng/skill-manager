/**
 * 控制台输出工具
 */

// 使用 Deno 内置的终端颜色支持
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
 * 打印成功消息
 */
export function success(message: string): void {
  console.log(green(`✅ ${message}`));
}

/**
 * 打印错误消息
 */
export function error(message: string): void {
  console.log(red(`❌ ${message}`));
}

/**
 * 打印警告消息
 */
export function warn(message: string): void {
  console.log(yellow(`⚠️  ${message}`));
}

/**
 * 打印信息消息
 */
export function info(message: string): void {
  console.log(cyan(`ℹ️  ${message}`));
}
