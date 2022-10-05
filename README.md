# AVIARY IIIF Player Package


This package is used to load IIIF manifest files to build a player, metadata, and annotation. This is fully supported with Aviary IIIF Manifest files.

This player was developed as part of project, AudiAnnotate Audiovisual Extensible Workflow (AWE), funded by the Mellon Foundation. Read more about this project at https://hipstas.org/awe.

*Copyright (C) 2022 The University of Texas at Austin.*

How to install
===

`Package is registered`

In the project directory, you can run:

```
$ npm install aviary-iiif-player
```


`Package is not registered`

```
$ git clone git@github.com:WeAreAVP/aviary-iiif-player.git
$ cd react_iiif_aviary
$ yarn install
$ npm run build
$ npm link
```

now go to your react app in which you want to install package and run

```
$ npm link aviary-iiif-player
```

How to use
===

You can import single component with all features(media player, metadata, transcripts, video carousel) and you can use each component separately

```
// import single component with complete aviary look
import { AviaryIIIFPlayer } from 'aviary-iiif-player';
<AviaryIIIFPlayer manifest='path/to/manifest' />
```

```
// import each component separately
import { Player, Description, Carousel, Transcript } from 'aviary-iiif-player';
<Player manifest='path/to/manifest' />
<Carousel manifest='path/to/manifest'/>
<Transcript manifest='path/to/manifest'/>
<Description manifest='path/to/manifest'/>
```


License
===
See the [LICENSE](LICENSE.md) files for information on the project licenses and the licenses of incorporated third-party software.


Contributors
=== 

 *  Nouman Tayyab nouman@weareavp.com
 

  
