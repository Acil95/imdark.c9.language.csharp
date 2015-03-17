# imdark.c9.language.csharp

This cloud 9  plugin provides some basic autocomplete functionality for c#, the code is loosly based on [omnisharp-brackets](https://github.com/OmniSharp/omnisharp-brackets).

## Competability
+It has only been tested on my windows 8.1 machine.
+But should probobly also work on linux.

## Installing:
1. Create a ".c9" folder in your cloud 9 workspace if it does not exist already.
2. create a plugins folder inside that one and copy the plugin content inside it (remove the -master in the folder name).
3. Refresh cloud 9 window

or:

use the cloud 9 developer mode to see changes instanly

## What do we have:
*Basic autocomplete for c# using the amazing [Omnisharp](http://www.omnisharp.net/).

## What is missing
* Go to definition (should be simple enought).
* Rename refuctoring
* solution generator commands using [generator-aspnet](https://github.com/OmniSharp/generator-aspnet)
* Build definition using msbuild, or roslynd by configuration.
* Debug, this can be done by wrapping the [Microsoft mdbg debugger in web sockets or web api](https://github.com/SymbolSource/Microsoft.Samples.Debugging)

## Refuctoring Todo
* move the calling to completer server to the completer using ajax like in the tern js completer by cloud 9.
* one day to implement the completer in pure js, maybe start with asm js or somthing
