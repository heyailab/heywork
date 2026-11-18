/** Resolve the Host account's Documents directory for first-use Workspace creation. */
import { homedir } from 'node:os';
import { posix, win32 } from 'node:path';
import { runNativeCommand } from '@deepseek-ai/dsh-native-command';
import { DEFAULT_WORKSPACE_DIRECTORY } from "./default-workspace.js";
function validateDirectory(directory, platform, label) {
    const paths = platform === 'win32' ? win32 : posix;
    const root = paths.parse(directory).root;
    if (directory.includes('\0') || !paths.isAbsolute(directory) || (platform === 'win32' && (root === '\\' || root === '/'))) {
        throw new Error(`${label} must be fully qualified: '${directory}'`);
    }
    return paths.normalize(directory);
}
/**
 * Validate a configured or OS-returned Documents path without resolving it against cwd.
 * @param directory - fully qualified directory spelling.
 * @param platform - Host platform.
 * @returns the normalized directory.
 */
export function validateDocumentsDirectory(directory, platform = process.platform) {
    return validateDirectory(directory, platform, 'Documents directory');
}
/**
 * Validate a complete configured first-use Workspace path without reading or creating files.
 * @param directory - fully qualified first-use directory spelling.
 * @param platform - Host platform.
 * @returns the normalized directory.
 */
export function validateDefaultWorkspaceDirectory(directory, platform = process.platform) {
    return validateDirectory(directory, platform, 'Default Workspace directory');
}
/**
 * Resolve the first-use directory on the Host without creating files.
 * @param documentsDirectory - explicit deployment override for the system Documents directory.
 * @param signal - caller lifetime and lookup deadline.
 * @param internals - platform facts and native command runner.
 * @returns the absolute candidate path.
 */
export async function defaultWorkspaceDirectory(documentsDirectory, signal, internals = {}) {
    const platform = internals.platform ?? process.platform;
    const paths = platform === 'win32' ? win32 : posix;
    signal.throwIfAborted();
    let directory = documentsDirectory;
    if (directory === undefined) {
        const run = internals.run ?? runNativeCommand;
        let stdout;
        switch (platform) {
            case 'darwin':
                ({ stdout } = await run('osascript', [
                    '-e', 'POSIX path of (path to documents folder from user domain without folder creation)',
                ], signal, 'hidden'));
                break;
            case 'win32':
                ({ stdout } = await run('powershell.exe', [
                    '-NoLogo', '-NoProfile', '-NonInteractive', '-Command',
                    '[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false); '
                        + '[Environment]::GetFolderPath([Environment+SpecialFolder]::MyDocuments, '
                        + '[Environment+SpecialFolderOption]::DoNotVerify)',
                ], signal, 'hidden'));
                break;
            case 'linux':
                ({ stdout } = await run('xdg-user-dir', ['DOCUMENTS'], signal, 'hidden'));
                break;
            default:
                throw new Error(`system Documents directory is unavailable on ${platform}`);
        }
        directory = stdout.replace(/[\r\n]+$/, '');
        // XDG reports the home directory when this user directory is disabled.
        if (directory === '' || (platform === 'linux' && paths.normalize(directory) === (internals.home ?? homedir()))) {
            throw new Error('system Documents directory is unavailable');
        }
    }
    directory = validateDocumentsDirectory(directory, platform);
    signal.throwIfAborted();
    return paths.join(directory, 'deepseek-harness', DEFAULT_WORKSPACE_DIRECTORY);
}
//# sourceMappingURL=default-directory.js.map