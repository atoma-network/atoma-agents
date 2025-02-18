class JSONFormatter {
  /**
   * Formats a JSON object into well-structured, human-readable HTML with styled sections.
   * @param json - The JSON object to format.
   * @returns A string containing the formatted HTML.
   */
  public static format(json: any): string {
    return `
      <div class="json-formatter" style="
        max-width: 100%;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
      ">
        ${this.formatJSON(json, 0)}
      </div>
    `;
  }

  /**
   * Transforms camelCase, snake_case, and PascalCase text to space-separated words
   * @param text - The text to transform
   * @returns The transformed text
   */
  private static transformKey(text: string): string {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim()
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
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
    if (array.length === 0) {
      return '<div style="color: #666;">(empty array)</div>';
    }

    let html = '<div class="json-array" style="width: 100%;">';
    array.forEach((item, index) => {
      if (typeof item === 'object' && item !== null) {
        html += `
          <div class="json-object-container" style="
            margin: 12px 0;
            padding: 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #f9f9f9;
            overflow-wrap: break-word;
            word-wrap: break-word;
            word-break: break-word;
          ">
            ${this.formatJSON(item, indentLevel + 1)}
          </div>
        `;
      } else {
        html += `
          <div class="json-array-item" style="
            padding: 4px 0;
            margin-left: ${indentLevel * 24}px;
            display: flex;
            align-items: flex-start;
          ">
            <span style="margin-right: 8px;">•</span>
            <div style="flex: 1;">${this.formatJSON(item, indentLevel + 1)}</div>
          </div>
        `;
      }
    });
    html += '</div>';
    return html;
  }

  /**
   * Formats an object into HTML.
   * @param obj - The object to format.
   * @param indentLevel - The current indentation level.
   * @returns A string containing the formatted HTML.
   */
  private static formatObject(obj: { [key: string]: any }, indentLevel: number): string {
    if (Object.keys(obj).length === 0) {
      return '<div style="color: #666;">(empty object)</div>';
    }

    let html = '<div class="json-object" style="width: 100%;">';
    const keys = Object.keys(obj);
    keys.forEach((key, index) => {
      const value = obj[key];
      const isNested = typeof value === 'object' && value !== null;

      if (isNested) {
        // Nested objects/arrays get their own block
        html += `
          <div class="json-property nested" style="
            padding: 8px 0;
            margin-left: ${indentLevel * 24}px;
          ">
            <div style="
              font-weight: bold;
              margin-bottom: 8px;
            ">${this.transformKey(key)}:</div>
            <div style="
              padding-left: 24px;
            ">
              ${this.formatJSON(value, indentLevel + 1)}
            </div>
          </div>
        `;
      } else {
        // Primitive values stay inline
        html += `
          <div class="json-property" style="
            padding: 8px 0;
            margin-left: ${indentLevel * 24}px;
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
          ">
            <strong style="
              min-width: 120px;
              max-width: 100%;
              margin-right: 12px;
              margin-bottom: 4px;
            ">${this.transformKey(key)}:</strong>
            <div style="
              flex: 1;
              min-width: 200px;
              overflow-wrap: break-word;
              word-wrap: break-word;
              word-break: break-word;
            ">
              ${this.formatJSON(value, indentLevel + 1)}
            </div>
          </div>
        `;
      }
    });
    html += '</div>';
    return html;
  }

  /**
   * Formats a primitive value into HTML.
   * @param value - The primitive value to format.
   * @param indentLevel - The current indentation level.
   * @returns A string containing the formatted HTML.
   */
  private static formatPrimitive(value: any, indentLevel: number): string {
    const style = `
      color: #444;
      font-family: monospace;
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-word;
    `;

    if (typeof value === 'string') {
      return `<span style="${style}">"${value}"</span>`;
    } else if (value === null) {
      return `<span style="${style}">null</span>`;
    } else if (typeof value === 'undefined') {
      return `<span style="${style}">undefined</span>`;
    } else {
      return `<span style="${style}">${value.toString()}</span>`;
    }
  }
}

export default JSONFormatter;
