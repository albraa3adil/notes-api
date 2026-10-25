/**
 * Escapes the characters that have special meaning in a LIKE / ILIKE pattern
 * (backslash, percent, underscore) so user input is matched literally.
 * Postgres uses backslash as the default escape character.
 */
export function escapeLikePattern(value: string): string {
    return value.replace(/[\\%_]/g, "\\$&");
}