export function handler(): Response {
  const schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "https://tryandromeda.dev/schema/andromeda.json",
    "title": "Andromeda Configuration Schema",
    "description": "Schema for Andromeda runtime configuration files",
    "type": "object",
    "properties": {
      "runtime": {
        "$ref": "#/definitions/RuntimeConfig",
      },
      "format": {
        "$ref": "#/definitions/FormatConfig",
      },
      "lint": {
        "$ref": "#/definitions/LintConfig",
      },
      "tasks": {
        "type": "object",
        "description": "Task definitions",
        "additionalProperties": {
          "$ref": "#/definitions/TaskDefinition",
        },
      },
      "imports": {
        "type": "object",
        "description":
          "Direct module specifier mappings (Web Import Maps spec)",
        "additionalProperties": {
          "type": "string",
        },
      },
      "scopes": {
        "type": "object",
        "description": "Scope-specific mappings (Web Import Maps spec)",
        "additionalProperties": {
          "type": "object",
          "additionalProperties": {
            "type": "string",
          },
        },
      },
      "integrity": {
        "type": "object",
        "description": "Integrity metadata mappings (Web Import Maps spec)",
        "additionalProperties": {
          "type": "string",
        },
      },
      "import_map_files": {
        "type": "array",
        "description":
          "Additional import map files to load (Andromeda extension)",
        "items": {
          "type": "string",
        },
      },
      "name": {
        "type": "string",
        "description": "Project name",
      },
      "version": {
        "type": "string",
        "description": "Project version",
      },
      "description": {
        "type": "string",
        "description": "Project description",
      },
      "author": {
        "type": "string",
        "description": "Project author(s)",
      },
      "license": {
        "type": "string",
        "description": "License",
      },
    },
    "additionalProperties": false,
    "definitions": {
      "RuntimeConfig": {
        "type": "object",
        "description": "Runtime execution configuration",
        "properties": {
          "no_strict": {
            "type": "boolean",
            "description": "Disable strict mode",
            "default": false,
          },
          "verbose": {
            "type": "boolean",
            "description": "Enable verbose output",
            "default": false,
          },
          "disable_gc": {
            "type": "boolean",
            "description": "Disable garbage collection (for debugging)",
            "default": false,
          },
          "print_internals": {
            "type": "boolean",
            "description": "Print internal debugging information",
            "default": false,
          },
          "expose_internals": {
            "type": "boolean",
            "description": "Expose Nova internal APIs",
            "default": false,
          },
          "include": {
            "type": "array",
            "description": "List of files to include in runtime",
            "items": {
              "type": "string",
            },
            "default": [],
          },
          "exclude": {
            "type": "array",
            "description": "List of files to exclude from runtime",
            "items": {
              "type": "string",
            },
            "default": [],
          },
          "timeout": {
            "type": "integer",
            "description": "Runtime timeout in milliseconds",
            "minimum": 1,
          },
        },
        "additionalProperties": false,
      },
      "FormatConfig": {
        "type": "object",
        "description": "Code formatting configuration",
        "properties": {
          "line_width": {
            "type": "integer",
            "description": "Line width for formatting",
            "minimum": 20,
            "maximum": 500,
            "default": 80,
          },
          "use_tabs": {
            "type": "boolean",
            "description": "Use tabs instead of spaces",
            "default": false,
          },
          "tab_width": {
            "type": "integer",
            "description": "Tab width",
            "minimum": 1,
            "maximum": 16,
            "default": 2,
          },
          "trailing_comma": {
            "type": "boolean",
            "description": "Trailing commas",
            "default": false,
          },
          "semicolons": {
            "type": "boolean",
            "description": "Semicolons preference",
            "default": true,
          },
          "single_quotes": {
            "type": "boolean",
            "description": "Single quotes preference",
            "default": false,
          },
          "include": {
            "type": "array",
            "description": "Files or directories to include (glob patterns)",
            "items": {
              "type": "string",
            },
            "default": [],
          },
          "exclude": {
            "type": "array",
            "description": "Files or directories to exclude (glob patterns)",
            "items": {
              "type": "string",
            },
            "default": [],
          },
        },
        "additionalProperties": false,
      },
      "LintConfig": {
        "type": "object",
        "description": "Linting configuration",
        "properties": {
          "enabled": {
            "type": "boolean",
            "description": "Enable linting",
            "default": true,
          },
          "rules": {
            "type": "array",
            "description": "Lint rules to enable",
            "items": {
              "type": "string",
            },
            "default": [],
          },
          "disabled_rules": {
            "type": "array",
            "description": "Lint rules to disable",
            "items": {
              "type": "string",
            },
            "default": [],
          },
          "max_warnings": {
            "type": "integer",
            "description": "Maximum number of warnings before error",
            "minimum": 1,
          },
          "include": {
            "type": "array",
            "description": "Files or directories to include (glob patterns)",
            "items": {
              "type": "string",
            },
            "default": [],
          },
          "exclude": {
            "type": "array",
            "description": "Files or directories to exclude (glob patterns)",
            "items": {
              "type": "string",
            },
            "default": [],
          },
        },
        "additionalProperties": false,
      },
      "TaskDefinition": {
        "oneOf": [
          {
            "type": "string",
            "description": "Simple string command",
          },
          {
            "type": "object",
            "description": "Complex task definition",
            "properties": {
              "description": {
                "type": "string",
                "description": "Description of the task",
              },
              "command": {
                "type": "string",
                "description": "Command to execute",
              },
              "dependencies": {
                "type": "array",
                "description": "Dependencies that must run before this task",
                "items": {
                  "type": "string",
                },
                "default": [],
              },
              "cwd": {
                "type": "string",
                "description": "Working directory for the task",
              },
              "env": {
                "type": "object",
                "description": "Environment variables for the task",
                "additionalProperties": {
                  "type": "string",
                },
                "default": {},
              },
            },
            "required": ["command"],
            "additionalProperties": false,
          },
        ],
      },
    },
  };

  return new Response(JSON.stringify(schema), {
    headers: { "Content-Type": "application/json" },
  });
}
