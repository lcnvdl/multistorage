# multistorage

Distributed storage system.

## Coordinator

### Introduction

The coordinator is a service that exposes an interface to manage files, like a standard file system, and internally it manages all the nodes in its net.

### Public API

#### GET /dir/:path

- Description: Gets all files and directories from a PATH.
- Arguments:
  - path: Base64 path.

## FileSystem

### Introduction

The node is a slave that manages files internally according to coordinator instructions.
