class JSONFormatter {
  /**
   * Formats a JSON object into well-structured, human-readable HTML with styled sections.
   * @param json - The JSON object to format.
   * @returns A string containing the formatted HTML.
   */
  public static format(json: any): string {
    return this.formatJSON(json, 0);
  }

  /**
   * Recursively formats a JSON object into HTML.
   * @param data - The JSON data to format.
   * @param indentLevel - The current indentation level.
   * @returns A string containing the formatted HTML.
   */
  private static formatJSON(data: any, indentLevel: number): string {
    if (Array.isArray(data)) {
      return this.formatArray(data, indentLevel);
    } else if (typeof data === 'object' && data !== null) {
      return this.formatObject(data, indentLevel);
    } else {
      return this.formatPrimitive(data, indentLevel);
    }
  }

  /**
   * Formats an array into HTML with styled sections for arrays of objects.
   * @param array - The array to format.
   * @param indentLevel - The current indentation level.
   * @returns A string containing the formatted HTML.
   */
  private static formatArray(array: any[], indentLevel: number): string {
    let html = '';
    array.forEach((item, index) => {
      if (typeof item === 'object' && item !== null) {
        // Add a styled section for arrays of objects
        html += `<div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9;">
          ${this.formatJSON(item, indentLevel + 1)}
        </div>`;
      } else {
        // Regular array items (non-objects)
        html += `<div style="margin-left: ${
          indentLevel * 20
        }px;">- ${this.formatJSON(item, indentLevel + 1)}</div>`;
      }
    });
    return html;
  }

  /**
   * Formats an object into HTML.
   * @param obj - The object to format.
   * @param indentLevel - The current indentation level.
   * @returns A string containing the formatted HTML.
   */
  private static formatObject(obj: { [key: string]: any }, indentLevel: number): string {
    let html = '';
    const keys = Object.keys(obj);
    keys.forEach((key, index) => {
      html += `<div style="margin-left: ${indentLevel * 20}px;">
        <strong>${key}:</strong> ${this.formatJSON(obj[key], indentLevel + 1)}
      </div>`;
    });
    return html;
  }

  /**
   * Formats a primitive value into HTML.
   * @param value - The primitive value to format.
   * @param indentLevel - The current indentation level.
   * @returns A string containing the formatted HTML.
   */
  private static formatPrimitive(value: any, indentLevel: number): string {
    if (typeof value === 'string') {
      return `<span>"${value}"</span>`; // Wrap strings in quotes for clarity
    } else if (value === null) {
      return '<span>null</span>'; // Handle null values
    } else if (typeof value === 'undefined') {
      return '<span>undefined</span>'; // Handle undefined values
    } else {
      return `<span>${value.toString()}</span>`; // Numbers, booleans, etc.
    }
  }
}
export default JSONFormatter;
