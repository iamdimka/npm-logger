# @iamdimka/logger

just another logger

## Usage

```typescript
import logger from "@iamdimka/logger"

//use default instance
logger.info("ready", { version: "1.0.0", branch: "dev" }) 
// outputs { "level": "info", "msg": "ready", "version": "1.0.0", "branch": "dev", "time": "2021-11-29T10:20:18.980Z" }
```

### setCommonData(data: Record<string, any>, append?: boolean): this

```typescript
logger.setCommonData({ environment: "dev" })
```

and every log will contain provided extra fields

### subScope(scope: string): Logger

You can create a new instance of Logger providing subscope

```typescript
const scopeA = logger.subScope("a") // every log via this instance will contain param "scope": "a"
const scopeAB = scopeA.subScope("b") // every log via this instance will contain param "scope": "a:b"
```

### setWriteStream(stream: NodeJS.WritableStream): this

sets output different from the default (process.stdout)

### log(level: string, message: string, data?: Record<string, any>): void

Write log to a stream. You can use some predefined log levels via the next methods:

- debug(message: **string**, data?: **Record<string, any>**)
- info(message: **string**, data?: **Record<string, any>**)
- warn(message: **string**, data?: **Record<string, any>**)
- error(message: **string**, data?: **Record<string, any>**)
  * if you pass an error object as data, next fields from error object will be logged as data parameters:
  * **error** - error message
  * **stack** - error stack (if defined)
  * **code** - error code (if defined)

### create instance of Logger

You can simply create new instance of Logger instead of using global:

```typescript
import Logger from "@iamdimka/logger"

const logger = new Logger();
```