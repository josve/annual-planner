/**
 * Utility function to determine text color based on background color for readability.
 * Uses luminance to decide between black and white text.
 * @param hexColor - The background color in HEX format.
 * @returns The contrasting text color (`#000000` or `#FFFFFF`).
 */
export function getContrastColor(hexColor: string): string {
    // Remove '#' if present
    hexColor = hexColor.replace("#", "");

    // Convert to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? "#000000" : "#FFFFFF";
}
