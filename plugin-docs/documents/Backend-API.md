[**Orca API Documentation**](../README.md)

***

[Orca API Documentation](../modules.md) / Backend API

# Introduction

This document will guide you through all available backend API calls, which can be invoked using `orca.invokeBackend`.

## get-aliased-blocks

Retrieves all blocks with the specified alias.

Parameters:

- keyword - The search keyword.
- pageNum - The page number (starting from 0).
- pageSize - The number of items per page.

Returns:

A list of blocks with aliases.

Example:

```ts
// Get aliased blocks matching a keyword, with pagination
const blocks = await orca.invokeBackend("get-aliased-blocks", "project", 0, 10)
```

## get-aliases

Retrieves all aliases in the repository.

Parameters:

- keyword - The search keyword.
- pageNum - The page number (starting from 0).
- pageSize - The number of items per page.

Returns:

A list of aliases.

Example:

```ts
// Get aliases matching a keyword, with pagination
const aliases = await orca.invokeBackend("get-aliases", "meeting", 0, 20)
```

## get-aliases-ids

Retrieves block IDs for a list of aliases.

Parameters:

- names - Array of aliases.

Returns:

A mapping of aliases to block IDs.

Example:

```ts
// Get block IDs for a list of aliases
const blockIds = await orca.invokeBackend("get-aliases-ids", [
  "project-a",
  "task-1",
])
```

## get-block

Retrieves a block by its ID.

Parameters:

- blockId - The ID of the block.

Returns:

The block object.

Example:

```ts
// Get a block by its ID
const block = await orca.invokeBackend("get-block", 12345)
console.log(`Block content: ${block.text}`)
```

## get-block-by-alias

Retrieves a block by its alias.

Parameters:

- alias - The alias of the block.

Returns:

The block object.

Example:

```ts
// Get a block using its alias
const block = await orca.invokeBackend("get-block-by-alias", "project-roadmap")
```

## get-blockid-by-alias

Retrieves the ID of a block by its alias.

Parameters:

- alias - The alias of the block.

Returns:

An object containing the block ID.

Example:

```ts
// Get the ID of a block by its alias
const result = await orca.invokeBackend("get-blockid-by-alias", "meeting-notes")
if (result?.id != null) {
  console.log(`Found block ID: ${result.id}`)
}
```

## get-blocks

Retrieves multiple blocks by their IDs.

Parameters:

- blockIds - Array of block IDs.

Returns:

An array of block objects.

Example:

```ts
// Get multiple blocks by their IDs
const blocks = await orca.invokeBackend("get-blocks", [123, 456, 789])
```

## get-blocks-with-tags

Retrieves blocks with specific tags.

Parameters:

- tagNames - Array of tag names.

Returns:

An array of blocks containing the specified tags.

Example:

```ts
// Get blocks with specific tags
const taggedBlocks = await orca.invokeBackend("get-blocks-with-tags", [
  "project",
  "active",
])
console.log(`Found ${taggedBlocks.length} active projects`)
```

## get-block-tree

Retrieves a block and all its nested child blocks (tree structure).

Parameters:

- blockId - The ID of the block.

Returns:

The block tree structure.

Example:

```ts
// Get a block and all its nested children
const blockTree = await orca.invokeBackend("get-block-tree", 12345)
```

## get-children-tags

Retrieves child tags of a parent tag block.

Parameters:

- blockId - The ID of the parent tag block.

Returns:

An array of child tags.

Example:

```ts
// Get child tags of a parent tag block
const childTags = await orca.invokeBackend(
  "get-children-tags",
  parentTagBlockId,
)
```

## get-children-tag-blocks

Retrieves blocks associated with child tags of a parent tag.

Parameters:

- blockId - The ID of the parent tag block.

Returns:

An array of blocks containing child tags.

Example:

```ts
// Get blocks tagged with any child tag of the parent tag
const blocks = await orca.invokeBackend(
  "get-children-tag-blocks",
  parentTagBlockId,
)
```

## get-journal-block

Retrieves the journal block for a specific date.

Parameters:

- date - The date object.

Returns:

The journal block.

Example:

```ts
// Get the journal block for today's date
const journalBlock = await orca.invokeBackend("get-journal-block", new Date())
```

## get-tags

Retrieves all tags in the repository.

Returns:

An array of tags.

Example:

```ts
// Get all available tags
const tags = await orca.invokeBackend("get-tags")
```

## image-ocr

Performs Optical Character Recognition (OCR) on an image file.

Parameters:

- fileSrc - The image file source (either a file path string or an ArrayBuffer containing the image binary data).

Returns:

The OCR results containing recognized text and positions.

Example:

```ts
// OCR from a file path
const ocrResult = await orca.invokeBackend("image-ocr", "./assets/document.png")

// OCR from binary data
const response = await fetch("https://example.com/image.jpg")
const imageData = await response.arrayBuffer()
const ocrResult = await orca.invokeBackend("image-ocr", imageData)
console.log(`OCR text recognized: ${ocrResult.length} elements`)
```

## query

Executes a complex query to search and filter blocks.

Parameters:

- description - The query description object defining conditions, sorting, and pagination.

Returns:

An array of blocks matching the query.

Example:

```ts
// Search for blocks with a complex query
const results = await orca.invokeBackend("query", {
  q: {
    kind: 1, // AND
    conditions: [
      { kind: 3, start: { t: 1, v: 7, u: "d" }, end: { t: 1, v: 0, u: "d" } }, // Journal entries from last week
      { kind: 8, text: "meeting" }, // Containing the word "meeting"
    ],
  },
  sort: [["modified", "DESC"]],
  pageSize: 20,
})
```

## search-aliases

Searches for aliases containing specific text.

Parameters:

- keyword - The search keyword.

Returns:

An array of matching aliases.

Example:

```ts
// Search for aliases containing a keyword
const matchingAliases = await orca.invokeBackend("search-aliases", "project")
```

## search-blocks-by-text

Searches for blocks containing specific text.

Parameters:

- keyword - The search keyword.

Returns:

An array of matching blocks.

Example:

```ts
// Search for blocks containing specific text
const blocks = await orca.invokeBackend(
  "search-blocks-by-text",
  "meeting agenda",
)
```

## set-app-config

Sets an application-level configuration option.

Parameters:

- key - The configuration key (defined in AppKeys constants).
- value - The configuration value.

Returns:

void

Example:

```ts
// Set an application-level configuration option
await orca.invokeBackend("set-app-config", AppKeys.AIModel, "gpt-4")
orca.broadcasts.broadcast(BroadcastMsgs.RefreshSettings, AppKeys.AIModel)
```

## set-config

Sets a repository-level configuration option.

Parameters:

- key - The configuration key (defined in RepoKeys constants).
- value - The configuration value.

Returns:

void

Example:

```ts
// Set a repository-level configuration option
await orca.invokeBackend("set-config", RepoKeys.DefaultBlockType, "text")
```

## shell-open

Opens a URL or file using the system's default application.

Parameters:

- uri - The URL or file path to open.

Returns:

The result of the open operation.

Example:

```ts
// Open a URL in the default browser
await orca.invokeBackend("shell-open", "https://example.com")

// Open a local file with its associated application
await orca.invokeBackend("shell-open", "/path/to/document.pdf")
```

## show-in-folder

Displays a file in the system's file explorer (e.g., Finder on macOS, Explorer on Windows).

Parameters:

- filePath - The path to the file.

Returns:

void

Example:

```ts
// Show a file in the system's file explorer
await orca.invokeBackend("show-in-folder", "/path/to/file.txt")
```

## upload-asset-binary

Uploads a binary asset (e.g., an image) to the repository.

Parameters:

- mimeType - The MIME type of the asset (e.g., "image/png").
- data - The binary data (ArrayBuffer).

Returns:

The relative path of the uploaded asset.

Example:

```ts
// Upload an image as a binary asset
const imageData = new Uint8Array([...]) // Binary image data
const assetPath = await orca.invokeBackend("upload-asset-binary", "image/png", imageData.buffer)
if (assetPath) {
  console.log(`Image uploaded to: ${assetPath}`)
}
```

## upload-assets

Uploads multiple asset files to the repository.

Parameters:

- files - Array of file paths.

Returns:

The upload result, including successfully uploaded and failed files.

Example:

```ts
// Upload multiple files to the repository
const result = await orca.invokeBackend("upload-assets", [
  "/path/to/image1.jpg",
  "/path/to/image2.png",
])
console.log(
  `Uploaded: ${result.uploaded.length}, Failed: ${result.failed.length}`,
)
```
